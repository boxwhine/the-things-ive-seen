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

- [ ] Rewrite API Dockerfile with multi-stage build (builder + runner stages)
- [ ] Add `.dockerignore` files to both packages
- [ ] Create production UI Dockerfile (Next.js standalone output + nginx or node)
- [ ] Verify both containers build and run independently
- [ ] Test full stack via updated docker-compose

### CI Pipeline (GitHub Actions)

- [ ] Create `.github/workflows/ci.yml` for PR checks
- [ ] Add stages: install, lint, typecheck, test, build
- [ ] Configure Turborepo remote caching in CI to skip unchanged packages
- [ ] Verify pipeline runs on every PR and push to main

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
