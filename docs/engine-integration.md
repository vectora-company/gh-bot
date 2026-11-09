# Integração com Vectora Engine

O GH Bot é consumidor TypeScript da Engine. O backend Python do Vectora App usa
a binding Python; os dois chegam à mesma implementação Rust. O Bot não chama
uma cópia TypeScript do runtime.

## Responsabilidade do Bot

- Converter eventos e ações GitHub em inputs aprovados do runtime.
- Passar identidade, repositório, escopo, políticas e capacidades por contexto
  confiável, sem conceder ao modelo permissões implícitas.
- Configurar provider/modelo por tarefa, Decision Models, limites, cancelamento
  e armazenamento segundo o contrato de Engine.
- Traduzir eventos/resultado do runtime para comentários, reviews e status
  GitHub com idempotência do lado do produto.

## Dependências e maturidade

O pacote npm da Engine ainda está sendo construído. Integrações devem ser
adicionadas capability por capability quando a API Rust e a binding TypeScript
estiverem publicadas e versionadas. Não declarar tool calling, streaming,
Decision Models, replay ou storage disponíveis antes de validar a versão
concreta do pacote.

Durante o bootstrap, manter `EngineClient` como interface tipada e um adapter
explicitamente ausente. Não implementar provider fake ou runtime substituto em
TypeScript. Para dev/test, fixtures determinísticas podem implementar o
protocolo no limite do adapter sem chamar provedores reais.
