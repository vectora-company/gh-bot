# Instruções para agentes: Vectora GH Bot

Este é o repositório do produto independente Vectora GH Bot, disponível como
serviço hospedado pago pela Vectora Ltda ou como instalação self-hosted do
usuário. A raiz do checkout é a fonte de configuração do produto. O app
TypeScript consome a Vectora Engine pelo pacote npm e usa o Vectora Services
principalmente para login/identidade e entitlement hospedado. Não trate as issues antigas do Services ou da Company
como especificação deste produto: elas descrevem o fluxo anterior, no qual a
Company era o painel e o Vectora App servia como host do modo self-hosted.

## Fronteiras

- **Vectora GH Bot:** configuração local, CLI, interface web, integração GitHub,
  validação de eventos, idempotência de jobs e publicação de resultados.
- **Vectora Engine:** runtime, chamadas a modelos, Decision Models e storage
  reutilizável. Não duplicar essas capacidades em TypeScript.
- **Vectora Services:** login/autenticação pelo Vectora token e APIs
  compartilhadas explicitamente contratadas. Não encaminhar cada chamada de
  GitHub, provider, Engine ou storage pelo Services.
- **Vectora Company:** dashboard de conta e emissão/acesso ao Vectora token. Não é o
  frontend administrativo do GH Bot.
- **Runtime do produto:** TanStack Start com Nitro em processo Node.js 22+ ou
  Bun para desktop/VPS;
  não adicionar target serverless.
- **Painel:** React/Vite, TanStack Router para rotas, TanStack Query para estado
  remoto, Zustand para estado transitório e Motion para animações.

Providers, chaves, modelos, storage e políticas do Bot são configurados na
instância self-hosted pela UI ou CLI. Não persistir esses valores na Company.
Conta Free pode obter o Vectora token e usar o modo self-hosted com recursos
próprios. A modalidade hospedada é paga; seus entitlements são validados pelo
Services, sem transformar o Services em proxy de execução.

## Regras

1. Preserve uma única implementação de runtime na Engine Rust. O pacote npm é
   um binding ao Rust, não uma reimplementação.
2. Trate configurações como schema versionado com migrações, permissões de
   arquivo seguras, backup e redaction.
3. Use o menor escopo GitHub necessário. Verifique assinatura de webhook,
   instalação, repositório e entrega antes de criar efeitos.
4. Jobs devem ser idempotentes por instalação/repositório/entidade/commit; não
   duplicar comentários ou reviews em webhook repetido.
5. Serviços independentes (Services, Engine, provider, storage) têm health e
   erros separados. Falha de um não deve ser apresentada como sucesso.
6. Segredos nunca entram em logs, eventos, prompts, browser bundle, exemplos ou
   commits. Use secret references e arquivos de segredo do container quando
   suportados.
7. Documente mudanças em CLI, Docker, Helm/Kubernetes e configuração na mesma
   alteração que muda o contrato.
8. Não afirme integração pronta antes de o contrato remoto existir e passar
   pelos testes de compatibilidade.
9. Mantenha `SConstruct`, `.pre-commit-config.yaml`, `utils/` e `.github/workflows/`
   como partes obrigatórias do bootstrap. CI e hooks devem funcionar em Linux,
   Windows e macOS; `scons frontend` nunca instala dependências.
10. Todo o código do produto fica em `app/`. Páginas e endpoints ficam em
    `app/src/routes/`; use server functions para chamadas internas e server
    routes para endpoints HTTP externos. Não introduza um segundo servidor HTTP.
    Valide entrada e autorização no servidor; preserve request ID, logs
    estruturados e cabeçalhos seguros.

## Referências

- Visão do produto: `docs/product.md`.
- Arquitetura: `docs/architecture.md`.
- Contrato de Services: `docs/services-integration.md`.
- Engine: `docs/engine-integration.md`.
- Segurança: `SECURITY.md` e `docs/security.md`.
- Desenvolvimento: `CONTRIBUTING.md`.
- Comandos SCons: `SConstruct`.
- Hooks locais: `.pre-commit-config.yaml`.
