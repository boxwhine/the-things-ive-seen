> [!NOTE]
> This project is still in progress, so there might not be much to see yet, but it'll be improved over time.

# The Things I've Seen

_Concert/event dashboard and visualization app_

Just a hobby project I've been working on to demo various technologies using the concerts and events I've attended as a dataset.

I've saved the ticket stubs from (almost) every concert I've been to since I was a teenager (or at least the emails and digital tickets since we don't get paper tickets these days). I thought it would be interesting to use as a dataset for creating a hobby code project using the latest technologies.

So far, it's mainly just a list of events that link to detail pages, but eventually I would like to tie it into third party API's like Spotify, Setlist.fm, Last.fm, Google Maps, et al., to create a more rich experience.

## Potential features

- "Play this artist" on Spotify
- Display actual setlist from concert
- Plot venues on interactive map
- Filter by taxonomies, e.g., genre, venue

## Architecture

This project is being systematically production-hardened as a hands-on SRE/DevOps learning exercise — covering containerization, CI/CD, cloud infrastructure (AWS EKS), observability, alerting, chaos engineering, and GitOps across a 9-module roadmap.

| Document                                     | Description                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Full target architecture, system diagrams, technology decisions, and ADR index |
| [docs/STATUS.md](docs/STATUS.md)             | Current implementation state, active blockers, and module progress             |
| [docs/adr/](docs/adr/README.md)              | Individual Architecture Decision Records                                       |

## Development

### Prerequisites

| Dependency | Version | Notes                                  |
| ---------- | ------- | -------------------------------------- |
| Node.js    | 22+     | Dockerfiles pin 22; local dev ≥ 24     |
| pnpm       | 10.30+  | Enforced via `packageManager`          |
| Docker     | 20+     | For containerized workflow             |
| PostgreSQL | 16      | Provided via Docker or install locally |

### Environment Variables

Copy the sample env files before starting:

```bash
cp packages/api/.env.sample packages/api/.env
cp packages/ui/.env.sample packages/ui/.env
```

**API** (`packages/api/.env`):

| Variable            | Description                                | Example                                                 |
| ------------------- | ------------------------------------------ | ------------------------------------------------------- |
| `POSTGRES_DB`       | Database name (used by Postgres image)     | `ttis_db`                                               |
| `POSTGRES_USER`     | Database user (used by Postgres image)     | `postgres`                                              |
| `POSTGRES_PASSWORD` | Database password (used by Postgres image) | `password`                                              |
| `DATABASE_URL`      | Prisma connection string                   | `postgresql://postgres:password@localhost:5432/ttis_db` |

**UI** (`packages/ui/.env`):

| Variable              | Description              | Default                         |
| --------------------- | ------------------------ | ------------------------------- |
| `NEXT_PUBLIC_API_URL` | GraphQL API endpoint URL | `http://localhost:4000/graphql` |

### Quick Start

```bash
pnpm install             # Install all dependencies
pnpm dev                 # Start DB (Docker) + API and UI locally with hot reload
```

This starts PostgreSQL and Adminer in Docker, then runs the API and UI dev servers locally for fast iteration and hot reload.

On first run, you'll also need to run database migrations:

```bash
pnpm --filter @ttis/api exec prisma migrate dev
```

### Production (Docker Compose)

```bash
pnpm prod                # Build and run full stack in Docker (DB, API, UI, Adminer)
pnpm prod:down           # Stop everything
```

### Kubernetes (Local k3d)

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/db-deployment.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/ui-deployment.yaml
kubectl apply -f k8s/db-migrate-job.yaml    # Run Prisma migrations
```

Access services via port-forward:

```bash
kubectl port-forward -n ttis svc/api 4000:4000
kubectl port-forward -n ttis svc/ui 3000:3000
```

### Other Commands

```bash
pnpm test                # Run tests across all packages (Vitest, via Turbo)
pnpm lint                # Lint all packages (via Turbo)
pnpm types               # Type-check all packages with `tsc --noEmit` (via Turbo)
pnpm format              # Format the whole tree (oxfmt)
pnpm build               # Build all packages (via Turbo, with remote cache)
pnpm parse-csv           # Parse CSV data into JSON for seeding
```

### Verify It Works

- UI: http://localhost:3000
- GraphQL Playground: http://localhost:4000/graphql
- Adminer (DB GUI): http://localhost:8080

### Packages

See each package's README for detailed setup and usage:

| Package                                | Description                         |
| -------------------------------------- | ----------------------------------- |
| [packages/api](packages/api/README.md) | GraphQL API (Yoga, Pothos, Prisma)  |
| [packages/ui](packages/ui/README.md)   | Next.js frontend (Apollo, Tailwind) |
