# Module 02: Build System & CI/CD Foundation

**Status:** 🟡 In Progress

**Start Date:** 2026-04-13

**End Date:** —

## Goal

Establish a fast, reliable CI pipeline using Turborepo for monorepo-aware build caching and GitHub Actions for automated lint, test, and build checks. On merge to main, Docker images are built and published to AWS ECR, ready for deployment to EKS.

## Acceptance Criteria

### Turborepo

- [x] Install Turborepo (`pnpm add -Dw turbo`)
- [x] Create `turbo.json` with task pipelines (build, lint, test, types, dev)
- [x] Verify `turbo run build` respects package dependency order
- [x] Set up remote caching (Vercel free tier or self-hosted)
- [x] Update root `package.json` scripts to use `turbo run`

### Production Dockerfiles

- [x] Split production Dockerfiles per package (`packages/api/Dockerfile`, `packages/ui/Dockerfile`)
- [x] Each Dockerfile installs only its own workspace-filtered deps (`pnpm install --filter <pkg>...`)
- [x] Verify API image builds and runs independently (`docker build -f packages/api/Dockerfile .` + smoke test)
- [x] Verify UI image builds and runs independently (`docker build -f packages/ui/Dockerfile .` + smoke test; uses Next.js standalone output)
- [x] Verify full stack via `compose.prod.yml` (`pnpm prod`)
- [x] Verify `pnpm dev` is unaffected (native processes + DB-only compose)

### CI Pipeline (GitHub Actions)

- [x] Create `.github/workflows/ci.yml` for PR checks
- [x] Add stages: install, lint, typecheck, test, build
- [x] Configure Turborepo remote caching in CI to skip unchanged packages
- [x] Verify pipeline runs on every PR and push to main

### Container Registry

- [ ] Set up AWS ECR repositories (ttis-api, ttis-ui) with lifecycle policies
- [ ] Configure GitHub OIDC for AWS IAM role assumption
- [ ] Add CI step to build and push Docker images to ECR on merge to main
- [ ] Tag images with git SHA and `latest`
- [ ] Verify images are pullable from ECR

### Verification

- [ ] End-to-end: open PR → CI passes → merge → images published to ECR
- [ ] Document pipeline architecture and caching strategy

## Related ADRs

- [ADR-0011](../adr/0011-ecr-over-ghcr.md) — Use AWS ECR as the single container registry

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.

### 2026-04-13 — Turborepo setup

- Remote caching uses the Vercel free tier; CI will need `TURBO_TOKEN` and `TURBO_TEAM` as GitHub Actions secrets when we wire up the CI Pipeline section.
- Split `tsc --noEmit` out of the API `lint` script into a dedicated `types` task (with a matching script on `@ttis/ui`) so type checks can run independently of linting in CI.

### 2026-04-13 — Production Dockerfiles audit

- Section scope revised: the original checklist assumed per-package Dockerfiles, but the monorepo uses a single root `Dockerfile` with targeted stages (`--target api`, `--target ui`) — that work landed in Module 01 (`9582946`). Keeping this pattern because it shares the install + build steps across both targets, which is well-suited to a pnpm monorepo.
- Pinned the Docker base image and `.nvmrc` to `node:24.14.0-slim` / `24.14.0` so CI, prod containers, and local dev all resolve to the same Node version.

### 2026-04-20 — Split Dockerfiles per package (revisiting the 04-13 decision)

- Reversed the earlier decision to keep a single root `Dockerfile`. The shared `build` stage looked like reuse, but `@ttis/api` and `@ttis/ui` share only `graphql` at runtime and no workspace-internal deps. Every `docker build` was installing both packages' deps, running `prisma generate` + `tsc` + `next build`, then pruning 80% of the work away via `pnpm deploy`. That's false coupling disguised as sharing.
- New layout: `packages/api/Dockerfile` and `packages/ui/Dockerfile`. Each uses `pnpm install --filter <pkg>...` so only that package's deps (and its workspace transitives) land in `node_modules`. Each CI matrix job now builds only its own image.
- The UI Dockerfile is notably simpler: no `pnpm deploy` step, because `next build` with `output: 'standalone'` produces a self-contained runtime tree. Added `outputFileTracingRoot: path.join(__dirname, '../../')` to `next.config.mjs` so the Next.js tracer resolves symlinked pnpm deps correctly when the build context is the repo root.
- `compose.prod.yml` now references each package's Dockerfile directly (no `target:` field needed). `pnpm dev` is unchanged — it uses `compose.dev.yml` (DB only) plus native hot-reload processes.

### 2026-04-13 — CI workflow

- Sourcing the Node version from `.nvmrc` via `actions/setup-node`'s `node-version-file` so CI, Docker, and dev all stay in lockstep from a single pin.
- `TURBO_TOKEN` lives in repo secrets; `TURBO_TEAM` lives in repo variables (the team slug isn't sensitive).
- Pinned `actions/checkout`, `actions/setup-node`, and `pnpm/action-setup` to `@v5` so the action runtimes sit on Node 24 ahead of the June 2026 Node 20 deprecation. Held off on `setup-node@v6` because it drops automatic pnpm caching, which would force a manual `actions/cache` step.

### 2026-04-20 — Container registry: ECR over ghcr.io

- Switched target container registry from ghcr.io to AWS ECR (see [ADR-0011](../adr/0011-ecr-over-ghcr.md)). Rationale: production targets EKS, and ECR integrates natively with EKS node IAM roles for image pulls — no `imagePullSecret` wiring. Using ECR from the start avoids a mid-project registry migration.
- GitHub Actions authenticates to AWS via OIDC (no long-lived credentials). The `publish` job requests an `id-token` from GitHub's OIDC provider and exchanges it with AWS STS for temporary credentials scoped to ECR push only.
- Lifecycle policies keep only the last 5 tagged images per repo (plus 1-day expiry for untagged) to stay within the Free Tier 500MB storage limit.
- Docker layer caching uses the GitHub Actions cache backend (`type=gha`) rather than ECR inline cache — simpler, free, and avoids consuming ECR storage for cache layers.
- One-time AWS setup is scripted: run `./scripts/setup-ecr-repos.sh` then `./scripts/setup-github-oidc.sh` (requires AWS CLI configured with admin access). After running, add the outputted secrets/variables to the GitHub repo settings.
