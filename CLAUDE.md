# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A concert/event tracking and visualization app. Monorepo with Lerna/npm workspaces containing two packages:
- **@ttis/api** - GraphQL backend (GraphQL Yoga, Sequelize, PostgreSQL)
- **@ttis/ui** - Next.js 14 frontend (React 18, Apollo Client, Tailwind/DaisyUI)

## Common Commands

### Development
```bash
docker-compose up          # Start all services (API :4000, UI :3000, PostgreSQL :5432, Adminer :8080)
```

### Testing
```bash
npx lerna run test         # Run tests across all packages
npm test                   # Run tests in current package (both use Vitest)
npm run test:watch         # Watch mode in current package
```

### Linting
```bash
npx lerna run lint         # Lint all packages
npm run lint               # Lint current package
```

### Package-Specific
**API (`packages/api`):**
```bash
npm run dev                # ts-node-dev with hot reload
npm start                  # Compile and run production
```

**UI (`packages/ui`):**
```bash
npm run dev                # Next.js dev server
npm run build              # Production build
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
