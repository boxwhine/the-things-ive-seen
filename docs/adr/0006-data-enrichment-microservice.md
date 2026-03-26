# ADR-0006: Extract Data Enrichment Service as the First Microservice

Date: 2026-03-25
Status: Accepted

## Context

Module 4 requires extracting a service from the monolith to demonstrate distributed systems patterns (async communication, independent deployment, service boundaries). Three candidates were considered:

- **Data enrichment** — async service that fetches Spotify and Setlist.fm data after an event is created
- **Search/filter** — service handling query logic, pagination, and faceted filtering
- **Stats/insights** — service computing aggregate analytics on the concert dataset

## Decision

Extract a Data Enrichment Service as the first microservice.

Responsibilities:

- Consume `event.created` messages from RabbitMQ
- Query Spotify API for artist metadata (genres, popularity, related artists)
- Query Setlist.fm for setlist data (songs played, tour name)
- Write enriched data back to PostgreSQL
- Handle retries via dead letter queue

## Consequences

- The enrichment service has a natural async use case that justifies the message broker — fire-and-forget after event creation
- Directly enables planned product features (Spotify/Setlist.fm integration) rather than being a purely architectural exercise
- Search/filter extraction would largely be moving existing resolver code with no new capability
- Stats/insights is retained as a stretch goal to tackle once core infrastructure is stable
- The service introduces a dependency on two external APIs; rate limiting and error handling must be accounted for
