# Levantamento das propostas antigas do GH Bot

As issues ainda abertas em Services e Company foram escritas para um desenho
anterior. Elas são histórico do produto e não limitam os requisitos atuais do
GH Bot. Este resumo registra a diferença identificada no bootstrap.

| Tema | Desenho antigo nas issues | Produto definido agora |
|---|---|---|
| Quem hospeda o runtime | Vectora App executa o motor local e recebe job pelo túnel; Services também oferece modo hosted. | GH Bot é processo TypeScript independente que o operador instala em npm, Docker ou Kubernetes; consome Engine Rust. |
| Frontend | Company é painel de providers, tokens, jobs, policy e modo de execução. | Frontend de configuração pertence ao GH Bot e acompanha sua CLI. Company fornece conta/token. |
| LLM e catálogo | Vectora App fornece matriz e credenciais; Services serve snapshot e pode armazenar config hosted. | Provider keys, seleção de modelos por tarefa, Decision Models e policies são configurados na instalação self-hosted e consumidos pela Engine. |
| GitHub | Action e Services API de jobs integram Company, Vectora App e `review-action`; OAuth/conexões são gerais. | Instância Bot conecta uma ou mais contas/instalações GitHub por integração mediada pelo Services e opera de forma independente do app desktop. |
| Entitlement | `gha_bot` tratado como recurso Pro para hosted/Action/relay. | Token da conta é obtido por usuário Free; execução local com providers próprios é self-hosted. Somente serviços remotos subsidiados podem exigir entitlement. |

## Issues relevantes já lidas

- Services #13 e #12 especificam jobs hosted/self-hosted ligados a Vectora App,
  Action e catálogo/snapshot de providers.
- Services #9 é a origem do entitlement `gha_bot`; Services #11 é gateway v2 de
  Companion e apenas preserva o fluxo GH Bot atual.
- Company #13 faz da Company o painel de gerenciamento do GH Bot; Company #12
  expõe `gha_bot` como entitlement.
- Company #10 é cliente genérico versionado do Services; #14–16 são SSO,
  automações e Connect, não a UI do novo GH Bot.

## Resultado para o bootstrap

O novo contrato e as decisões descritas em `product.md`, `services-integration.md`
e `engine-integration.md` são a base de implementação. Nenhuma issue foi editada
como parte deste bootstrap. A compatibilidade do antigo `vectora-review-action`
deve ser planejada separadamente, sem transformar o desktop Vectora em requisito
para o novo serviço.
