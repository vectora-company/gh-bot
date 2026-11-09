# CLI e operação

## Comandos planejados

```text
vectora-gh-bot start                 Inicia API e painel web
vectora-gh-bot setup                 Configura caminho interativo
vectora-gh-bot auth login            Conecta Vectora Services
vectora-gh-bot github connect        Conecta uma conta/instalação GitHub
vectora-gh-bot config validate       Valida configuração e migrações
vectora-gh-bot config export        Exporta sem secrets por padrão
vectora-gh-bot doctor                Diagnostica runtime e dependências
vectora-gh-bot status                Estado das integrações e jobs
vectora-gh-bot migrate               Aplica migrações de dados local
```

No bootstrap, `start`, `doctor`, `--version` e `--help` existem; os outros
comandos são roadmap e não devem ser apresentados como disponíveis.

## SCons e instalação de desenvolvimento

`scons install` instala as dependências travadas do workspace com `pnpm install --frozen-lockfile`. `scons frontend`
somente compila `apps/web` e pressupõe que a instalação já foi feita;
`scons build` compila painel e servidor, `scons lint` verifica tipos, `scons
tests` executa a suíte disponível e `scons ci` encadeia as verificações locais.
O CI de pull requests executa o fluxo SCons em Linux, Windows e macOS, além de
pre-commit, validação de metadados e varredura de segredos.

## Observabilidade

Logs JSON com timestamp, severity, component, request/job/run IDs e status de
capacidade. Métricas incluem fila/idade, latência, falhas, retries, cancelamento
e health de dependências. Redact provider credentials, Vectora/GitHub tokens,
diff, prompt e conteúdo de resposta. Eventos com payload de job não entram em
telemetria do Services.

## Backups e recuperação

Documentar caminho de dados, snapshot consistente dos storages configurados,
chaves de cifragem separadas, retenção, restauração e migração de schema. NATS
sidecar e stores embutidos devem fechar/reabrir no ciclo de vida do processo;
Kubernetes shutdown deve dar tempo a jobs para concluir ou persistir estado
cancelado/recuperável.
