# Module 04: Service Extraction & Message Queue

**Status:** ⬜ Not Started

**Start Date:** —

**End Date:** —

## Goal

Extract the data enrichment responsibility into a standalone TypeScript service that communicates asynchronously with the GraphQL API via RabbitMQ. When a new event is created, the API publishes a message; the Enrichment Service consumes it, fetches data from Spotify and Setlist.fm, and writes the result back to PostgreSQL.

## Service Design

**Extracted service:** Data Enrichment Service (TypeScript)

**Message broker:** RabbitMQ

- Exchange: `ttis.events` (topic exchange)
- Routing key: `event.created`
- Dead letter exchange: `ttis.events.dlx`
- Retry policy: exponential backoff, max 3 attempts

**Enrichment sources:**

- Spotify API — artist metadata (genres, popularity, related artists)
- Setlist.fm — setlist data (songs played, tour name)

See [ARCHITECTURE.md — Data Flow: Event Enrichment](../ARCHITECTURE.md#data-flow-event-enrichment) for the full sequence.

## Acceptance Criteria

### Design

- [x] Identify service to extract (data enrichment — Spotify/Setlist.fm)
- [ ] Sketch architecture and API contract
- [ ] Set up new service skeleton (`packages/enrichment` or `services/enrichment`)

### Implementation — Enrichment Service

- [ ] Implement RabbitMQ consumer for `event.created`
- [ ] Implement Spotify API client (artist metadata)
- [ ] Implement Setlist.fm API client (setlist data)
- [ ] Write enriched data back to PostgreSQL via Prisma
- [ ] Add dead letter queue handling and retry logic
- [ ] Containerize the service
- [ ] Add Kubernetes manifests and deploy

### Implementation — API Changes

- [ ] Publish `event.created` message to RabbitMQ after successful `addEvent` mutation
- [ ] Add RabbitMQ connection to API service

### Implementation — RabbitMQ

- [ ] Provision RabbitMQ via Helm chart
- [ ] Configure exchange, routing key, and DLQ
- [ ] Verify message flow from API → RabbitMQ → Enrichment Service

### Verification

- [ ] Test end-to-end: create event → message published → enrichment runs → data written
- [ ] Verify DLQ catches and retries failed enrichment attempts
- [ ] Add integration tests for cross-service communication
- [ ] Update Mermaid system diagram in ARCHITECTURE.md if anything changed

## Related ADRs

- [ADR-0005](../adr/0005-rabbitmq-message-broker.md) — RabbitMQ chosen over Redis for message broker
- [ADR-0006](../adr/0006-data-enrichment-microservice.md) — Data enrichment chosen as the extracted service
- [ADR-0008](../adr/0008-typescript-for-enrichment-service.md) — TypeScript chosen over Go for this service

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.
