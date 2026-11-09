# Roadmap do bootstrap

1. **Fundação de execução:** CLI global, config versionada, serviço HTTP,
   logging/redaction, health, migrações e painel seguro local.
2. **Conta e GitHub:** Services client/token session; conexão de contas e
   instalações GitHub, escopos, eventos verificados e rotação/revogação.
3. **Engine:** binding TypeScript npm versionado, setup de providers/modelos,
   Decision Models, streaming, cancellation e conformidade Rust/TS.
4. **Storage:** configurar SQLite/LanceDB/NATS e PostgreSQL/Qdrant/Redis por
   capability, inclusive combinações, health, backup e migração.
5. **Bot de GitHub:** policy editor, jobs idempotentes, review estruturado,
   comentários e métricas locais.
6. **Distribuição:** publicação npm com provenance, imagem GHCR, chart Helm,
   SBOM, assinatura, upgrade/rollback e docs de VPS/Kubernetes.

Cada fase libera capacidade somente quando seus contratos Services/Engine
existirem. Identidade por Services, account Free, provider local e runtime
self-hosted são princípios de produto, não items opcionais do roadmap.
