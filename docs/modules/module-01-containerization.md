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
- [x] Wire Prisma client to database and verify end-to-end queries
- [x] Get real initial data seeding working via Prisma
- [x] Upgrade PostgreSQL from 11.4 → 16 in docker-compose
- [x] Move Apollo Client URI to environment variable
- [x] Document all dependencies (Node version, DB version, env vars)

### Docker

- [x] Verify API container builds and runs
- [x] Verify UI container builds and runs
- [x] Verify full stack works via docker-compose
- [x] Update README with local setup instructions

### Kubernetes

- [x] Install k3s or enable Kubernetes in Docker Desktop
- [x] Learn basic kubectl commands (get, describe, logs, exec)
- [x] Understand pods, deployments, services, namespaces
- [x] Write Deployment manifest for GraphQL API
- [x] Write Deployment manifest for Next.js UI
- [x] Deploy PostgreSQL in Kubernetes (or use external connection)
- [x] Get full stack running in local Kubernetes
- [x] Verify services can communicate

### Hardening

- [ ] Add liveness and readiness probes to all Deployments
- [x] Set CPU and memory requests and limits on all Deployments
- [ ] Debug any remaining connectivity or config issues

## Related ADRs

- [ADR-0001](../adr/0001-migrate-orm-to-prisma.md) — Migrated ORM from Sequelize to Prisma
- [ADR-0002](../adr/0002-migrate-to-pothos.md) — Migrated schema builder from Type-GraphQL to Pothos
- [ADR-0003](../adr/0003-migrate-to-pnpm-workspaces.md) — Migrated package manager from npm to pnpm workspaces
- [ADR-0009](../adr/0009-postgresql-version-upgrade.md) — Upgrading PostgreSQL from 11.4 to 16

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.

- **2026-03-04** — Deleted unused files, migrated UI from DaisyUI to shadcn/ui + Tailwind, bumped packages to latest, migrated from Lerna to pnpm, bumped Dockerfiles to recent Node version. (4 hrs)

- **2026-03-10** — Migrated old deps up to latest, got linting/formatting/pre-commit hooks running, got UI app up again, and migrated API from Sequelize to Prisma for ORM and auto-generated schemas and types. Used git worktrees with Claude Code for the first time to concurrently execute sizable refactoring across packages. (10 hrs)

- **2026-03-10** — Key learnings: Prisma's autogen workflow is slick — define the DB schema and it generates DB code, GraphQL schema, and types. Working heavily with Claude Code is proving beneficial, but much of the value comes from learning how to ask for what you want and knowing what you can just do with a command/script (lesson carried over from Apex).

- **2026-03-10** — Technical decisions: Chose pnpm as monorepo manager since it was already familiar from Apex. Worth looking into TurboRepo or Nx as possible embellishments or replacements. Migrated to Prisma per Claude's recommendation — want to move away from decorators but unclear if type-graphql can be fully dropped yet. (Resolved: type-graphql was replaced by Pothos per ADR-0002.)

- **2026-03-10** — Blockers: When you don't touch an app for a while, it always takes longer than expected to shake off the cobwebs and get everything running again. Even with only a few pages and a couple read-only GraphQL fetches, getting to a workable, compilable, lintable state took several long sessions.

- **2026-03-25** — Modernizing the app (ORM migration, framework upgrades, package manager migration) concurrently with production planning created significant churn not accounted for in the original module timeline. The prerequisite checklist above is a direct result. This is expected and documented intentionally.

- **2026-04-03** — Chose k3d over Docker Desktop Kubernetes and minikube for local K8s. k3d runs k3s in Docker containers, supports multi-node clusters with minimal overhead, and includes a built-in load balancer and Traefik ingress. Created a 3-node cluster (`k3d cluster create ttis --agents 2 -p "80:80@loadbalancer" -p "443:443@loadbalancer"`).
