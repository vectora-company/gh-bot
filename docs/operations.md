# CLI e operação

## CLI global

```text
gh-bot                               Abre o menu interativo
gh-bot start                         Inicia com o dashboard
gh-bot start --mode background      Inicia sem servir o dashboard
gh-bot background                    Atalho para o modo em segundo plano
gh-bot status                        Consulta o processo em segundo plano
gh-bot stop                          Solicita encerramento gracioso
gh-bot config edit                   Edita GitHub, providers, modelos, storage,
                                     comportamento e opções da Engine
gh-bot config show                   Exibe configuração sem segredos
gh-bot config export [arquivo]       Exporta configuração sem login
gh-bot config import <arquivo>       Importa sem substituir login local
gh-bot auth login|status|logout      Gerencia credencial local do Services
gh-bot doctor                        Diagnostica runtime, build e configuração
```

O pacote instala os executáveis globais `gh-bot` e `vectora-gh-bot`. Sem
argumentos, o CLI apresenta opções para configurar, autenticar, abrir o
dashboard, iniciar em segundo plano e importar/exportar a configuração.
`config edit` abre cada seção como JSON no editor do terminal, permitindo
configurar os campos da Engine sem limitar o CLI a uma lista fixa de providers.

O arquivo principal é `config.json`; autenticação fica em `auth.json`, ambos no
diretório de dados do usuário. Exportação inclui apenas o schema de config e
falha se encontrar valores de token, senha, secret, API key ou private key. Use
referências como `apiKeyEnv`/`secretRef` para segredos. Importar também rejeita
campos de auth/login/session e preserva a credencial que já está instalada.

O modo background executa o mesmo servidor TanStack Start/Nitro. Ele mantém
health e rotas `/api/*`, mas não serve páginas nem assets React. O PID fica no
diretório de dados e os logs em `logs/gh-bot.log`; `stop` envia SIGTERM para um
shutdown gracioso. Não é necessário Hono ou um segundo servidor HTTP.

`auth login` coleta o Vectora token sem ecoá-lo e guarda-o com permissão local
restrita. A integração de validação/troca de token ainda depende do contrato
oficial do Services, descrito em `services-integration.md`; o comando deixa
essa limitação explícita e não simula uma sessão remota autenticada.

## SCons e instalação de desenvolvimento

`scons install` instala as dependências travadas do app com
`pnpm install --frozen-lockfile`. `scons frontend` compila o app TanStack Start
em `app/` e pressupõe que a instalação já foi feita;
`scons build` compila a aplicação e CLI, `scons lint` verifica tipos, `scons
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
