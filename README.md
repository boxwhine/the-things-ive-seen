> [!NOTE]
> This project is still in progress, so there might not be much to see yet, but it'll be improved over time.

# The Things I've Seen

_Concert/event dashboard and visualization app_

<img src="repo-icon.jpg" alt="Joey Ramone" title="Joey Ramone" width="225" align="left" />

Just a hobby project I've been working on to demo various technologies using the concerts and events I've attended as a dataset.

I've saved the ticket stubs from (almost) every concert I've been to since I was a teenager (or at least the emails and digital tickets since we don't get paper tickets these days). I thought it would be interesting to use as a dataset for creating a hobby code project using the latest technologies.

So far, it's mainly just a list of events that link to detail pages, but eventually I would like to tie it into third party API's like Spotify, Setlist.fm, Last.fm, Google Maps, et al., to create a more rich experience.

<br clear="left" />

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

## Resources

- [Trello board for tracking work items](https://trello.com/b/oMusq7vm/the-things-ive-seen)

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

### Quick Start (Docker)

```bash
docker-compose up        # Starts API (:4000), UI (:3000), PostgreSQL (:5432), Adminer (:8080)
```

### Quick Start (Local)

```bash
pnpm install             # Install all dependencies
docker-compose up ttis-db  # Start PostgreSQL only
pnpm --filter @ttis/api exec prisma migrate dev  # Run database migrations
pnpm dev                 # Start API + UI dev servers
```

### Verify It Works

- UI: http://localhost:3000
- GraphQL Playground: http://localhost:4000/playground
- Adminer (DB GUI): http://localhost:8080

### Packages

See each package's README for detailed setup and usage:

| Package                                | Description                         |
| -------------------------------------- | ----------------------------------- |
| [packages/api](packages/api/README.md) | GraphQL API (Yoga, Pothos, Prisma)  |
| [packages/ui](packages/ui/README.md)   | Next.js frontend (Apollo, Tailwind) |
