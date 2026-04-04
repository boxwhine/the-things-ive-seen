# ADR-0002: Migrate GraphQL Schema Builder from Type-GraphQL to Pothos

Date: 2025-02

Status: Accepted

## Context

The project originally used Type-GraphQL for building the GraphQL schema. Type-GraphQL relies heavily on decorators, which added boilerplate and had friction integrating with Prisma. The decorator-based approach also made the schema harder to compose and extend.

## Decision

Migrate to Pothos with the Prisma plugin.

## Consequences

- Pothos generates the GraphQL schema directly from TypeScript types without decorator boilerplate
- The native Prisma plugin means database models and GraphQL types stay in sync automatically
- Schema composition is more flexible — builders can be mixed and extended cleanly
- Migration required rewriting all resolver and type definitions — absorbed alongside the Prisma migration in the same modernization phase
