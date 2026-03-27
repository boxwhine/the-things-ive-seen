import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "prisma/config";
import { PrismaClient } from "../lib/prisma/client";

const adapter = new PrismaPg({
  connectionString: env("DATABASE_URL"),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Genres ---
  const rock = await prisma.genre.create({
    data: { name: "Rock" },
  });
  const indie = await prisma.genre.create({
    data: { name: "Indie", parentId: rock.id },
  });
  const punk = await prisma.genre.create({
    data: { name: "Punk", parentId: rock.id },
  });
  const electronic = await prisma.genre.create({
    data: { name: "Electronic" },
  });
  const house = await prisma.genre.create({
    data: { name: "House", parentId: electronic.id },
  });
  const hiphop = await prisma.genre.create({
    data: { name: "Hip-Hop" },
  });
  const country = await prisma.genre.create({
    data: { name: "Country" },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const jazz = await prisma.genre.create({
    data: { name: "Jazz" },
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const metal = await prisma.genre.create({
    data: { name: "Metal", parentId: rock.id },
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const techno = await prisma.genre.create({
    data: { name: "Techno", parentId: electronic.id },
  });

  // --- Venues ---
  const fillmore = await prisma.venue.create({
    data: {
      name: "The Fillmore",
      address: "1805 Geary Blvd",
      city: "San Francisco",
      state: "CA",
    },
  });

  const redRocks = await prisma.venue.create({
    data: {
      name: "Red Rocks Amphitheatre",
      address: "18300 W Alameda Pkwy",
      city: "Morrison",
      state: "CO",
    },
  });

  const ninethirty = await prisma.venue.create({
    data: {
      name: "9:30 Club",
      address: "815 V St NW",
      city: "Washington",
      state: "DC",
    },
  });

  const ryman = await prisma.venue.create({
    data: {
      name: "Ryman Auditorium",
      address: "116 5th Ave N",
      city: "Nashville",
      state: "TN",
    },
  });

  // --- Events ---
  await prisma.event.createMany({
    data: [
      {
        name: "Tame Impala",
        date: new Date("2024-06-15"),
        venueId: redRocks.id,
        genreId: rock.id,
        subGenreId: indie.id,
        faceValue: 7500,
      },
      {
        name: "Disclosure",
        date: new Date("2024-08-22"),
        venueId: fillmore.id,
        genreId: electronic.id,
        subGenreId: house.id,
        faceValue: 4500,
      },
      {
        name: "Fugazi",
        date: new Date("2024-03-10"),
        venueId: ninethirty.id,
        genreId: rock.id,
        subGenreId: punk.id,
        faceValue: 1500,
        wasOpener: false,
      },
      {
        name: "Tyler, the Creator",
        date: new Date("2024-09-05"),
        venueId: redRocks.id,
        genreId: hiphop.id,
        faceValue: 8500,
      },
      {
        name: "Sturgill Simpson",
        date: new Date("2024-11-20"),
        venueId: ryman.id,
        genreId: country.id,
        faceValue: 6000,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  });
