# Hospedagem, Docker e Kubernetes

## Serviço hospedado pela Vectora

A Vectora Ltda opera uma modalidade paga do GH Bot em infraestrutura própria.
Ela é independente da instalação self-hosted do usuário; assinatura, limites,
isolamento de tenants, retenção e disponibilidade precisam ser definidos e
aplicados no produto hospedado. A Company pode iniciar a assinatura/conta, e o
Services valida identidade e entitlement. O endpoint de runtime é chamado
diretamente pela `review-action`, sem proxy de execução pelo Services.

## Self-hosted

O operador instala e mantém o GH Bot em sua VPS/cluster e paga sua própria
infraestrutura. O setup mostra a URL pública que deve ser configurada na
`vectora-review-action`, junto com um segredo/token gerado pelo próprio GH Bot.
O GitHub Action chama esse endpoint diretamente. Login Services é para
identidade e recursos contratados, não requisito para chamadas locais da Engine.

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

Operador self-hosted fornece:

- `Secret`/external secret para tokens e credenciais;
- `ConfigMap` para opções não secretas;
- PVC/CSI para dados locais e backup;
- ingress TLS se o GitHub enviar eventos diretamente;
- NetworkPolicy e service account mínima;
- requests/limits, disruption/shutdown grace period e estratégia de atualização.

O chart é scaffold. Sem ServiceMonitor, HPA ou alta disponibilidade prometidos
até métricas, coordenação e capacidades de storage estarem implementadas.
