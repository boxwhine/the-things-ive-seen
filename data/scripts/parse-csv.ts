import { readFileSync, writeFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Paths ──────────────────────────────────────────────────────────────────────
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const CSV_PATH = resolve(ROOT, "data/ttis-event-data-complete.csv");
const SEED_DIR = resolve(ROOT, "data/seed");

// ── Types ──────────────────────────────────────────────────────────────────────
interface CsvRow {
  event_date: string;
  event_performer_name: string;
  event_title: string;
  event_openers: string;
  event_addl_desc: string;
  event_type: string;
  event_subtype: string;
  ticket_cost: string;
  venue_name: string;
  venue_location_city: string;
  venue_location_state: string;
}

interface Performer {
  key: string;
  name: string;
}

interface Venue {
  key: string;
  name: string;
  city: string;
  state: string;
}

interface GenresFile {
  parents: { key: string; name: string }[];
  subGenres: { key: string; name: string; parentKey: string }[];
}

interface EventRecord {
  date: string;
  title: string | null;
  performerKey: string | null;
  openerKeys: string[];
  faceValue: number | null;
  genreKey: string | null;
  subGenreKey: string | null;
  venueKey: string | null;
}

// ── Genre mapping ──────────────────────────────────────────────────────────────
const EVENT_TYPE_TO_GENRE: Record<string, string> = {
  concert: "Music",
  festival: "Festival",
  comedy: "Comedy",
  sports: "Sports",
  dance: "Dance",
  theater: "Theater",
  literary: "Literary",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseDate(raw: string): string {
  // Convert M/D/YYYY → YYYY-MM-DD
  const parts = raw.split("/");
  const month = parts[0].padStart(2, "0");
  const day = parts[1].padStart(2, "0");
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

function parseCost(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[$,]/g, "");
  const val = parseFloat(cleaned);
  if (isNaN(val)) return null;
  return Math.round(val * 100);
}

function parseOpeners(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  // The csv-parse library already handles RFC 4180 quoting,
  // so `raw` is the unquoted field value. We split on ", " patterns
  // but need to be careful: openers are comma-separated within the field.
  // Since csv-parse handles the outer quoting, the raw value is like:
  //   "Neil Young, Ben Folds Five, Primus, Squirrel Nut Zippers"
  // We split on comma+space.
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function countPopulatedFields(row: CsvRow): number {
  let count = 0;
  if (row.event_performer_name) count++;
  if (row.event_title) count++;
  if (row.event_openers) count++;
  if (row.event_addl_desc) count++;
  if (row.event_type) count++;
  if (row.event_subtype) count++;
  if (row.ticket_cost) count++;
  if (row.venue_name) count++;
  if (row.venue_location_city) count++;
  if (row.venue_location_state) count++;
  return count;
}

// ── Main ───────────────────────────────────────────────────────────────────────

const csvContent = readFileSync(CSV_PATH, "utf-8");
const rows: CsvRow[] = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  relax_quotes: true,
});

console.log(`Parsed ${rows.length} CSV rows`);

// ── Collect performers ─────────────────────────────────────────────────────────
const performerSet = new Set<string>();

for (const row of rows) {
  if (row.event_performer_name) {
    performerSet.add(row.event_performer_name);
  }
  for (const opener of parseOpeners(row.event_openers)) {
    performerSet.add(opener);
  }
}

const performers: Performer[] = Array.from(performerSet)
  .sort()
  .map((name) => ({ key: name, name }));

// ── Collect venues ─────────────────────────────────────────────────────────────
const venueMap = new Map<string, Venue>();

for (const row of rows) {
  const name = row.venue_name || "";
  const city = row.venue_location_city || "";
  const state = row.venue_location_state || "";

  // Skip rows with no city and no state and no venue name
  if (!name && !city && !state) continue;

  const key = `${name}|${city}|${state}`;
  if (!venueMap.has(key)) {
    venueMap.set(key, { key, name, city, state });
  }
}

const venues: Venue[] = Array.from(venueMap.values()).sort((a, b) => a.key.localeCompare(b.key));

// ── Collect genres ─────────────────────────────────────────────────────────────
const parentGenreSet = new Set<string>();
const subGenreMap = new Map<string, string>(); // subtype → parentGenre

for (const row of rows) {
  const eventType = row.event_type?.toLowerCase();
  const parentGenre = EVENT_TYPE_TO_GENRE[eventType];
  if (parentGenre) {
    parentGenreSet.add(parentGenre);
  }

  const subtype = row.event_subtype?.trim();
  if (subtype && parentGenre) {
    // Some subtypes like "Festival" appear as subtypes of "Music" (concert type)
    if (!subGenreMap.has(subtype)) {
      subGenreMap.set(subtype, parentGenre);
    }
  }
}

const genres: GenresFile = {
  parents: Array.from(parentGenreSet)
    .sort()
    .map((name) => ({ key: name, name })),
  subGenres: Array.from(subGenreMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, parentKey]) => ({ key: name, name, parentKey })),
};

// ── Collect events (with deduplication) ────────────────────────────────────────
// Dedup key: date|performer|title|venue
const eventDedupMap = new Map<string, { row: CsvRow; populated: number }>();

for (const row of rows) {
  const date = parseDate(row.event_date);
  const performer = row.event_performer_name || "";
  const title = row.event_title || "";
  const venueName = row.venue_name || "";
  const city = row.venue_location_city || "";
  const state = row.venue_location_state || "";
  const venueKey = `${venueName}|${city}|${state}`;

  const dedupKey = `${date}|${performer}|${title}|${venueKey}`;
  const populated = countPopulatedFields(row);

  const existing = eventDedupMap.get(dedupKey);
  if (!existing) {
    eventDedupMap.set(dedupKey, { row, populated });
  } else {
    // Keep the row with more populated fields (especially non-empty subtype)
    const existingHasSubtype = !!existing.row.event_subtype?.trim();
    const newHasSubtype = !!row.event_subtype?.trim();

    if (newHasSubtype && !existingHasSubtype) {
      eventDedupMap.set(dedupKey, { row, populated });
    } else if (populated > existing.populated) {
      eventDedupMap.set(dedupKey, { row, populated });
    }
  }
}

const duplicateCount = rows.length - eventDedupMap.size;
console.log(`Found ${duplicateCount} duplicate rows, ${eventDedupMap.size} unique events`);

const events: EventRecord[] = [];

for (const { row } of eventDedupMap.values()) {
  const date = parseDate(row.event_date);
  const title = row.event_title?.trim() || null;
  const performerKey = row.event_performer_name?.trim() || null;

  // Events must have title OR performerKey OR both
  if (!title && !performerKey) continue;

  const openerKeys = parseOpeners(row.event_openers);

  const faceValue = parseCost(row.ticket_cost);

  const eventType = row.event_type?.toLowerCase();
  const genreKey = EVENT_TYPE_TO_GENRE[eventType] || null;
  const subGenreKey = row.event_subtype?.trim() || null;

  const venueName = row.venue_name || "";
  const city = row.venue_location_city || "";
  const state = row.venue_location_state || "";
  const venueKey = venueName || city || state ? `${venueName}|${city}|${state}` : null;

  events.push({
    date,
    title,
    performerKey,
    openerKeys,
    faceValue,
    genreKey,
    subGenreKey,
    venueKey,
  });
}

// Sort events by date
events.sort((a, b) => a.date.localeCompare(b.date));

// ── Write output files ─────────────────────────────────────────────────────────
const writeJson = (filename: string, data: unknown) => {
  const path = resolve(SEED_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`Wrote ${path}`);
};

writeJson("performers.json", performers);
writeJson("venues.json", venues);
writeJson("genres.json", genres);
writeJson("events.json", events);

// ── Summary ────────────────────────────────────────────────────────────────────
console.log(`\nSummary:`);
console.log(`  Performers: ${performers.length}`);
console.log(`  Venues:     ${venues.length}`);
console.log(
  `  Genres:     ${genres.parents.length} parents, ${genres.subGenres.length} sub-genres`,
);
console.log(`  Events:     ${events.length}`);
