# Segurança

O GH Bot processa conteúdo de repositórios, eventos GitHub e saídas de modelos.
Essas entradas são não confiáveis. A instalação roda com as permissões que o
operador concede e deve limitar cada integração a uma instalação/repositório.

## Regras para implantação

- Crie uma instalação GitHub App com permissões mínimas e escolha os
  repositórios explicitamente. Não use token pessoal amplo como padrão.
- Use TLS em qualquer acesso remoto ao painel, webhook ou API.
- Restrinja o painel a loopback durante configuração inicial; antes de expor na
  rede, habilite autenticação local e reverse proxy com TLS.
- Armazene provider keys, credenciais de storage, Vectora token e chaves de
  webhook apenas no armazenamento de segredos da instalação. Em Kubernetes,
  use Secrets ou um secret manager externo.
- Proteja o diretório de dados, backups e chaves de cifragem com permissões
  restritas e retenção definida pelo operador.
- Nunca execute conteúdo de issue, comentário, diff ou saída de modelo como
  comando sem passar pelas ferramentas e políticas autorizadas da Engine.

## Modelo de ameaça

As superfícies incluem webhook forgery/replay, prompt injection em conteúdo de
repositório, acesso cruzado entre instalações, SSRF por configuração de
endpoint, exfiltração de credenciais por logs, callback forgery, concorrência
de jobs e acesso indevido ao painel. Cada superfície precisa de validação,
autorização, limites, redaction e testes antes de produção.

O contrato de GitHub App, relay por Services e armazenamento de credenciais ainda
está em desenho. Até estar implementado, não aceite webhooks públicos nem
declare a instalação pronta para produção.

Reporte vulnerabilidades privadamente para `security@vectora.company`.
