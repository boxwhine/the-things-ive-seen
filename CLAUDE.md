# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A concert/event tracking and visualization app. Monorepo with pnpm workspaces containing two packages:
- **@ttis/api** - GraphQL backend (GraphQL Yoga, Sequelize, PostgreSQL)
- **@ttis/ui** - Next.js 14 frontend (React 18, Apollo Client, Tailwind/DaisyUI)

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
pnpm --filter @ttis/api dev    # ts-node-dev with hot reload
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
UI (Apollo Client) → GraphQL API (GraphQL Yoga) → Sequelize ORM → PostgreSQL

### API Package (`packages/api/src`)
- **models/** - Sequelize-TypeScript models with Type-GraphQL decorators (Event, Genre, Venue)
- **resolvers/** - Type-GraphQL resolvers that auto-generate GraphQL schema
- **db/** - Sequelize instance and database seeding
- **index.ts** - GraphQL Yoga server entry point

### UI Package (`packages/ui/src`)
- **app/** - Next.js App Router pages (home, about, events, venues)
- **components/** - React components (Nav, addEvent, addVenue, venueSearch)
- **graphql/** - Apollo queries and mutations

### Key Patterns
- Type-GraphQL decorators on Sequelize models generate the GraphQL schema automatically
- Apollo Client queries/mutations are defined in separate files under `ui/src/graphql/`
- Environment config via `.env` files (templates in `.env.dev`)

## Development URLs
- GraphQL Playground: http://localhost:4000/playground
- UI: http://localhost:3000
- Adminer (DB GUI): http://localhost:8080
