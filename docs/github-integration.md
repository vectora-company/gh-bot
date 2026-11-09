# Integração com GitHub

## Aplicação recomendada

Usar GitHub App para instalação selecionável por usuário/organização, eventos
associados a uma instalação e permissões de repositório menores que uma
credencial pessoal. A lista de eventos e permissões deve ser derivada das
operações efetivamente implementadas. O operador só instala a App nas contas e
repositórios autorizados.

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

## Entrega em self-hosted

O desenho precisa funcionar em VPS e clusters sem depender de IP fixo. Opções
que precisam de decisão de contrato são endpoint HTTPS público configurado
pelo operador ou relay outbound autenticado pelo Services. Não aceite túnel
genérico nem encaminhamento arbitrário para a rede privada do host.

O bootstrap inicial ainda não processa eventos GitHub; a integração deve ficar
marcada como indisponível até assinatura, install identity, replay e idempotência
estarem implementados e testados.
