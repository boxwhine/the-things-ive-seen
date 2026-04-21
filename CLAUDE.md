# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## Project Overview

A concert/event tracking and visualization app. Monorepo with pnpm workspaces containing two packages:

- **@ttis/api** - GraphQL backend (GraphQL Yoga, Pothos, Prisma, PostgreSQL)
- **@ttis/ui** - Next.js 16 frontend (React 19, Apollo Client, Tailwind CSS v4, shadcn/ui)

See `docs/ARCHITECTURE.md` for the full target architecture and ADR log.
See `docs/STATUS.md` for current implementation state and active blockers.

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
pnpm --filter @ttis/ui test  # Run tests in a specific package
```

### Linting

```bash
pnpm lint                  # Lint all packages
pnpm --filter @ttis/api lint # Lint a specific package
```

### Building

```bash
pnpm build                 # Build all packages
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

### API Package (`packages/api/src`)

- **schema/** - Pothos schema builders (event.ts, venue.ts, genre.ts)
- **prisma/** - Prisma schema, migrations, generated client
- **index.ts** - GraphQL Yoga server entry point

### UI Package (`packages/ui/src`)

- **app/** - Next.js App Router pages (home, about, events, venues)
- **components/** - React components and shadcn/ui primitives
- **graphql/** - Apollo queries and mutations

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

## Documentation Maintenance

When committing changes, always review whether project documentation needs updates to reflect the work done. Documentation updates should be included in the same commit as the code changes they describe.

- **`docs/STATUS.md`** — Keep module progress, "What Is Working", and "Active Blockers" sections current. When work changes the state of a feature or resolves a blocker, update this file.
- **`docs/modules/*.md`** — When work completes acceptance criteria items or changes their scope, update the relevant module file's checklists and notes.
- **`docs/ARCHITECTURE.md`** — If a change introduces or revises an architectural decision, add or update the appropriate ADR entry.
- **`README.md` files** — When adding, removing, or renaming npm scripts, CLI commands, or setup steps, update any README that documents them to keep instructions accurate.

## Document Styling Preferences

When editing or creating Markdown documents in this repo:

- Do not use horizontal rules (`---`) before section headers. Let headings stand on their own.
- Use `<br/>` for line breaks inside Mermaid node labels, not `\n`.
- Diagrams should use Mermaid (` ```mermaid `) rather than ASCII art.
- After creating or editing any `*.md` file, run `pnpm format` (or `npx prettier --write <file>`) to ensure consistent formatting.
