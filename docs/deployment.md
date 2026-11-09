# Docker e Kubernetes

## Docker

Imagem não-root, filesystem root read-only quando possível, healthcheck em
`/healthz`, readiness em `/readyz`, volume persistente e configuração por env.
Secrets são montados por Docker Secrets/secret manager; não passados na linha
de comando nem em imagem.

## Kubernetes

Chart Helm inicial em `deploy/helm/gh-bot` com Deployment, Service, probes,
PVC e Ingress opcional. Um pod por instalação SQLite local. Escalar réplicas
exige storage e locking compartilhado suportados pela Engine, dedupe distribuída
e estratégia de entrega de webhooks; não basta aumentar `replicas`.

Operator fornece:

- `Secret`/external secret para tokens e credenciais;
- `ConfigMap` para opções não secretas;
- PVC/CSI para dados locais e backup;
- ingress TLS se o GitHub enviar eventos diretamente;
- NetworkPolicy e service account mínima;
- requests/limits, disruption/shutdown grace period e estratégia de atualização.

O chart é scaffold. Sem ServiceMonitor, HPA ou alta disponibilidade prometidos
até métricas, coordenação e capacidades de storage estarem implementadas.
