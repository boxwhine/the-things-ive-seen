# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## Project Overview

A concert/event tracking and visualization app. Monorepo with pnpm workspaces containing two packages:

- **@ttis/api** - GraphQL backend (GraphQL Yoga, Pothos, Prisma, PostgreSQL)
- **@ttis/ui** - Next.js 16 frontend (React 19, Apollo Client, Tailwind CSS v4, shadcn/ui)

See `docs/ARCHITECTURE.md` for the full target architecture and ADR log.
See `docs/STATUS.md` for current implementation state and active blockers.

## Approach Before Action

- For Docker/infra changes, propose the approach (e.g., Dockerfile edit vs compose.yml env_file) BEFORE editing files
- Don't install system tools (brew/apt) without explicit approval
- If a fix path gets long (>2 failed attempts), stop and summarize alternatives before continuing
- Always verify the installed version of a package and check current docs before writing.
- This repo is still in "v0" mode--nothing is in production yet.
- Work with the user like a pair programmer: working through the sections/checklists under `docs/modules/*` in order, creating a plan for each section and consulting with the user before work starts and after each section is complete.
- Remember: the ultimate goal of this repo is to _teach_ the user about all of the individual pieces of the infrastructure. So, cranking out a bunch of code as quickly as possible isn't as valuable here vs. working in smaller chunks and explaining the WHY behind them.

## Use Task Agents for multi-issue debugging

When a session has multiple independent bugs or tasks that can be run in parallel, use a separate Task agent to investigate each one in parallel in its own scope, then report findings before making any fixes.

## Common Commands

### Development

```bash
pnpm dev                   # Start DB in Docker + run API and UI locally with hot reload
pnpm dev:api               # Run API dev server only (assumes DB is running)
pnpm dev:ui                # Run UI dev server only
pnpm dev:infra             # Start just the DB + Adminer containers
pnpm dev:infra:down        # Stop the DB + Adminer containers
```

### Production (local testing)

```bash
pnpm prod                  # Build and run full stack in Docker (DB, API, UI, Adminer)
pnpm prod:down             # Stop the production stack
```

### Testing

```bash
pnpm test                  # Run tests across all packages (Vitest)
pnpm --filter @ttis/api test # Run tests in a specific package
```

### Linting

```bash
pnpm lint                  # Lint all packages
pnpm --filter @ttis/api lint # Lint a specific package
```

### Type Checking

```bash
pnpm types                 # Type-check all packages
```

### Formatting

```bash
pnpm format                # Run Prettier across all packages
```

### Building

```bash
pnpm build                 # Build all packages
```

### Data Scripts

```bash
pnpm parse-csv             # Parse source CSV data (data/scripts/parse-csv.ts)
```

### Package-Specific

**API (`packages/api`):**

```bash
pnpm --filter @ttis/api dev    # tsx with hot reload
pnpm --filter @ttis/api build  # Generate Prisma client + compile TypeScript
pnpm --filter @ttis/api start  # Run compiled production build
```

**UI (`packages/ui`):**

```bash
pnpm --filter @ttis/ui dev     # Next.js dev server
pnpm --filter @ttis/ui build   # Production build
```

### Adding Dependencies

```bash
pnpm --filter @ttis/api add <dep>   # Add dep to API package
pnpm --filter @ttis/ui add <dep>    # Add dep to UI package
```

## Architecture

### Data Flow

UI (Apollo Client) → GraphQL API (GraphQL Yoga + Pothos) → Prisma ORM → PostgreSQL

### API Package (`packages/api`)

- **src/schema/** - Pothos schema builders (builder.ts, event.ts, venue.ts, genre.ts, index.ts)
- **src/db/** - Prisma client instance (prisma.ts)
- **src/config.ts** - Environment/config loading
- **src/index.ts** - GraphQL Yoga server entry point
- **prisma/** - Prisma schema, migrations, generated client

### UI Package (`packages/ui/src`)

- **app/** - Next.js App Router pages (home, about, events, venues)
- **components/** - React components and shadcn/ui primitives
- **graphql/** - Apollo queries and mutations
- **lib/** - Shared utilities (e.g., shadcn `cn` helper)

### Key Patterns

- Pothos schema builders with Prisma plugin generate the GraphQL schema automatically
- Apollo Client queries/mutations are defined in separate files under `ui/src/graphql/`
- Environment config via `.env` files

## Development URLs

- GraphQL endpoint (GraphiQL UI): http://localhost:4000/graphql
- UI: http://localhost:3000
- Adminer (DB GUI): http://localhost:8080

## Git Workflow

- **Never commit directly to `main`.** Always ensure you are on a feature branch before committing changes.
- If currently on `main`, create a new branch before making any commits.

## Stack Conventions

- Prisma 7 config syntax (not legacy seed config)
- ESM imports require explicit `.js` extensions
- Next.js standalone output requires manual static file copying
- Turborepo: ensure `prisma generate` is declared as a task dependency

## Documentation Maintenance

When committing changes, always review whether project documentation needs updates to reflect the work done. Documentation updates should be included in the same commit as the code changes they describe.

- **`docs/STATUS.md`** — Keep module progress, "What Is Working", and "Active Blockers" sections current. When work changes the state of a feature or resolves a blocker, update this file.
- **`docs/modules/*.md`** — When work completes acceptance criteria items or changes their scope, update the relevant module file's checklists and notes.
- **`docs/ARCHITECTURE.md`** — If a change introduces or revises an architectural decision, add or update the appropriate ADR entry.
- **`README.md` files** — When adding, removing, or renaming npm scripts, CLI commands, or setup steps, update any README that documents them to keep instructions accurate.

Verify checklist items against actual code/config before marking complete.

## Document Styling Preferences

When editing or creating Markdown documents in this repo:

- Do not use horizontal rules (`---`) before section headers. Let headings stand on their own.
- Use `<br/>` for line breaks inside Mermaid node labels, not `\n`.
- Diagrams should use Mermaid (` ```mermaid `) rather than ASCII art.
- After creating or editing any `*.md` file, run `pnpm format` (or `npx prettier --write <file>`) to ensure consistent formatting.
