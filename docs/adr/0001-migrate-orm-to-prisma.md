# ADR-0001: Migrate ORM from Sequelize to Prisma

Date: 2025-02

Status: Accepted

## Context

The project originally used Sequelize as its ORM. Sequelize required significant manual TypeScript configuration and lacked native integration with the GraphQL schema builder (Pothos). Type definitions were brittle and required constant maintenance alongside schema changes.

## Decision

Migrate to Prisma ORM.

## Consequences

- Prisma provides first-class TypeScript support with generated, type-safe query builders
- The native Pothos plugin eliminates manual type mapping between the database layer and GraphQL schema
- Prisma's migration toolchain (`prisma migrate`) is cleaner and more predictable than Sequelize migrations
- Migration required rewriting all model definitions and data access logic — a one-time cost absorbed during the modernization phase
