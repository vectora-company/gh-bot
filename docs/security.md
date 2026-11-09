# Segurança e privacidade

## Dados

Por padrão, diffs, comentários, prompts, respostas, secrets, tokens e strings de
conexão permanecem no processo e storage do operador. O envio a um LLM é uma
ação explícita de configuração do provider e deve ser indicado ao operador.
Services recebe só campos necessários a identidade e operações de integração
que ele hospeda.

## Segredos

- Armazenamento cifrado com chave gerada por instalação e opção de secret
  manager do host/container.
- Rotation e revocation para Vectora token, GitHub App credentials,
  webhook secrets, provider keys e database DSNs.
- Redaction em logs, traces, errors, crash reports, telemetry e diagnóstico.
- Export seguro sem secrets; backup descreve como incluir/rotacionar a chave.

## Webhook e execução

- Verificar assinatura, entrega e instalação antes de processar evento.
- Deduplicar replay; aplicar rate limits e limites de tamanho/concurrency.
- Validar URL/endpoint configurável e bloquear SSRF, loopback/metadata cloud
  quando não exigidos explicitamente pelo operador.
- Separar tools disponíveis ao modelo das permissões GitHub; aplicar policy
  no host antes de cada efeito.
- Cancelar execuções e propagar shutdown ao Engine, provider e storage.

Ver [SECURITY.md](../SECURITY.md) para política de reporte e implantação.
