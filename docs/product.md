# Produto e escopo

## Visão

Vectora GH Bot é uma aplicação independente, self-hosted e open source para
configurar agentes de engenharia que trabalham em repositórios GitHub. O
operador instala o runtime na própria máquina/VPS/cluster, autentica sua conta
Vectora com um token do Services, conecta uma ou mais contas GitHub e controla
providers, modelos, Decision Models, storage e políticas no frontend e na CLI
do próprio Bot.

## Modos de distribuição

1. **npm global:** instalar a CLI e iniciar o servidor local com painel web.
2. **Docker:** executar a mesma aplicação em VPS ou servidor próprio, com volume
   persistente.
3. **Kubernetes:** deployment com configuração, secrets, health probes, volume
   e ingress controlados pelo operador.

Os três modos usam o mesmo schema de configuração e APIs. Não há Electron.

## Quem faz o quê

| Componente | Responsabilidade |
|---|---|
| GH Bot | Superfície GitHub, CLI, painel, políticas próprias do bot, agendamento/idempotência do trabalho e saída de reviews/comentários. |
| Vectora Engine | Runtime agêntico, providers, Decision Models e adapters de storage reutilizáveis, pelo binding npm/Rust. |
| Vectora Services | Identidade Vectora, conta/token, conexão/instalação de GitHub e operações compartilhadas contratadas. |
| Company | Criar/gerenciar a conta Vectora e disponibilizar o token. Não configura o Bot. |

O GH Bot tem backend de produto pequeno, mas não nulo: precisa validar webhooks,
mapear eventos GitHub para execuções da Engine, aplicar escopo/regras, deduplicar
entregas e publicar o resultado no GitHub. Não deve recriar loop de agente,
drivers de LLM ou backends de storage.

## Propriedade dos dados

- Vectora token: emitido no dashboard da Company para autenticar a conta no
  Services; disponível para conta Free conforme a regra do produto.
- Conexões GitHub: associadas à conta via fluxo mediado pelo Services; múltiplas
  contas e instalações devem ser suportadas.
- Provider keys, storage credentials, modelos e políticas: pertencem à
  instalação self-hosted e ficam no host do operador.
- Jobs, histórico e memória: persistidos conforme os stores escolhidos pelo
  operador, com retenção e exportação configuráveis.
- Services recebe apenas os dados necessários às operações que ele intermedia;
  não recebe prompts/diffs por padrão.

## Fora do escopo

- Painel de configuração hospedado na Company.
- Dependência do processo desktop do Vectora para executar o Bot.
- Tornar Services ou um provider hospedado requisito para usar a Engine local.
- Desenvolver um segundo runtime de IA em TypeScript.
