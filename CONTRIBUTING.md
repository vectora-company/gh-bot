# Contribuindo

Vectora GH Bot é um produto independente em TypeScript, operado pela Vectora
como serviço pago ou pelo usuário como self-hosted. Consome a Vectora Engine e
usa o Vectora Services principalmente para login/identidade e entitlement. A
review-action chama o endpoint do Bot; o backend Services não é proxy do job.

## Ambiente

- Node.js 22 ou superior.
- Bun também é suportado para executar o servidor e scripts locais.
- pnpm 10, conforme `packageManager` em `package.json`.
- Python 3.10 ou superior, SCons e pre-commit.
- `scons install` (executa `pnpm install --frozen-lockfile`) para instalar dependências Node do workspace pelo lockfile.
- `pnpm dev` sobe o serviço e o painel Vite.
- `scons frontend` compila somente o painel e não instala dependências.
- `scons ci` executa instalação, lint, build e testes locais do tooling.
- Instale os hooks com `pre-commit install`; o primeiro hook identifica o SO e
  verifica as ferramentas necessárias em Linux, Windows e macOS.

## Regras de implementação

- A Engine Rust é a fonte da lógica genérica de IA. Não implemente um loop de
  agente, cliente de provider ou adapter de storage paralelo em TypeScript.
- O GH Bot mantém as regras próprias de GitHub: validar eventos, deduplicar
  entregas, aplicar configurações do operador e publicar resultados.
- O Services é acessado por um cliente tipado para login e capacidades
  explicitamente contratadas. Não roteie por ele cada evento GitHub, execução da
  Engine, chamada de provider ou operação de storage. Não tome decisões de
  conta/entitlement no navegador.
- Preserve os dois modos de operação. O hosted é operado pela Vectora e depende
  da assinatura; o self-hosted roda na infraestrutura do usuário. Ambos usam a
  UI/CLI do GH Bot e a mesma Engine.
- Para a `review-action`, mantenha explícito o contrato de endpoint público,
  credencial do Bot e reverse proxy opcional operado pelo usuário. Não confunda esse
  segredo com o Vectora token.
- Segredos nunca entram em logs, telemetria, saída de diagnóstico, bundle web
  ou arquivos de configuração versionados.
- Toda entrada de GitHub, modelo, repositório e configuração é não confiável;
  valide antes de persistir ou executar ações.
- Mantenha modos CLI, Docker e Kubernetes coerentes com o mesmo schema de
  configuração.
- Use Conventional Commits e escreva títulos e descrições de PR em português.

## Verificações

```bash
scons install
scons lint
scons tests
scons ci
```

Não use GitHub Actions `pull_request_target` para executar código vindo da
branch de um pull request. Leia [`SECURITY.md`](SECURITY.md) antes de tocar em
OAuth, webhooks, secrets, permissões GitHub ou fronteiras de tenant.
