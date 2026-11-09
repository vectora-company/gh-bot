# Instruções para agentes: Vectora GH Bot

Este é o repositório do serviço self-hosted Vectora GH Bot. A raiz do checkout
é a fonte de configuração do produto. O app TypeScript consome a Vectora
Engine pelo pacote npm e usa o Vectora Services como intermediário de identidade
e integrações hospedadas. Não trate as issues antigas do Services ou da Company
como especificação deste produto: elas descrevem o fluxo anterior, no qual a
Company era o painel e o Vectora App servia como host do modo self-hosted.

## Fronteiras

- **GH Bot:** configuração local, CLI, interface web, integração GitHub,
  validação de eventos, idempotência de jobs e publicação de resultados.
- **Vectora Engine:** runtime, chamadas a modelos, Decision Models e storage
  reutilizável. Não duplicar essas capacidades em TypeScript.
- **Vectora Services:** autenticação da conta pelo Vectora token, vínculo de
  contas/instalações GitHub e APIs compartilhadas explicitamente contratadas.
- **Company:** dashboard de conta e emissão/acesso ao Vectora token. Não é o
  frontend administrativo do GH Bot.

Providers, chaves, modelos, storage e políticas do Bot são configurados na
instância self-hosted pela UI ou CLI. Não persistir esses valores na Company.
Conta Free pode obter o Vectora token; não assumir que o modo self-hosted local
precisa de entitlement Pro. Entitlements de qualquer capacidade hospedada são
decididos pelo Services.

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

## Referências

- Visão do produto: `docs/product.md`.
- Arquitetura: `docs/architecture.md`.
- Contrato de Services: `docs/services-integration.md`.
- Engine: `docs/engine-integration.md`.
- Segurança: `SECURITY.md` e `docs/security.md`.
- Desenvolvimento: `CONTRIBUTING.md`.
