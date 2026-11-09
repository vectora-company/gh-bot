# Contribuindo

Vectora GH Bot é uma aplicação self-hosted em TypeScript que consome a Vectora
Engine e o Vectora Services por contratos versionados.

## Ambiente

- Node.js 22 ou superior.
- pnpm 10, conforme `packageManager` em `package.json`.
- `pnpm install --frozen-lockfile` para instalar o workspace.
- `pnpm dev` sobe o serviço e o painel Vite.

## Regras de implementação

- A Engine Rust é a fonte da lógica genérica de IA. Não implemente um loop de
  agente, cliente de provider ou adapter de storage paralelo em TypeScript.
- O GH Bot mantém as regras próprias de GitHub: validar eventos, deduplicar
  entregas, aplicar configurações do operador e publicar resultados.
- O Services é acessado por um cliente tipado. Não imite seus contratos nem
  tome decisões de conta/entitlement no navegador.
- Segredos nunca entram em logs, telemetria, saída de diagnóstico, bundle web
  ou arquivos de configuração versionados.
- Toda entrada de GitHub, modelo, repositório e configuração é não confiável;
  valide antes de persistir ou executar ações.
- Mantenha modos CLI, Docker e Kubernetes coerentes com o mesmo schema de
  configuração.
- Use Conventional Commits e escreva títulos e descrições de PR em português.

## Verificações

```bash
pnpm typecheck
pnpm build
pnpm test
```

Não use GitHub Actions `pull_request_target` para executar código vindo da
branch de um pull request. Leia [`SECURITY.md`](SECURITY.md) antes de tocar em
OAuth, webhooks, secrets, permissões GitHub ou fronteiras de tenant.
