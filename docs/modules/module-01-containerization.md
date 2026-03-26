# Module 01: Containerization & Local Kubernetes

**Status:** 🟡 In Progress

**Start Date:** 2026-03-03

**End Date:** —

## Goal

Get the full application stack running in a local Kubernetes cluster with production-grade configuration: liveness/readiness probes, resource requests and limits, and verified end-to-end connectivity. This module also resolves pre-existing modernization debt before production hardening begins in earnest.

## Acceptance Criteria

### Prerequisites (modernization debt)

- [x] Audit current repo, get it running locally
- [x] Reboot UI to use latest Next.js, TypeScript, Tailwind, and shadcn/ui
- [x] Migrate API ORM from Sequelize to Prisma
- [ ] Wire Prisma client to database and verify end-to-end queries
- [ ] Get real initial data seeding working via Prisma
- [ ] Upgrade PostgreSQL from 11.4 → 16 in docker-compose
- [ ] Move Apollo Client URI to environment variable
- [ ] Document all dependencies (Node version, DB version, env vars)

### Docker

- [ ] Verify API container builds and runs
- [ ] Verify UI container builds and runs
- [ ] Verify full stack works via docker-compose
- [ ] Update README with local setup instructions

### Kubernetes

- [ ] Install k3s or enable Kubernetes in Docker Desktop
- [ ] Learn basic kubectl commands (get, describe, logs, exec)
- [ ] Understand pods, deployments, services, namespaces
- [ ] Write Deployment manifest for GraphQL API
- [ ] Write Deployment manifest for Next.js UI
- [ ] Deploy PostgreSQL in Kubernetes (or use external connection)
- [ ] Get full stack running in local Kubernetes
- [ ] Verify services can communicate

### Hardening

- [ ] Add liveness and readiness probes to all Deployments
- [ ] Set CPU and memory requests and limits on all Deployments
- [ ] Debug any remaining connectivity or config issues

## Related ADRs

- [ADR-0001](../adr/0001-migrate-orm-to-prisma.md) — Migrated ORM from Sequelize to Prisma
- [ADR-0002](../adr/0002-migrate-to-pothos.md) — Migrated schema builder from Type-GraphQL to Pothos
- [ADR-0003](../adr/0003-migrate-to-pnpm-workspaces.md) — Migrated package manager from npm to pnpm workspaces
- [ADR-0009](../adr/0009-postgresql-version-upgrade.md) — Upgrading PostgreSQL from 11.4 to 16

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.

- **2026-03-25** — Modernizing the app (ORM migration, framework upgrades, package manager migration) concurrently with production planning created significant churn not accounted for in the original module timeline. The prerequisite checklist above is a direct result. This is expected and documented intentionally.
