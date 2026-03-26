# Module 08: Alerting & Incident Response

**Status:** ⬜ Not Started

**Start Date:** —

**End Date:** —

## Goal

Build a complete alerting and incident response system: SLO-based alert rules, severity levels, runbooks linked from alert annotations, and a PagerDuty integration. Validate the entire system with a structured chaos day and produce postmortems for each incident.

## Acceptance Criteria

### Setup

- [ ] Configure Alertmanager (included in kube-prometheus-stack)
- [ ] Configure alert routing (email or Slack webhook)
- [ ] Write first alert rule: service down (no ready pods)
- [ ] Verify the alert fires and routes correctly

### Alert Rules

- [ ] Write SLO-based alert rules (error budget burn rate)
- [ ] Add alerts for: high latency, RabbitMQ queue backup, DB connection issues
- [ ] Define severity levels (critical, warning, info)
- [ ] Review for alert fatigue — keep rules focused and actionable

### Runbooks & Process

- [ ] Create a runbook for each alert (what to check, how to diagnose, how to fix)
- [ ] Document incident response process: detect → triage → mitigate → resolve → postmortem
- [ ] Set up PagerDuty free tier for on-call simulation
- [ ] Link runbooks from alert rule annotations

### Chaos Day

- [ ] Kill a pod randomly — verify alert fires, practice debugging with logs/traces
- [ ] Introduce artificial latency in an endpoint — verify latency alert fires
- [ ] Simulate database connection failure — verify alert and observe degradation
- [ ] Take detailed notes throughout: what alerted, what you observed, how you resolved it

### Postmortem

- [ ] Write a postmortem for each chaos day incident
- [ ] Include: timeline, detection method, root cause, impact, remediation steps
- [ ] Identify any monitoring gaps discovered
- [ ] Fix blind spots before closing the module

## Related ADRs

_None yet. Add links here as decisions are made during this module._

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.
