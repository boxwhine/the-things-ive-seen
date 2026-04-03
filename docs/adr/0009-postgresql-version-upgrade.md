# ADR-0009: Upgrade PostgreSQL from 11.4 to 16

Date: 2026-03-25

Status: Accepted

## Context

The Docker Compose configuration was targeting PostgreSQL 11.4, which reached end-of-life in November 2023 and no longer receives security patches. The cloud deployment (AWS RDS, Module 3) will use a modern PostgreSQL version regardless, creating a divergence between local and production environments.

## Decision

Upgrade the Docker Compose configuration to PostgreSQL 16. All cloud deployments will use PostgreSQL 16 from the outset.

## Consequences

- Local and cloud environments run the same major version, reducing environment-specific bugs
- PostgreSQL 16 is a drop-in compatible upgrade for the current schema — no migration changes required
- The project no longer runs EOL database software, which is consistent with the production-hardening goals documented in `docs/ARCHITECTURE.md`
- PostgreSQL 16 brings query performance improvements, logical replication enhancements, and expanded developer features, none of which are immediately required but are available if needed
