# Module 02: Build System & CI/CD Foundation

**Status:** 🟡 In Progress

**Start Date:** 2026-04-13

**End Date:** —

## Goal

Establish a fast, reliable CI pipeline using Turborepo for monorepo-aware build caching and GitHub Actions for automated lint, test, and build checks. On merge to main, Docker images are built and published to GitHub Container Registry, ready for deployment.

## Acceptance Criteria

### Turborepo

- [x] Install Turborepo (`pnpm add -Dw turbo`)
- [x] Create `turbo.json` with task pipelines (build, lint, test, types, dev)
- [x] Verify `turbo run build` respects package dependency order
- [x] Set up remote caching (Vercel free tier or self-hosted)
- [x] Update root `package.json` scripts to use `turbo run`

### Production Dockerfiles

> [!NOTE]
> This work landed in Module 01 (commit `9582946 Split dev/prod Docker workflows with pnpm deploy`). The monorepo uses a single root `Dockerfile` with multi-stage builds and `--target api` / `--target ui` rather than per-package Dockerfiles — the `build` stage installs deps and builds both packages once, and `pnpm deploy` prunes a per-package `node_modules` for each runner stage. This section is an audit-and-verify pass on what already exists.

- [x] Audit root `Dockerfile` multi-stage structure (`base` → `build` → `api`/`ui`)
- [x] Audit root `.dockerignore` (per-package files intentionally skipped — the single root build context makes them redundant)
- [x] Verify API image builds and runs independently (`docker build --target api` + smoke test)
- [x] Verify UI image builds and runs independently (`docker build --target ui` + smoke test; uses Next.js standalone output)
- [x] Verify full stack via `compose.prod.yml` (`pnpm prod`)

### CI Pipeline (GitHub Actions)

- [x] Create `.github/workflows/ci.yml` for PR checks
- [x] Add stages: install, lint, typecheck, test, build
- [x] Configure Turborepo remote caching in CI to skip unchanged packages
- [x] Verify pipeline runs on every PR and push to main

### Container Registry

- [ ] Set up GitHub Container Registry (ghcr.io)
- [ ] Add CI step to build and push Docker images on merge to main
- [ ] Tag images with git SHA and `latest`
- [ ] Verify images are pullable from the registry

### Verification

- [ ] End-to-end: open PR → CI passes → merge → images published to ghcr.io
- [ ] Document pipeline architecture and caching strategy

## Related ADRs

_None yet. Add links here as decisions are made during this module._

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.

### 2026-04-13 — Turborepo setup

- Remote caching uses the Vercel free tier; CI will need `TURBO_TOKEN` and `TURBO_TEAM` as GitHub Actions secrets when we wire up the CI Pipeline section.
- Split `tsc --noEmit` out of the API `lint` script into a dedicated `types` task (with a matching script on `@ttis/ui`) so type checks can run independently of linting in CI.

### 2026-04-13 — Production Dockerfiles audit

- Section scope revised: the original checklist assumed per-package Dockerfiles, but the monorepo uses a single root `Dockerfile` with targeted stages (`--target api`, `--target ui`) — that work landed in Module 01 (`9582946`). Keeping this pattern because it shares the install + build steps across both targets, which is well-suited to a pnpm monorepo.
- Pinned the Docker base image and `.nvmrc` to `node:24.14.0-slim` / `24.14.0` so CI, prod containers, and local dev all resolve to the same Node version.

### 2026-04-13 — CI workflow

- Sourcing the Node version from `.nvmrc` via `actions/setup-node`'s `node-version-file` so CI, Docker, and dev all stay in lockstep from a single pin.
- `TURBO_TOKEN` lives in repo secrets; `TURBO_TEAM` lives in repo variables (the team slug isn't sensitive).
- Heads-up: GitHub Actions is deprecating Node 20 for action runtimes (June 2026). `checkout@v4`, `setup-node@v4`, and `pnpm/action-setup@v4` currently run on Node 20. Revisit before the deadline; not urgent.
