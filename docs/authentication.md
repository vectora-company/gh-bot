# Identidade e instalação

## Fluxo da conta Vectora

1. O operador cria uma conta Vectora gratuita e obtém seu Vectora token no
   dashboard da Company.
2. No painel local ou CLI, informa o token. O GH Bot o envia ao Vectora Services
   por TLS para autenticar a conta e associar a instalação.
3. Services devolve uma identidade/resultado de sessão conforme contrato
   versionado; o Bot guarda o token como segredo local e apresenta expiração,
   estado e instruções de revogação.
4. A conexão com o Services é opcional para executar capacidades locais da
   Engine, exceto operações que dependam explicitamente de integração remota.

O token não deve aparecer em URL, argumentos de processo, shell history, logs,
browser storage ou status exports. Preferir device flow ou prompt interativo na
CLI e sessão local HttpOnly/SameSite no navegador.

## Contas GitHub

Depois da identidade Vectora, o operador conecta uma ou mais contas/instalações
GitHub através do fluxo mediado pelo Services. A UI mostra owner, repositórios,
permissões concedidas, data de conexão, validade e estado. Remover/desautorizar
uma conexão revoga o acesso sem apagar configurações locais não relacionadas.

OAuth de usuário e instalação de GitHub App têm semânticas diferentes. O produto
deve preferir instalação de GitHub App e tokens de instalação curtos e
restritos; o Services precisa publicar o contrato de associação, renovação e
revogação adequado. Um PAT amplo não é substituto silencioso.

## Acesso ao painel

- Padrão loopback: sem autenticação de rede externa durante primeiro setup.
- Bind em LAN/VPS: exigir autenticação local e TLS via reverse proxy antes de
  abrir o painel para outras máquinas.
- Não confiar em login Services como única proteção contra CSRF no painel local.
- Em multi-user, separar owner da instalação e operadores, e registrar
  auditoria local de alterações privilegiadas.
