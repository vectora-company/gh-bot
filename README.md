# Vectora GH Bot

O Vectora GH Bot é um produto independente para automatizar trabalho em
repositórios GitHub. Ele consome a Vectora Engine e pode ser usado de duas
formas: hospedado e operado pela Vectora Ltda como benefício de assinatura, ou
self-hosted pelo próprio usuário em sua VPS/cluster. No modo self-hosted, o
tráfego de review vai diretamente do GitHub para o endpoint do usuário; o
Services não fica no caminho de cada execução.

O produto é escrito em TypeScript/Node.js, sem Electron. A lógica reutilizável
de IA pertence à [Vectora Engine](https://github.com/vectora-ltda/engine), cuja
API Rust é consumida pelo binding TypeScript publicado no npm. A Company não é
o painel de configuração do Bot: ela fornece conta e acesso ao Vectora token
usado para login no Services. O dashboard pode apresentar a opção hospedada e
o status da assinatura, mas a configuração operacional do Bot pertence ao
próprio produto GH Bot.

## Formas de uso

- **Hospedado pela Vectora:** disponível conforme assinatura. A Vectora Ltda
  opera o endpoint, atualizações e disponibilidade; o usuário configura o bot
  e conecta seus repositórios pelo fluxo suportado.
- **Self-hosted:** gratuito para instalar e executar na sua infraestrutura,
  usando seus próprios recursos e credenciais. Configure a URL pública e um
  segredo de webhook/token no GitHub Actions `review-action`; a Action chama
  o endpoint público, que pode rotear pela borda Cloudflare ao seu origin sem
  executar o Bot no Services. O login no Services é usado para identidade e recursos
  que realmente dependam do Services, não para encaminhar cada evento.

No modo self-hosted, o custo de VPS, operação e disponibilidade é do usuário.
O modo hospedado troca essa responsabilidade pela assinatura. Os limites exatos
de cada plano são definidos pelo produto; o Services valida identidade e
entitlement, sem executar o bot.

## Instalação

```bash
npm install --global @vectora/gh-bot
vectora-gh-bot doctor
vectora-gh-bot start
```

Depois, abra `http://127.0.0.1:3210` para configurar a instalação. O CLI também
será a interface para setup, conexão com Services, contas GitHub, diagnóstico e
exportação/importação segura da configuração.

### Docker

```bash
docker run --rm -p 3210:3210 \
  -e VECTORA_GH_BOT_HOST=0.0.0.0 \
  -v vectora-gh-bot-data:/var/lib/vectora-gh-bot \
  ghcr.io/vectora-ltda/gh-bot:latest
```

Para operação persistente, use o chart em [`deploy/helm/gh-bot`](deploy/helm/gh-bot/)
ou adapte-o ao seu cluster Kubernetes. SQLite é o default local do bootstrap;
instâncias com múltiplas réplicas devem escolher storage remoto compatível e
configurar a estratégia de locking antes de escalar.

## O que configura no GH Bot

- Providers, credenciais, modelos por tarefa e rotas de fallback.
- Decision Models e critérios de seleção/avaliação.
- Storage local, remoto ou misto, selecionado por capability da Engine.
- Regras de comportamento do Bot, eventos, políticas de review e limites.
- Segredos de integração e opções operacionais do serviço.

No self-hosted, credenciais de provider, storage e GitHub ficam na instância do
operador e não são enviadas à Company nem ao Services. O Bot recebe eventos
diretamente do GitHub por endpoint público ou pela `review-action` configurada
com endpoint e segredo. No modo hospedado, a Vectora opera o runtime e aplica
os controles de conta/assinatura necessários. O Services autentica a conta e
fornece apenas capacidades explicitamente contratadas; chamadas de modelo,
execução da Engine e acesso ao storage não devem ser roteados por ele por
padrão.

## Estado do bootstrap

Este repositório está no bootstrap inicial. O CLI, a API de health e o painel
de setup são o esqueleto de desenvolvimento; login no Services, vínculo de
GitHub, execução de jobs pela Engine, persistência de configuração e adaptadores
de storage ainda não estão implementados. A interface mostra esses estados como
pendentes e não simula conexões bem-sucedidas.

Consulte [`docs/`](docs/README.md) para arquitetura, segurança, instalação e as
fronteiras com Services e Engine.

## Desenvolvimento

Requer Python 3.10+, SCons, Node.js 22+, pnpm 10 e pre-commit.

```bash
scons install
pnpm dev
scons lint
scons tests
```

`scons frontend` compila somente o painel web e não instala dependências.
`scons ci` executa instalação, lint, build e testes do tooling.

## Governança

O Vectora GH Bot é open source sob GNU AGPL-3.0. A organização oficial é
[vectora-ltda](https://github.com/vectora-ltda) e o fundador e principal
mantenedor é [brunosrz](https://github.com/brunosrz/).
