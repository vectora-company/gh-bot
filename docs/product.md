# Produto e escopo

## Visão

Vectora GH Bot é um produto independente e open source para automatizar
trabalho em repositórios GitHub usando a Vectora Engine. Há dois modos de
operação: hospedado e mantido pela Vectora Ltda, mediante assinatura, ou
self-hosted pelo usuário em sua própria VPS/cluster. A UI e a CLI pertencem ao
GH Bot em ambos os modos; Company não é seu painel administrativo.

## Modos de distribuição

1. **Hospedado:** a Vectora opera o runtime, endpoint e atualizações; o acesso
   é incluído em plano pago conforme as regras de assinatura.
2. **npm global:** instalar a CLI e iniciar o servidor self-hosted com painel
   web.
3. **Docker:** executar a mesma aplicação em VPS ou servidor próprio, com
   volume persistente.
4. **Kubernetes:** deployment com configuração, secrets, health probes, volume
   e ingress controlados pelo operador.

Os três modos usam o mesmo schema de configuração e APIs. Não há Electron.

## Quem faz o quê

| Componente | Responsabilidade |
|---|---|
| GH Bot | Produto e superfície GitHub: CLI, painel, políticas, agendamento/idempotência e saída de reviews/comentários; pode ser operado pela Vectora ou pelo usuário. |
| Vectora Engine | Runtime agêntico, providers, Decision Models e adapters de storage reutilizáveis, pelo binding npm/Rust. |
| Vectora Services | Login/identidade Vectora, validação do token e capacidades compartilhadas explicitamente contratadas. Não encaminha eventos nem chamadas do runtime por padrão. |
| Company | Criar/gerenciar a conta Vectora e disponibilizar o token; pode direcionar ao produto hospedado. Não configura o Bot. |
| `vectora-review-action` | Action configurada no repositório GitHub para chamar o endpoint público do GH Bot, com endpoint e segredo/token de autenticação; a borda Cloudflare pode rotear até o origin. |

O GH Bot tem backend de produto pequeno, mas não nulo: precisa validar eventos,
mapear eventos GitHub para execuções da Engine, aplicar escopo/regras, deduplicar
entregas e publicar o resultado no GitHub. No self-hosted, a Action chama o
endpoint público configurado, que pode rotear pela borda Cloudflare. Não deve recriar loop de agente,
drivers de LLM ou backends de storage.

## Propriedade dos dados

- Vectora token: emitido no dashboard da Company para autenticar a conta no
  Services; disponível para conta Free conforme a regra do produto.
- Conexões GitHub: o bot recebe credenciais/autorização adequadas ao modo de
  operação; múltiplas contas e instalações devem ser suportadas. Services não é
  proxy de chamadas GitHub por padrão.
- Provider keys, storage credentials, modelos e políticas: pertencem à
  instalação self-hosted e ficam no host do operador.
- Jobs, histórico e memória: persistidos conforme os stores escolhidos pelo
  operador, com retenção e exportação configuráveis.
- Services recebe apenas dados de identidade, entitlement e eventuais APIs
  explicitamente contratadas; não recebe prompts/diffs nem payloads de review
  por padrão.

## Fora do escopo

- Painel de configuração hospedado na Company.
- Dependência do processo desktop do Vectora para executar o Bot.
- Tornar Services ou um provider hospedado requisito para usar a Engine local.
- Exigir VPS do usuário no modo hospedado; esse modo é operado pela Vectora e
  depende de assinatura.
- Desenvolver um segundo runtime de IA em TypeScript.
