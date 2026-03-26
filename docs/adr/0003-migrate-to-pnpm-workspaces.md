# ADR-0003: Migrate Package Manager from npm to pnpm Workspaces

Date: 2025-03
Status: Accepted

## Context

The project originally used npm with a flat monorepo structure managed by Lerna. This caused dependency resolution issues, produced large and slow installs, and lacked clean workspace-level script orchestration. Managing two packages (api, ui) with shared tooling was unnecessarily cumbersome.

## Decision

Migrate to pnpm with native workspaces (`packages/api`, `packages/ui`). Enable `shamefullyHoist` for compatibility with Next.js and ts-node-dev.

## Consequences

- A single lockfile (`pnpm-lock.yaml`) governs all dependencies across the monorepo
- Package isolation is stricter by default — packages can only access what they declare
- Install times are significantly faster due to pnpm's content-addressable store
- Workspace-level scripts (`pnpm dev`, `pnpm build`, `pnpm lint`) work cleanly across packages
- `shamefullyHoist` is a known workaround for Next.js and ts-node-dev compatibility; revisit if issues arise
