# Comportamento do Bot

O operador define o que o GH Bot faz quando recebe eventos GitHub. A primeira
experiência deve ser conservadora, explícita e reversível.

## Áreas de configuração

- Eventos que iniciam execução e reações a menções/comandos.
- Repositórios e branches permitidos por instalação.
- Modos (review, triage, responder, sugerir correção) somente quando implementados.
- Severidade mínima, categorias, formato e limite de comentários.
- Arquivos/caminhos ignorados, limites de diff e timeout.
- Ações somente leitura versus escrita e aprovação explícita para mudanças.
- Política de execução, contexto que pode ser enviado a provider e redaction.
- Limites de execução, concorrência, janela de repetição e fallback.

## Guardrails

- Defaults sem escrita destrutiva; permissões GitHub são menores que o escopo
  de usuário e configuráveis por instalação/repositório.
- Não abrir PR, modificar branch ou aplicar correção sem feature explícita,
  permissões necessárias e confirmação/policy aprovadora.
- Issues, PR text, diffs e arquivos não alteram configuração nem autorização.
- Job mostra provider/modelo, policy version, decisão, custo/usage quando
  disponível, etapa e resultado, sem expor chain-of-thought ou secrets.
- Configuração tem revisão/versionamento e histórico de alterações local.

O bootstrap apresenta esta navegação, mas ainda não salva políticas funcionais.
