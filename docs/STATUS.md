# Project Status

**Last Updated:** 2026-03-25

**Active Module:** 1 — Containerization & Local Kubernetes

> [!NOTE]
> This document tracks current implementation state, active blockers, and in-progress work. It is expected to change frequently. For the stable target architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Module Progress

| Module | Focus                                | Status         | Start Date | End Date |
| ------ | ------------------------------------ | -------------- | ---------- | -------- |
| 1      | Containerization & Local Kubernetes  | 🟡 In Progress | 2026-03-03 |          |
| 2      | Build System & CI/CD Foundation      | ⬜ Not Started |            |          |
| 3      | Cloud Infrastructure & Terraform     | ⬜ Not Started |            |          |
| 4      | Service Extraction & Message Queue   | ⬜ Not Started |            |          |
| 5      | Observability — Metrics & Dashboards | ⬜ Not Started |            |          |
| 6      | Observability — Logging & Tracing    | ⬜ Not Started |            |          |
| 7      | Alerting & Incident Response         | ⬜ Not Started |            |          |
| 8      | GitOps & Advanced Deployment         | ⬜ Not Started |            |          |
| 9      | Chaos Engineering & Polish           | ⬜ Not Started |            |          |

## Current Stack

| Layer            | Technology                                       | Notes                            |
| ---------------- | ------------------------------------------------ | -------------------------------- |
| Frontend         | Next.js 16, React 19, Apollo Client, Tailwind v4 |                                  |
| API              | GraphQL Yoga v5, Pothos v4, TypeScript           |                                  |
| ORM              | Prisma v7                                        | Recently migrated from Sequelize |
| Database         | PostgreSQL 11.4                                  | Upgrading to 16 (ADR-009)        |
| Package Manager  | pnpm v10 (workspaces)                            |                                  |
| Containerization | Docker + Docker Compose                          |                                  |

## What Is Working

- Monorepo structure with pnpm workspaces (`packages/api`, `packages/ui`)
- GraphQL Yoga server with Pothos schema builder and auto-generated schema
- Next.js frontend with Apollo Client, Radix UI primitives, and shadcn/ui components
- Docker Compose dev environment (API, UI, PostgreSQL, Adminer)
- Husky + lint-staged pre-commit hooks (ESLint + Prettier)
- Production Dockerfiles (multi-stage builds) for API and UI
- Seed data pipeline: CSV → JSON → Prisma seed script (~500 concert records)

## Active Blockers

These must be resolved before Module 2 work begins. They reflect the cost of modernizing the app (ORM migration, framework upgrades, package manager migration) concurrently with production planning.

| Blocker                 | Description                                                                          | Module |
| ----------------------- | ------------------------------------------------------------------------------------ | ------ |
| Prisma client not wired | Schema defined but client not fully connected to DB; queries not verified end-to-end | 1      |
| Seeding not working     | Prisma-based seed script exists but not verified against live DB                     | 1      |
| Hardcoded Apollo URI    | UI points to `http://localhost:4000` — no environment-based config                   | 1      |
| PostgreSQL 11.4 EOL     | Running an end-of-life database version; upgrading to 16                             | 1      |

## Module 1 Checklist

### Prerequisites

- [ ] Wire Prisma client to database and verify end-to-end queries
- [ ] Get seed data working via Prisma against live DB
- [ ] Upgrade PostgreSQL from 11.4 → 16 in docker-compose
- [ ] Move Apollo Client URI to environment variable

### Docker

- [ ] Verify API container builds and runs
- [ ] Verify UI container builds and runs
- [ ] Verify full stack works via docker-compose

### Kubernetes

- [ ] Install k3s or enable Kubernetes in Docker Desktop
- [ ] Write Deployment manifests for API, UI, PostgreSQL
- [ ] Add liveness and readiness probes to all Deployments
- [ ] Set resource requests and limits
- [ ] Verify full stack running in local cluster
- [ ] Verify services can communicate

### Hardening

- [ ] Document all dependencies (Node version, DB, env vars)
- [ ] Update README with local setup instructions

## Notes & Discoveries

> [!TIP]
> Use this section to capture anything unexpected, decisions made on the fly, or context that doesn't warrant a full ADR. Append entries as you go.

- **2026-03-25** — Modernizing the app and planning production hardening simultaneously created significant churn not accounted for in the original module timeline. The prerequisite blockers above are a direct result. This is expected and documented intentionally — it reflects real-world project conditions.
