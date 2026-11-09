# Levantamento das propostas antigas do GH Bot

As issues ainda abertas em Services e Company foram escritas para um desenho
anterior. Elas são histórico do produto e não limitam os requisitos atuais do
GH Bot. Este resumo registra a diferença identificada no bootstrap.

| Tema                   | Desenho antigo nas issues                                                                                 | Produto definido agora                                                                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Quem hospeda o runtime | Vectora App executa o motor local e recebe job pelo túnel; Services também oferece modo hosted.           | Duas modalidades do mesmo produto: hosted pago operado pela Vectora Ltda, ou self-hosted na infraestrutura do usuário, distribuído por npm/Docker/Kubernetes. Ambos consomem Engine Rust.        |
| Frontend               | Company é painel de providers, tokens, jobs, policy e modo de execução.                                   | Frontend e CLI de configuração pertencem ao GH Bot. Company oferece conta/token e pode encaminhar à oferta hosted; não configura o runtime.                                                      |
| LLM e catálogo         | Vectora App fornece matriz e credenciais; Services serve snapshot e pode armazenar config hosted.         | Engine fornece runtime e capacidades. Em self-hosted, operador configura keys, modelos, Decision Models e storage no próprio GH Bot. Hosted é operado pela Vectora Ltda, com controles do plano. |
| GitHub                 | Action e Services API de jobs integram Company, Vectora App e `review-action`; OAuth/conexões são gerais. | `review-action` chama diretamente o endpoint configurado e autentica com segredo/token próprio do GH Bot. A URL aponta ao hosted da Vectora ou à VPS do usuário. Services não é proxy do fluxo.  |
| Papel do Services      | API de jobs/relay coordena Company, Vectora App, Action e modo hosted.                                    | Principalmente login/identidade Vectora e entitlement hosted; APIs adicionais apenas quando explicitamente necessárias. Não encaminha cada evento, chamada de modelo ou acesso a storage.        |
| Entitlement            | `gha_bot` tratado como recurso Pro para hosted/Action/relay.                                              | Free pode autenticar e operar self-hosted com recursos próprios. Assinatura paga dá acesso à modalidade hosted operada pela Vectora.                                                             |

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
