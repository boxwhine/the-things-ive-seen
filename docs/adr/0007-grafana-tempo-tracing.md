# ADR-0007: Use Grafana Tempo for Distributed Tracing

Date: 2026-03-25
Status: Accepted

## Context

Distributed tracing is required to observe requests flowing across the API and Enrichment Service. The two candidates considered were Jaeger and Grafana Tempo. Both are OpenTelemetry-compatible backends, meaning instrumentation code is identical regardless of which is chosen.

Jaeger is a standalone tracing platform with its own UI, widely referenced in older job descriptions. Grafana Tempo is a trace storage backend that surfaces traces natively inside Grafana, alongside metrics (Prometheus) and logs (Loki).

## Decision

Use Grafana Tempo with OpenTelemetry instrumentation.

## Consequences

- Traces, metrics, and logs are all queryable within a single Grafana UI — enabling correlation between a metric spike, the relevant log lines, and the specific trace for that request
- This is the modern observability standard and consistent with how mature SRE teams operate
- OpenTelemetry is the transferable skill; the backend is an implementation detail. The relevant resume line is "OpenTelemetry instrumentation," not "Jaeger" or "Tempo"
- Jaeger is more commonly cited in older job descriptions; this trade-off is accepted given the stronger architectural coherence of the unified Grafana stack
- If Jaeger familiarity becomes a hiring requirement, the OTel instrumentation code requires no changes — only the backend configuration changes
