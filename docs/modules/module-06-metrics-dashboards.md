# Module 06: Observability — Metrics & Dashboards

**Status:** ⬜ Not Started

**Start Date:** —

**End Date:** —

## Goal

Instrument all services with Prometheus metrics and build Grafana dashboards that provide meaningful visibility into system health. Each service should have a RED method dashboard (Rate, Errors, Duration), and the system should have a unified overview dashboard.

## Acceptance Criteria

### Setup

- [ ] Install Prometheus via Helm (`kube-prometheus-stack`)
- [ ] Verify Prometheus is scraping pod metrics
- [ ] Install `prom-client` in GraphQL API and Enrichment Service
- [ ] Learn basic PromQL queries

### Custom Metrics

- [ ] Add custom application metrics to API: request count, latency, error rate
- [ ] Add custom metrics to Enrichment Service: queue depth, processing latency, enrichment success/failure rate
- [ ] Expose `/metrics` endpoint on all services
- [ ] Verify custom metrics appear in Prometheus

### Dashboards

- [ ] Install Grafana via Helm
- [ ] Create first dashboard: request rate and latency per service
- [ ] Add database connection pool metrics
- [ ] Build per-service dashboards using RED method (Rate, Errors, Duration)
- [ ] Create a system overview dashboard showing all services
- [ ] Add RabbitMQ queue depth and consumer lag metrics
- [ ] Make dashboards filterable by service and endpoint

### Verification

- [ ] Add resource utilization dashboards (CPU, memory, disk, network)
- [ ] Set up Prometheus recording rules for expensive or frequently-used queries
- [ ] Review dashboards for blind spots before moving to Module 07

## Related ADRs

_None yet. Add links here as decisions are made during this module._

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.
