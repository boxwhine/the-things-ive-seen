# ADR-0005: Use RabbitMQ as Message Broker

Date: 2026-03-25

Status: Accepted

## Context

Module 4 introduces async communication between the GraphQL API and the Enrichment Service. A message broker is needed to decouple the services and handle retry logic for failed enrichment attempts. The two candidates considered were Redis (Streams or pub/sub) and RabbitMQ.

Redis was already a potential dependency for caching, which made it attractive from a "fewer moving parts" perspective. RabbitMQ is a dedicated message broker with richer routing semantics.

## Decision

Use RabbitMQ with a topic exchange.

- Exchange: `ttis.events`
- Routing key: `event.created`
- Dead letter exchange: `ttis.events.dlx`
- Retry policy: exponential backoff, max 3 attempts

## Consequences

- RabbitMQ provides proper broker semantics: exchanges, routing keys, acknowledgments, and dead letter queues — patterns representative of real distributed systems work
- Failed enrichment attempts are handled via DLQ rather than requiring custom retry logic in the application
- RabbitMQ is one additional service to operate; Redis pub/sub would have reduced infrastructure count
- A future migration to Kafka is possible if event volume or consumer complexity grows significantly — see Stretch Goals in `docs/ARCHITECTURE.md`
