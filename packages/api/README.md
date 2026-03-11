# @ttis/api

GraphQL API for The Things I've Seen. Built with GraphQL Yoga, Pothos, Prisma, and PostgreSQL.

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (or Docker)

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
   docker-compose up ttis-db
   ```

## Running

### Local dev server (with hot reload)

```bash
# From repo root
pnpm dev:api

# Or from this directory
pnpm dev
```

The GraphQL API will be available at http://localhost:4000 with the playground at http://localhost:4000/playground.

### Via Docker Compose

```bash
# From repo root — starts DB, API, UI, and Adminer
docker-compose up
```

### Production build

```bash
pnpm start
```

Compiles TypeScript and runs the built output.

## Testing

```bash
pnpm test          # Single run
pnpm test:watch    # Watch mode
```

## Linting & Formatting

```bash
pnpm lint          # TypeScript type-check + ESLint (auto-fix)
pnpm format        # Prettier
```

## Project Structure

```
src/
├── index.ts        # GraphQL Yoga server entry point
├── models/         # Sequelize-TypeScript models
├── resolvers/      # GraphQL resolvers (Pothos schema builder)
└── db/             # Database instance and seeding
prisma/
├── schema.prisma   # Prisma schema
└── prisma.config.ts
```

## Useful URLs

| Service            | URL                              |
| ------------------ | -------------------------------- |
| GraphQL API        | http://localhost:4000            |
| GraphQL Playground | http://localhost:4000/playground |
| Adminer (DB GUI)   | http://localhost:8080            |
