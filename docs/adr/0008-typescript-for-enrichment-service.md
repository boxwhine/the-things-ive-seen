# ADR-0008: Use TypeScript for the Enrichment Service (Go Deferred)

Date: 2026-03-25

Status: Accepted

## Context

When extracting the Enrichment Service (see ADR-0006), a language choice was required. Go is commonly used in SRE tooling and would signal polyglot capability to employers. TypeScript is consistent with the existing codebase and requires no new language onboarding.

The primary learning goals of Module 4 are async messaging patterns, service boundaries, and distributed system design — not language acquisition.

## Decision

Implement the Enrichment Service in TypeScript. Document a Go rewrite as an explicit future stretch goal.

## Consequences

- No context-switching overhead — existing TypeScript patterns, tooling, ESLint config, and Dockerfiles apply directly
- Module 4 progress is gated by architecture and infrastructure work, not language learning
- A Go rewrite is retained as a stretch goal and documented in `docs/ARCHITECTURE.md`; the service boundary and message contract will be fully defined by that point, making it a clean language-swap exercise with minimal architectural risk
- The absence of Go is mitigated by the fact that it is explicitly documented as a future step, demonstrating awareness of the trade-off
