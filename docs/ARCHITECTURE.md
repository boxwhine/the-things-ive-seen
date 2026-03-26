# Architecture Design Document

## The Things I've Seen

**Status:** 🟡 In Progress — Module 1 (Containerization & Local Kubernetes)
**Last Updated:** 2026-03-25
**Author:** Jesse Rinehart

---

## Table of Contents

1. [Overview](#1-overview)
2. [Current State](#2-current-state)
3. [Target Architecture](#3-target-architecture)
4. [Module Roadmap](#4-module-roadmap)
5. [Technology Decisions](#5-technology-decisions)
6. [ADR Log](#6-adr-log)
7. [Stretch Goals](#7-stretch-goals)

---

## 1. Overview

### What Is This Project?

**The Things I've Seen** is a personal concert tracking and visualization app built around a dataset of ~500 real concert attendance records spanning 1995–2024. It started as a simple CRUD app and is being evolved into a fully production-hardened, cloud-deployed platform.

### Why Does It Exist?

This project serves two concurrent purposes:

1. **Personal tool** — A meaningful dataset to query, visualize, and enrich with external data (Spotify artist info, Setlist.fm setlists, mapping).
2. **SRE/DevOps learning vehicle** — A real application used as the test case for systematically learning and implementing production engineering practices: containerization, CI/CD, cloud infrastructure, observability, alerting, chaos engineering, and GitOps.

The project is public and intended to demonstrate end-to-end ownership of a product — from initial architecture through production deployment — as a portfolio artifact for SRE and platform engineering roles.

### Interview Narrative

> "I built a distributed events platform called _The Things I've Seen_ to learn SRE practices hands-on. It started as a monorepo Node/GraphQL and Next.js app. I migrated the ORM to Prisma, containerized it with Docker, and deployed it to Kubernetes — locally on k3s and in the cloud on AWS EKS via Terraform. I extracted an async data enrichment service that communicates over RabbitMQ and pulls from external APIs. The system is fully instrumented with OpenTelemetry, surfaced via Prometheus metrics, Grafana dashboards, centralized logging with Loki, and distributed tracing with Grafana Tempo. I defined SLOs and built SLO-based alerting via Alertmanager. To validate the monitoring, I ran chaos experiments — killing pods, introducing latency, simulating DB failures — and wrote postmortems for each incident. Everything is deployed via GitHub Actions CI/CD and ArgoCD GitOps, with Terraform managing all cloud infrastructure."

---

## 2. Current State

### Stack (as of 2026-03-25)

| Layer            | Technology                                                                             |
| ---------------- | -------------------------------------------------------------------------------------- |
| Frontend         | Next.js 16, React 19, Apollo Client, Tailwind CSS v4, shadcn/ui                        |
| API              | GraphQL Yoga v5, Pothos v4, TypeScript                                                 |
| ORM              | Prisma v7 (recently migrated from Sequelize)                                           |
| Database         | PostgreSQL 11.4 (upgrading to 16 — see [ADR-009](#adr-009-postgresql-version-upgrade)) |
| Package Manager  | pnpm v10 (workspaces)                                                                  |
| Containerization | Docker + Docker Compose                                                                |
| Local Dev        | docker-compose with hot reload                                                         |

### What Is Working

- Monorepo structure with pnpm workspaces (`packages/api`, `packages/ui`)
- GraphQL Yoga server with Pothos schema builder and auto-generated schema
- Next.js frontend with Apollo Client, Radix UI primitives, and shadcn/ui components
- Docker Compose dev environment (API, UI, PostgreSQL, Adminer)
- Husky + lint-staged pre-commit hooks (ESLint + Prettier)
- Production Dockerfiles (multi-stage builds) for API and UI
- Seed data pipeline: CSV → JSON → Prisma seed script (~500 concert records)

### Known Gaps and Active Blockers

These items must be resolved before Module 2 work begins. They are the result of modernizing the application (ORM migration, framework upgrades, package manager migration) concurrently with production planning — a known trade-off documented here intentionally.

| Blocker                 | Description                                                                          | Module |
| ----------------------- | ------------------------------------------------------------------------------------ | ------ |
| Prisma client not wired | Schema defined but client not fully connected to DB; queries not verified end-to-end | 1      |
| Seeding not working     | Prisma-based seed script exists but not verified against live DB                     | 1      |
| Hardcoded Apollo URI    | UI points to `http://localhost:4000` — no environment-based config                   | 1      |
| PostgreSQL 11.4 EOL     | Running an end-of-life database version; upgrading to 16                             | 1      |

---

## 3. Target Architecture

### System Overview

The target system consists of three application services, a message broker, a primary database, and a full observability stack — deployed locally on Kubernetes (k3s) and in the cloud on AWS EKS.

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                    Next.js UI (:3000)                        │
│              React 19 · Apollo Client · shadcn/ui           │
└────────────────────────┬────────────────────────────────────┘
                         │ GraphQL
┌────────────────────────▼────────────────────────────────────┐
│                  GraphQL API (:4000)                         │
│           GraphQL Yoga · Pothos · Prisma · TypeScript        │
└──────────┬─────────────────────────────┬────────────────────┘
           │ Prisma                      │ Publish event
┌──────────▼──────────┐      ┌──────────▼──────────────────┐
│   PostgreSQL (RDS)  │      │        RabbitMQ              │
│   Primary Database  │      │     Message Broker           │
└─────────────────────┘      └──────────┬──────────────────┘
                                        │ Consume
                             ┌──────────▼──────────────────┐
                             │   Enrichment Service         │
                             │   TypeScript · async         │
                             └──────┬──────────┬───────────┘
                                    │          │
                         ┌──────────▼──┐  ┌───▼──────────┐
                         │ Spotify API │  │ Setlist.fm   │
                         └─────────────┘  └──────────────┘
```

### Observability Stack

All services emit telemetry via OpenTelemetry. The Grafana stack provides unified visibility across metrics, logs, and traces.

```
┌─────────────────────────────────────────────────────────────┐
│                   All Application Services                  │
│              (API · UI · Enrichment Service)                │
└──────────────────────┬──────────────────────────────────────┘
                       │ OpenTelemetry SDK
              ┌────────▼─────────┐
              │  OTel Collector  │
              └──┬──────┬───┬───┘
                 │      │   │
        ┌────────▼─┐ ┌──▼──┐ ┌▼──────┐
        │Prometheus│ │Loki │ │Tempo  │
        │ Metrics  │ │Logs │ │Traces │
        └────────┬─┘ └──┬──┘ └┬──────┘
                 └──────┼──────┘
                ┌───────▼───────┐
                │    Grafana    │
                │  Dashboards   │
                └───────┬───────┘
                        │ Alerts
               ┌────────▼────────┐
               │  Alertmanager   │
               └────────┬────────┘
                        │
               ┌────────▼────────┐
               │   PagerDuty     │
               └─────────────────┘
```

### Infrastructure Architecture

#### Local Development (Module 1)

- Docker Compose for initial dev workflow
- k3s or Docker Desktop Kubernetes for local Kubernetes practice
- All services running as Kubernetes pods with liveness/readiness probes

#### Cloud Production (Module 3+)

- **Compute:** AWS EKS (Elastic Kubernetes Service)
- **Database:** AWS RDS (PostgreSQL 16)
- **Container Registry:** GitHub Container Registry (ghcr.io) for dev; AWS ECR for production
- **DNS:** AWS Route53
- **Ingress:** nginx-ingress controller via Helm
- **Secrets:** Kubernetes Secrets or AWS Secrets Manager
- **IaC:** Terraform (VPC, subnets, security groups, EKS cluster, RDS)

#### CI/CD Pipeline (Module 2–3)

```
PR opened
    └─> GitHub Actions: install · lint · typecheck · test · build (Turborepo cache)
           └─> Merge to main
                  └─> Build & push Docker images → ghcr.io / ECR (tagged: git SHA + latest)
                         └─> ArgoCD detects manifest change
                                └─> Deploy to EKS (canary → full rollout)
                                       └─> Smoke tests → auto-rollback on failure
```

### Kubernetes Deployment Model

Each service runs as a Kubernetes `Deployment` with:

- Liveness and readiness probes
- CPU and memory requests/limits
- Horizontal pod autoscaling (future)
- ConfigMaps for non-secret configuration
- Secrets for credentials and API keys

| Service            | Replicas (target)          | Notes                              |
| ------------------ | -------------------------- | ---------------------------------- |
| UI (Next.js)       | 2                          | Stateless                          |
| API (GraphQL)      | 2                          | Stateless                          |
| Enrichment Service | 2                          | Stateless, scales with queue depth |
| RabbitMQ           | 1 (dev) / clustered (prod) | Via Helm chart                     |
| PostgreSQL         | Managed (RDS)              | Not in-cluster in production       |

### Data Flow: Event Enrichment

When a new concert event is created:

1. User submits form in the UI
2. Apollo Client sends `addEvent` GraphQL mutation to API
3. API persists the event to PostgreSQL via Prisma
4. API publishes an `event.created` message to RabbitMQ
5. Enrichment Service consumes the message from the queue
6. Enrichment Service queries Spotify API for artist/track data
7. Enrichment Service queries Setlist.fm for setlist data
8. Enrichment Service writes enriched data back to PostgreSQL
9. UI can query enriched event data on next fetch

Failed enrichment attempts are retried via RabbitMQ dead letter queue with exponential backoff.

### SLO Definitions (Module 6 target)

| Service            | SLO                               | Metric                   |
| ------------------ | --------------------------------- | ------------------------ |
| GraphQL API        | 99% of requests < 500ms           | p99 latency              |
| GraphQL API        | Error rate < 1%                   | 5xx responses / total    |
| Enrichment Service | 95% of events enriched within 30s | Queue processing latency |
| Enrichment Service | Dead letter queue depth < 10      | DLQ message count        |

---

## 4. Module Roadmap

| Module | Focus                                | Status         | Target Outcome                                                          |
| ------ | ------------------------------------ | -------------- | ----------------------------------------------------------------------- |
| 1      | Containerization & Local Kubernetes  | 🟡 In Progress | Full stack running in local k8s with probes and resource limits         |
| 2      | Build System & CI/CD Foundation      | ⬜ Not Started | Turborepo build cache, GitHub Actions CI, images published to ghcr.io   |
| 3      | Cloud Infrastructure & Terraform     | ⬜ Not Started | EKS cluster + RDS provisioned via Terraform, app accessible at real URL |
| 4      | Service Extraction & Message Queue   | ⬜ Not Started | Enrichment service deployed, RabbitMQ running, async flow end-to-end    |
| 5      | Observability — Metrics & Dashboards | ⬜ Not Started | Prometheus + Grafana, RED method dashboards per service                 |
| 6      | Observability — Logging & Tracing    | ⬜ Not Started | Loki + Tempo via OTel, SLO compliance dashboards                        |
| 7      | Alerting & Incident Response         | ⬜ Not Started | SLO-based alerts, runbooks, chaos day postmortem                        |
| 8      | GitOps & Advanced Deployment         | ⬜ Not Started | ArgoCD, canary deployments, Terraform in CI, image scanning             |
| 9      | Chaos Engineering & Polish           | ⬜ Not Started | Automated chaos experiments, architecture diagram, portfolio polish     |

### Module 1 Detail — Containerization & Local Kubernetes

**Prerequisite blockers to resolve first:**

- [ ] Wire Prisma client to database and verify end-to-end queries
- [ ] Get seed data working via Prisma against live DB
- [ ] Upgrade PostgreSQL from 11.4 → 16 in docker-compose
- [ ] Move Apollo Client URI to environment variable

**Kubernetes targets:**

- [ ] Install k3s or enable Kubernetes in Docker Desktop
- [ ] Write Deployment manifests for API, UI, PostgreSQL
- [ ] Add liveness and readiness probes to all Deployments
- [ ] Set resource requests and limits
- [ ] Verify full stack running in local cluster

### Module 4 Detail — Service Extraction & Message Queue

**Extracted service:** Data Enrichment Service (TypeScript)

Responsibilities:

- Consume `event.created` messages from RabbitMQ
- Query Spotify API for artist metadata (genres, popularity, related artists)
- Query Setlist.fm API for setlist data (songs played, tour name)
- Write enriched data back to PostgreSQL
- Handle retries via dead letter queue

**Message broker:** RabbitMQ

- Exchange: `ttis.events` (topic exchange)
- Routing key: `event.created`
- Dead letter exchange: `ttis.events.dlx`
- Retry policy: exponential backoff, max 3 attempts

---

## 5. Technology Decisions

### Application Stack

| Decision                   | Choice                  | Rationale                                                                                                                                                                        |
| -------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GraphQL schema builder     | Pothos                  | Native Prisma plugin; more composable than Type-GraphQL; better TypeScript integration                                                                                           |
| GraphQL server             | GraphQL Yoga            | Lighter than Apollo Server; standards-compliant; better performance                                                                                                              |
| ORM                        | Prisma                  | Type-safe queries, better DX than Sequelize, native Pothos plugin, migration tooling                                                                                             |
| Frontend framework         | Next.js 16 (App Router) | Industry standard; SSR/SSG flexibility; strong ecosystem                                                                                                                         |
| Component library          | shadcn/ui + Radix UI    | Accessible primitives; copy-into-repo model avoids dependency lock-in                                                                                                            |
| Extracted service language | TypeScript              | Consistent with existing codebase; avoids context-switching overhead. Go is documented as a future rewrite candidate — see [ADR-008](#adr-008-typescript-for-enrichment-service) |

### Infrastructure & Operations

| Decision            | Choice                        | Rationale                                                                                                                            |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Message broker      | RabbitMQ                      | Proper message broker semantics (exchanges, routing, DLQ, acks); better learning target than Redis pub/sub for async patterns        |
| Tracing backend     | Grafana Tempo + OpenTelemetry | Native Grafana integration enables metric/log/trace correlation in one UI; OTel instrumentation is backend-agnostic and transferable |
| Metrics             | Prometheus + Grafana          | Industry standard; kube-prometheus-stack simplifies Kubernetes deployment                                                            |
| Logging             | Loki + Promtail               | Grafana-native; LogQL is familiar if you know PromQL; lightweight vs. ELK                                                            |
| Cloud platform      | AWS                           | Broadest SRE job market relevance; EKS for managed Kubernetes                                                                        |
| IaC                 | Terraform                     | Industry standard for cloud provisioning; provider-agnostic; aligns with AWS Solutions Architect cert study                          |
| CI/CD               | GitHub Actions                | Native to existing GitHub repo; no additional tooling required                                                                       |
| GitOps              | ArgoCD                        | CNCF graduated; declarative; pairs cleanly with Kubernetes manifests                                                                 |
| Build orchestration | Turborepo                     | Monorepo-aware build caching; reduces CI time as package count grows                                                                 |
| Container registry  | ghcr.io (dev) → ECR (prod)    | GitHub-native for development; ECR integrates with EKS IAM for production                                                            |

---

## 6. ADR Log

Architecture Decision Records document significant decisions and any deviations from the original plan. Each ADR records the context, the decision, and the rationale. Append new ADRs as the project evolves.

---

### ADR-001: Migrate ORM from Sequelize to Prisma

**Date:** 2025-02
**Status:** Accepted

**Context:** Sequelize required significant manual TypeScript configuration and lacked native integration with the GraphQL schema builder.

**Decision:** Migrate to Prisma ORM.

**Rationale:** Prisma offers first-class TypeScript support, a native Pothos plugin that eliminates manual type mapping, and a cleaner migration toolchain. The DX improvement justifies the migration cost.

---

### ADR-002: Migrate GraphQL schema builder from Type-GraphQL to Pothos

**Date:** 2025-02
**Status:** Accepted

**Context:** Type-GraphQL required decorator-heavy configuration and had friction integrating with Prisma.

**Decision:** Migrate to Pothos with the Prisma plugin.

**Rationale:** Pothos is more composable, has a native Prisma plugin, and generates the GraphQL schema cleanly from TypeScript types without decorator boilerplate.

---

### ADR-003: Migrate package manager from npm to pnpm workspaces

**Date:** 2025-03
**Status:** Accepted

**Context:** npm with a flat monorepo structure caused dependency resolution issues and lacked workspace-level script orchestration.

**Decision:** Migrate to pnpm with workspaces (`packages/api`, `packages/ui`).

**Rationale:** pnpm workspaces provide clean package isolation, a single lockfile, and better monorepo tooling support. `shamefullyHoist` enabled for Next.js and ts-node-dev compatibility.

---

### ADR-004: Full target-state architecture document

**Date:** 2026-03-25
**Status:** Accepted

**Context:** Needed to decide whether the architecture doc should cover only current state or the full intended end state.

**Decision:** Document the full target architecture upfront with a clear current-state vs. target-state distinction.

**Rationale:** A target-state doc serves as a north star that keeps implementation focused and communicates full architectural intent to readers (including potential employers). Real-world deviations are documented as new ADRs rather than treated as failures.

---

### ADR-005: RabbitMQ as message broker

**Date:** 2026-03-25
**Status:** Accepted

**Context:** Module 4 requires async communication between the API and the Enrichment Service. Candidates were Redis Streams/pub-sub and RabbitMQ.

**Decision:** Use RabbitMQ.

**Rationale:** RabbitMQ provides proper message broker semantics — topic exchanges, routing keys, dead letter queues, and acknowledgment-based delivery — that are representative of real distributed systems patterns. Redis pub/sub is simpler but less instructive for learning async messaging. RabbitMQ is the stronger portfolio and interview talking point.

---

### ADR-006: Data enrichment as the extracted microservice

**Date:** 2026-03-25
**Status:** Accepted

**Context:** Module 4 requires extracting a service to demonstrate distributed systems patterns. Candidates were: data enrichment (Spotify/Setlist.fm), search/filter, and stats/insights.

**Decision:** Extract a Data Enrichment Service.

**Rationale:** The enrichment service has a natural async use case (fire-and-forget after event creation), directly enables planned product features (Spotify/Setlist.fm integration), and provides a concrete justification for the message queue. Search/filter would be largely moving existing resolver code. Stats/insights is retained as a stretch goal.

---

### ADR-007: Grafana Tempo for distributed tracing

**Date:** 2026-03-25
**Status:** Accepted

**Context:** Needed a distributed tracing backend. Candidates were Jaeger and Grafana Tempo.

**Decision:** Use Grafana Tempo with OpenTelemetry instrumentation.

**Rationale:** Tempo integrates natively with the existing Grafana + Loki + Prometheus stack, enabling metric/log/trace correlation in a single UI — the modern observability standard. OpenTelemetry instrumentation is backend-agnostic; the transferable skill on the resume is OpenTelemetry, not the backend. Note: Jaeger appears more frequently in older job descriptions; this is offset by the stronger architectural coherence of the unified Grafana stack.

---

### ADR-008: TypeScript for Enrichment Service (Go deferred)

**Date:** 2026-03-25
**Status:** Accepted

**Context:** The Enrichment Service could be written in Go (common in SRE tooling) or TypeScript (consistent with existing codebase).

**Decision:** Implement in TypeScript. Document Go as a future rewrite candidate.

**Rationale:** The learning goals of Module 4 are async messaging patterns and distributed service architecture — not language acquisition. Introducing Go adds context-switching overhead that would slow progress without proportional return. A Go rewrite is retained as a stretch goal and explicitly documented as a future architectural evolution, demonstrating the decision-making process rather than hiding the trade-off.

---

### ADR-009: PostgreSQL version upgrade (11.4 → 16)

**Date:** 2026-03-25
**Status:** Accepted

**Context:** Docker Compose was configured with PostgreSQL 11.4, which reached end-of-life in November 2023.

**Decision:** Upgrade to PostgreSQL 16 in docker-compose. Cloud deployment (RDS) will use PostgreSQL 16 from the outset.

**Rationale:** Running EOL software on a portfolio project intended to demonstrate production-hardening practices is inconsistent with the project's goals. PostgreSQL 16 is a drop-in compatible upgrade for this schema.

---

## 7. Stretch Goals

The following are explicitly out of scope for the current 9-module roadmap but are documented here as intended future work.

### Stats & Insights Service

A service that computes aggregate analytics on the concert dataset on demand or on a schedule:

- Shows per year, per venue, per genre
- Artist frequency, geographic distribution
- Decade-over-decade listening trends

This would be implemented as a TypeScript service, potentially exposed as a dedicated GraphQL endpoint or REST API, and would be a natural candidate for data visualization on the UI.

### Enrichment Service Rewrite in Go

Once the Enrichment Service is stable and well-understood, rewriting it in Go is a natural next step for learning SRE tooling practices. The service boundary and message contract will be fully defined by that point, making it a clean language-swap exercise without architectural risk.

### Performer / Artist Model

The data model has a placeholder for performer/artist tracking that has not yet been implemented. Once enrichment data from Spotify is flowing, a `Performer` model with a many-to-many relationship to `Event` would enable artist-centric queries and visualizations.

### Google Maps Integration

Venue records include `lat`, `lng`, and `placeId` fields already in the schema. A map view showing concert locations over time is a natural UI feature once the geolocation data is populated.

### Kafka Migration (at scale)

RabbitMQ is the right choice for the current scale. If the event volume or consumer complexity ever grows to warrant it, migrating to Kafka would be the appropriate evolution. This is not anticipated for this project but is documented for completeness.

---

_This document is maintained alongside the codebase. For questions or deviations from this plan, open a GitHub issue or append an ADR to Section 6._
