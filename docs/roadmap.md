# Roadmap do bootstrap

1. **Fundação do produto:** CLI global, config versionada, serviço HTTP,
   logging/redaction, health e painel seguro; definir limites entre runtime
   hosted pela Vectora e self-hosted pelo usuário.
2. **Login e acesso:** Services client/Vectora token, identidade Free e
   verificação de entitlement do GH Bot hospedado. Não colocar eventos no proxy
   Services.
3. **Engine:** binding TypeScript npm versionado, setup de providers/modelos,
   Decision Models, streaming, cancellation e conformidade Rust/TS.
4. **Action e GitHub:** contrato `review-action` para endpoint + token próprio,
   integração GitHub, escopos, autenticação, idempotência e revogação.
5. **Storage:** configurar SQLite/LanceDB/NATS e PostgreSQL/Qdrant/Redis por
   capability, inclusive combinações, health, backup e migração.
6. **Bot de GitHub:** policy editor, jobs idempotentes, review estruturado,
   comentários e métricas locais.
7. **Distribuição:** publicação npm com provenance, imagem GHCR, chart Helm,
   SBOM, assinatura, upgrade/rollback e operação 24/7 do plano hosted.

Cada fase libera capacidade somente quando seus contratos Services/Engine
existirem. Login por Services, self-hosted com recursos próprios e plano
hosted pago operado pela Vectora são princípios de produto. O modelo exato de
contas/credenciais GitHub continua configurável pelo GH Bot; Services não deve
ser tratado como broker universal.
