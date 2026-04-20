# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for The Things I've Seen.

ADRs document significant decisions made during the design and evolution of the system. Each record captures the context at the time of the decision, the decision itself, and its consequences. Records are append-only — past decisions are not edited, but may be superseded by new ones.

To add a new ADR, create a file named `NNNN-short-title.md` using the next available number and follow the existing template.

## Index

| ADR                                                  | Title                                                      | Date       | Status   |
| ---------------------------------------------------- | ---------------------------------------------------------- | ---------- | -------- |
| [0001](./0001-migrate-orm-to-prisma.md)              | Migrate ORM from Sequelize to Prisma                       | 2025-02    | Accepted |
| [0002](./0002-migrate-to-pothos.md)                  | Migrate GraphQL Schema Builder from Type-GraphQL to Pothos | 2025-02    | Accepted |
| [0003](./0003-migrate-to-pnpm-workspaces.md)         | Migrate Package Manager from npm to pnpm Workspaces        | 2025-03    | Accepted |
| [0004](./0004-full-target-state-architecture-doc.md) | Document Full Target Architecture Upfront                  | 2026-03-25 | Accepted |
| [0005](./0005-rabbitmq-message-broker.md)            | Use RabbitMQ as Message Broker                             | 2026-03-25 | Accepted |
| [0006](./0006-data-enrichment-microservice.md)       | Extract Data Enrichment Service as the First Microservice  | 2026-03-25 | Accepted |
| [0007](./0007-grafana-tempo-tracing.md)              | Use Grafana Tempo for Distributed Tracing                  | 2026-03-25 | Accepted |
| [0008](./0008-typescript-for-enrichment-service.md)  | Use TypeScript for the Enrichment Service (Go Deferred)    | 2026-03-25 | Accepted |
| [0009](./0009-postgresql-version-upgrade.md)         | Upgrade PostgreSQL from 11.4 to 16                         | 2026-03-25 | Accepted |
| [0010](./0010-k3d-local-kubernetes.md)               | Use k3d for Local Kubernetes Development                   | 2026-04-03 | Accepted |
| [0011](./0011-ecr-over-ghcr.md)                      | Use AWS ECR as the Single Container Registry               | 2026-04-20 | Accepted |
