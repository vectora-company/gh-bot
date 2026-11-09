# Providers, modelos e storage

## Providers e modelos

O operador configura seus próprios providers dentro do GH Bot. A configuração
deve indicar provider, endpoint quando aplicável, secret reference, capacidade
necessária e modelo selecionado por tarefa (por exemplo, review, triage ou
resposta a comentário). Disponibilidade é verificada pelo adapter da Engine;
uma lista estática de providers/modelos não é fonte da verdade.

Chaves são inseridas localmente, mascaradas depois de salvas e substituídas por
fluxo explícito. Não são devolvidas à UI após gravação. Provider calls podem
incorrer custos e quotas do fornecedor escolhido pelo operador.

## Decision Models

São capability própria da Engine para classificação/seleção e devem ser
configuráveis por função do Bot, com provider/modelo, budget, timeout,
fallback, política de privacidade e sinal de disponibilidade. Não tratar
Decision Models como sinônimo do modelo de geração principal.

## Storage

Cada tipo de dado seleciona backend compatível de forma independente; modos
misto/local/remoto são válidos quando a Engine os suporta.

| Tipo                               | Opções candidatas                                             |
| ---------------------------------- | ------------------------------------------------------------- |
| Relacional/configuração/job ledger | SQLite local ou PostgreSQL remoto                             |
| Vetorial/RAG                       | LanceDB local ou Qdrant remoto                                |
| KV/cache/streams                   | NATS local, Redis remoto ou capacidades definidas pela Engine |

O GH Bot não codifica adapters de storage diretamente. O inventário exato,
semânticas e limitações ficam no contrato da Engine. É permitido rodar
SQLite+LanceDB+NATS local e PostgreSQL+Qdrant+Redis remoto, ou combinações
suportadas. Não apresentar backend como disponível antes do health check real.

## Fonte configurável

A UI e a CLI editam o mesmo schema versionado. A instalação deve suportar
validar, aplicar, comparar, exportar e importar config sem secret values.
Segredos são referências locais e nunca devem sair em export por padrão.
