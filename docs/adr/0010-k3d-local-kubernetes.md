# ADR-0010: Use k3d for Local Kubernetes Development

Date: 2026-04-03
Status: Accepted

## Context

Module 1 requires running the full application stack in a local Kubernetes cluster. Three options were evaluated for local Kubernetes on macOS:

- **Docker Desktop Kubernetes** — upstream Kubernetes bundled with Docker Desktop. Single-node only, always-on with Docker Desktop, ~500MB–1GB additional RAM overhead.
- **minikube** — the original local Kubernetes tool. Supports multi-node but heavier than alternatives (~1–2GB RAM, 30–60s startup). Rich addon ecosystem, but addons can mask the underlying manifests.
- **k3d** — runs k3s (Rancher's lightweight Kubernetes) inside Docker containers. Multi-node support out of the box, ships with Traefik ingress and a built-in load balancer, ~300–500MB RAM, clusters start in seconds.

The project's target architecture calls for AWS EKS in production (Module 3). The local tool needs to support multi-node clusters, ingress, and realistic service discovery to build transferable Kubernetes knowledge.

## Decision

Use k3d as the local Kubernetes environment. The cluster is created with:

```bash
k3d cluster create ttis --agents 2 -p "80:80@loadbalancer" -p "443:443@loadbalancer"
```

This provides a 3-node cluster (1 server + 2 agents) with ports 80 and 443 mapped through k3d's load balancer for ingress.

## Consequences

- Multi-node scheduling is exercised from day one — pod placement, service discovery, and cross-node networking behave realistically
- Traefik ingress is available out of the box, so Ingress resources can be learned without additional setup
- Clusters can be created and destroyed quickly without impacting the Docker Compose dev workflow
- Images must be explicitly imported into k3d (`k3d image import`) rather than being shared from the Docker daemon — a slightly more realistic workflow that mirrors registry-based deployments
- k3s substitutes SQLite for etcd and bundles some components differently from upstream Kubernetes, but these differences do not affect any planned module work (manifests, probes, resource limits, Helm, GitOps)
- If EKS-specific behavior needs testing in later modules, k3d can be supplemented but is sufficient for Modules 1–9
