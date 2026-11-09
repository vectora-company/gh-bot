# Identidade e instalação

## Fluxo da conta Vectora

1. O operador cria uma conta Vectora gratuita e obtém seu Vectora token no
   dashboard da Company.
2. Na UI/CLI do GH Bot, informa o token. O GH Bot o envia ao Vectora Services
   por TLS para login e validação da identidade.
3. Services devolve identidade/resultado de sessão conforme contrato
   versionado; o Bot guarda a credencial de forma segura e apresenta expiração,
   estado e instruções de revogação.
4. Login no Services não coloca o Services no caminho de eventos GitHub,
   chamadas de provider ou storage. A execução self-hosted/local deve continuar
   disponível com recursos próprios, mesmo quando capacidades remotas do
   Services não estiverem conectadas.

O token não deve aparecer em URL, argumentos de processo, shell history, logs,
browser storage ou status exports. Preferir device flow ou prompt interativo na
CLI e sessão local HttpOnly/SameSite no navegador.

## Contas GitHub

Depois da identidade Vectora, o usuário configura uma ou mais contas/instalações
GitHub no próprio GH Bot, usando o mecanismo de credenciais definido pelo modo
de operação. Services pode oferecer login/consentimento ou recursos
explicitamente contratados, mas não é proxy das chamadas ao GitHub. A UI mostra
owner, repositórios, permissões concedidas, validade e estado.

OAuth de usuário e instalação de GitHub App têm semânticas diferentes. O produto
deve preferir GitHub App ou credenciais curtas e restritas. Segredos do GH Bot
para autenticar chamadas da `review-action` devem ser emitidos localmente no
self-hosted ou pelo fluxo do produto hospedado, ter escopo/revogação e não ser
confundidos com o Vectora token. Um PAT amplo não é substituto silencioso.

## Acesso ao painel

- Padrão loopback: sem autenticação de rede externa durante primeiro setup.
- Bind em LAN/VPS: exigir autenticação local e TLS via reverse proxy antes de
  abrir o painel para outras máquinas.
- Não confiar em login Services como única proteção contra CSRF no painel local.
- Em multi-user, separar owner da instalação e operadores, e registrar
  auditoria local de alterações privilegiadas.
