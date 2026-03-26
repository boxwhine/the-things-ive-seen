# Module 10: Chaos Engineering & Polish

**Status:** ⬜ Not Started

**Start Date:** —

**End Date:** —

## Goal

Run automated chaos experiments to validate the reliability of the full system and the completeness of monitoring coverage. Optimize AWS costs, polish documentation, and produce the final portfolio artifacts.

## Acceptance Criteria

### Automated Chaos

- [ ] Install Chaos Mesh or Litmus
- [ ] Define chaos experiments: pod failure, network partition, resource stress
- [ ] Run experiments automatically and verify monitoring catches every scenario
- [ ] Document results for each experiment

### Additional Chaos Scenarios

- [ ] Run resource exhaustion scenarios (CPU/memory limits hit)
- [ ] Simulate slow downstream dependencies (Spotify, Setlist.fm timeouts)
- [ ] Write postmortems for any monitoring gaps discovered
- [ ] Fix alerting blind spots before marking complete

### Cost & Optimization

- [ ] Review AWS cost breakdown for the full project
- [ ] Optimize resource requests/limits based on actual observed usage
- [ ] Document cost breakdown and optimization decisions
- [ ] Evaluate reserved instances or spot instances where appropriate

### Documentation & Portfolio

- [ ] Verify all Mermaid diagrams in ARCHITECTURE.md are accurate and up to date
- [ ] Polish root README: confirm setup instructions are complete and accurate
- [ ] Compile chaos day and module postmortems into a readable summary
- [ ] Confirm all ADRs are filed and up to date
- [ ] Confirm all module files are complete with notes

## Related ADRs

_None yet. Add links here as decisions are made during this module._

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.
