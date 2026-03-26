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
docker-compose up          # Start all services (API :4000, UI :3000, PostgreSQL :5432, Adminer :8080)
pnpm dev                   # Run both API and UI dev servers locally
pnpm dev:api               # Run API dev server only
pnpm dev:ui                # Run UI dev server only
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
pnpm --filter @ttis/api start  # Compile and run production
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

- GraphQL Playground: http://localhost:4000/playground
- UI: http://localhost:3000
- Adminer (DB GUI): http://localhost:8080

## Document Styling Preferences

When editing or creating Markdown documents in this repo:

- Do not use horizontal rules (`---`) before section headers. Let headings stand on their own.
- Use `<br/>` for line breaks inside Mermaid node labels, not `\n`.
- Diagrams should use Mermaid (` ```mermaid `) rather than ASCII art.
- After creating or editing any `*.md` file, run `pnpm format` (or `npx prettier --write <file>`) to ensure consistent formatting.
