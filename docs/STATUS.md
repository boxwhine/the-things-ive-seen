# Project Status

**Last Updated:** 2026-04-13

**Active Module:** 2 — Build System & CI/CD Foundation

> [!NOTE]
> This document tracks current implementation state, active blockers, and in-progress work. It is expected to change frequently. For the stable target architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Module Progress

For full acceptance criteria, implementation checklists, and per-module notes, see [`docs/modules/`](./modules/README.md).

| Module                                            | Focus                                | Status         | Start Date | End Date   |
| ------------------------------------------------- | ------------------------------------ | -------------- | ---------- | ---------- |
| [01](./modules/module-01-containerization.md)     | Containerization & Local Kubernetes  | ✅ Complete    | 2026-03-03 | 2026-04-03 |
| [02](./modules/module-02-cicd.md)                 | Build System & CI/CD Foundation      | 🟡 In Progress | 2026-04-13 |            |
| [03](./modules/module-03-cloud-infrastructure.md) | Cloud Infrastructure & Terraform     | ⬜ Not Started |            |            |
| [04](./modules/module-04-auth.md)                 | Authentication & Authorization       | ⬜ Not Started |            |            |
| [05](./modules/module-05-service-extraction.md)   | Service Extraction & Message Queue   | ⬜ Not Started |            |            |
| [06](./modules/module-06-metrics-dashboards.md)   | Observability — Metrics & Dashboards | ⬜ Not Started |            |            |
| [07](./modules/module-07-logging-tracing.md)      | Observability — Logging & Tracing    | ⬜ Not Started |            |            |
| [08](./modules/module-08-alerting.md)             | Alerting & Incident Response         | ⬜ Not Started |            |            |
| [09](./modules/module-09-gitops.md)               | GitOps & Advanced Deployment         | ⬜ Not Started |            |            |
| [10](./modules/module-10-chaos.md)                | Chaos Engineering & Polish           | ⬜ Not Started |            |            |

## Current Stack

| Layer            | Technology                                       | Notes                            |
| ---------------- | ------------------------------------------------ | -------------------------------- |
| Frontend         | Next.js 16, React 19, Apollo Client, Tailwind v4 |                                  |
| API              | GraphQL Yoga v5, Pothos v4, TypeScript           |                                  |
| ORM              | Prisma v7                                        | Recently migrated from Sequelize |
| Database         | PostgreSQL 16                                    | Upgraded from 11.4 (ADR-009)     |
| Package Manager  | pnpm v10 (workspaces)                            |                                  |
| Containerization | Docker + Docker Compose                          |                                  |
| Orchestration    | k3d (k3s in Docker)                              | Local 3-node cluster             |

## What Is Working

- Monorepo structure with pnpm workspaces (`packages/api`, `packages/ui`)
- GraphQL Yoga server with Pothos schema builder and auto-generated schema
- Next.js frontend with Apollo Client, Radix UI primitives, and shadcn/ui components
- Docker Compose dev environment (API, UI, PostgreSQL, Adminer)
- Husky + lint-staged pre-commit hooks (ESLint + Prettier)
- Production Dockerfiles (multi-stage builds) for API and UI
- Local Kubernetes cluster (k3d) with API, UI, and PostgreSQL deployments
- Liveness/readiness probes and resource limits on all K8s deployments
- Prisma migration Job for database schema deployment in K8s
- Seed data pipeline: CSV → JSON → Prisma seed script (~500 concert records)
- Turborepo task pipelines (build, lint, test, types) with Vercel remote caching

## Active Blockers

None — all Module 1 prerequisite blockers have been resolved:

- ~~Prisma client not wired~~ — resolved; end-to-end queries verified
- ~~Seeding not working~~ — resolved; Prisma seed script runs against live DB
- ~~Hardcoded Apollo URI~~ — resolved; moved to `NEXT_PUBLIC_API_URL` env var
- ~~PostgreSQL 11.4 EOL~~ — resolved; upgraded to PostgreSQL 16 (ADR-009)

## Active Module Detail

See [Module 02](./modules/module-02-cicd.md) for the full acceptance criteria checklist and in-progress notes.
