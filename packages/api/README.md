# @ttis/api

GraphQL API for The Things I've Seen. Built with GraphQL Yoga, Pothos, Prisma, and PostgreSQL.

## Prerequisites

- Node.js 22+
- pnpm 10.30+
- PostgreSQL 16 (or Docker)

## Setup

1. **Install dependencies** (from repo root):

   ```bash
   pnpm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.sample .env
   ```

   Fill in your Postgres credentials and `DATABASE_URL`.

3. **Generate the Prisma client:**

   ```bash
   pnpm --filter @ttis/api generate
   ```

4. **Start the database** (if using Docker):

   ```bash
   # From repo root
   pnpm dev:infra          # Start DB + Adminer containers
   pnpm dev:infra:down     # Stop them
   ```

## Running

### Local dev server (with hot reload)

```bash
# From repo root
pnpm dev:api

# Or from this directory
pnpm dev
```

The GraphQL API will be available at http://localhost:4000 with the playground at http://localhost:4000/graphql.

### Via Docker Compose

```bash
# From repo root — starts DB, API, UI, and Adminer
pnpm prod
```

### Production build

```bash
pnpm build         # Generate Prisma client + compile TypeScript
pnpm start         # Run compiled production build
```

### Database Commands

```bash
pnpm prisma <cmd>        # Run any Prisma CLI command (uses prisma.config.ts)
pnpm db:reset            # Reset database and rerun migrations
pnpm db:seed             # Seed database with concert data
```

## Testing

```bash
pnpm test          # Single run
pnpm test:watch    # Watch mode
```

## Linting & Formatting

```bash
pnpm lint          # Oxlint (type-aware)
pnpm format        # Prettier
```

## Project Structure

```
src/
├── index.ts        # GraphQL Yoga server entry point
├── schema/         # Pothos schema builders (event, venue, genre)
├── db/             # Prisma client instance
└── config.ts       # Server configuration
prisma/
├── schema.prisma   # Prisma schema
├── prisma.config.ts
├── seed.ts         # Database seed script
└── migrations/     # Prisma migrations
```

## Useful URLs

| Service            | URL                           |
| ------------------ | ----------------------------- |
| GraphQL API        | http://localhost:4000         |
| GraphQL Playground | http://localhost:4000/graphql |
| Adminer (DB GUI)   | http://localhost:8080         |
