# Module 07: Observability — Logging & Tracing

**Status:** ⬜ Not Started

**Start Date:** —

**End Date:** —

## Goal

Complete the observability stack by adding centralized structured logging via Loki and distributed tracing via Grafana Tempo (OpenTelemetry). All three signals — metrics, logs, and traces — should be queryable in a single Grafana UI. Define and instrument SLOs for each service.

## Acceptance Criteria

### Logging — Setup

- [ ] Install Loki and Promtail via Helm
- [ ] Configure Promtail to collect logs from all pods
- [ ] Switch all services to structured JSON logging
- [ ] Verify logs appear in Loki

### Logging — Querying

- [ ] Set up Loki as a datasource in Grafana
- [ ] Practice LogQL queries (filter by service, severity, request ID)
- [ ] Add correlation IDs to log output across all services
- [ ] Create a log dashboard showing error rates over time

### Distributed Tracing

- [ ] Install Grafana Tempo via Helm
- [ ] Install OpenTelemetry SDK in GraphQL API and Enrichment Service
- [ ] Instrument GraphQL API with request-level tracing
- [ ] Instrument Enrichment Service with trace spans (consume → fetch → write)
- [ ] Propagate trace context across service boundaries via headers
- [ ] Verify traces appear in Grafana Tempo
- [ ] Practice using traces to debug a slow or failing request end-to-end
- [ ] Link traces to logs using correlation IDs where possible

### SLOs

- [ ] Define SLOs for each service (targets in ARCHITECTURE.md as a starting point)
- [ ] Write Prometheus recording rules to calculate SLO compliance
- [ ] Create SLO compliance dashboard in Grafana

## Related ADRs

- [ADR-0007](../adr/0007-grafana-tempo-tracing.md) — Grafana Tempo chosen over Jaeger for distributed tracing

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.
