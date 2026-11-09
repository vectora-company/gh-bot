# Referências de produto

Estas referências ajudam a avaliar padrões de operação e interface. Não são
contratos a copiar nem definem o escopo do GH Bot.

| Projeto/documentação                                                                                                                                      | O que observar                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [PR-Agent](https://github.com/qodo-ai/pr-agent)                                                                                                           | Bot de revisão open source acionado por comentário, webhook, CI ou CLI; integração GitHub sem desktop.                            |
| [Paperclip](https://github.com/paperclipai/paperclip)                                                                                                     | Serviço Node.js com UI React, onboarding/configuração, providers/harnesses por agente, operação self-hosted e um painel próprio.  |
| [9Router](https://github.com/9router/9router) e [OmniRoute](https://github.com/commodware/omniroute)                                                      | Distribuição npm/Docker e dashboard para configurar providers/roteamento. Conferir upstream e licença antes de reutilizar código. |
| [Grafana provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/)                                                              | Configuração como código, uso de env/secret files e distinção entre declaração e segredo.                                         |
| [GitHub App authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app) | Diferencia autenticação como app, instalação e usuário; ajuda a escolher permissões por instalação.                               |
| [GitHub App permissions](https://docs.github.com/en/apps/creating-github-apps/registering-github-apps/choosing-permissions-for-a-github-app)              | Permissões por evento/API e princípio de pedir apenas as necessárias.                                                             |

Antes de selecionar permissões da GH App, enumerar cada operação e evento do
produto e mapear para a matriz oficial de permissões. Revisar links e estado
dos projetos antes de tomar decisões de dependência ou cópia de código.
