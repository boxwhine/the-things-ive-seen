# ADR-0004: Document Full Target Architecture Upfront

Date: 2026-03-25
Status: Accepted

## Context

When starting the production-hardening roadmap, a decision was needed on how to approach the architecture document: document only the current state and update incrementally, or write the full intended end state upfront and track progress against it.

The project is also a public portfolio artifact, so the document serves both as a personal north star and as a signal of architectural thinking to potential employers.

## Decision

Document the full target architecture upfront with a clear distinction between current state and target state. Current implementation status is tracked separately in `docs/STATUS.md`. Deviations from the plan are recorded as new ADRs rather than silently updated.

## Consequences

- The architecture document remains stable and forward-looking; it does not need to be rewritten as the project progresses
- Readers can see the full intended system at any stage of implementation
- Real-world deviations become part of the documented record (via ADRs), demonstrating engineering judgment rather than hiding complexity
- The current-state/target-state split means two documents must be kept in sync at a high level — acceptable given their different update cadences
