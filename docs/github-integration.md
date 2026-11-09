# Integração com GitHub

## Ponto de entrada: `vectora-review-action`

O repositório `vectora-review-action` é o ponto de entrada configurado no
workflow do GitHub. Cada instalação informa o endpoint público e um token ou
segredo específico do Bot. A Action envia o evento/contexto necessário ao
endpoint; a borda/roteamento Cloudflare pode encaminhá-lo ao origin self-hosted.
Para o GH Bot hospedado, endpoint e origin são operados pela Vectora Ltda; no
self-hosted, o origin é a VPS/cluster do usuário. A API de aplicação do
Services não processa nem faz proxy de cada request.

Contrato esperado da Action: validação TLS, auth por token dedicado e rotacionável,
limites de payload/timeout, identificador idempotente, resposta estruturada e
mensagens de erro sem vazamento de secrets. Nunca usar o Vectora token como
segredo de webhook nem colocar credenciais em argumentos/logs do workflow.

## Conexão GitHub do runtime

Para receber webhooks diretamente, usar GitHub App para instalação selecionável
por usuário/organização, eventos associados a uma instalação e permissões de
repositório menores que uma credencial pessoal. Quando a Action inicia a
execução, usar credenciais de instalação apropriadas para ler contexto e
publicar resultado. A lista de eventos e permissões deve ser derivada das
operações efetivamente implementadas.

O onboarding lista instalações e repositórios disponíveis e deixa escolher o
escopo de trabalho. Uma instalação pode ser pausada ou removida sem afetar as
demais contas conectadas.

## Eventos e jobs

- Validar HMAC da webhook secret antes de ler payload como evento confiável.
- Armazenar `delivery_id`, installation/repository IDs e estado do processamento.
- Deduplicar redelivery e criar no máximo um efeito por chave de job definida.
- Limitar bytes, concorrência, retries e timeout; enviar falha persistente para
  estado terminal recuperável.
- Tratar title, body, diff, comentários, nomes de branch e conteúdo de arquivo
  como entrada não confiável para o modelo.
- Nunca derivar permissões a partir de conteúdo do prompt.
- Publicar review/comentário usando credencial da instalação e validar que a
  saída respeita formato, tamanho, localização e política de comportamento.

## Endpoint por modalidade

No self-hosted, o operador configura endpoint, usuário/credencial de acesso e
segredo do Bot para a instalação. O request chega ao endpoint público e é
roteado pela borda Cloudflare para a infraestrutura do usuário, sem executar o
GH Bot na Cloudflare. No modo hospedado, endpoint e origin são operados pela
Vectora Ltda. Não introduzir relay de aplicação Services no caminho padrão.

O bootstrap inicial ainda não processa eventos GitHub; a integração deve ficar
marcada como indisponível até assinatura, install identity, replay e idempotência
estarem implementados e testados.
