# Vectora GH Bot

![GH Bot](assets/branding/gh-bot-banner.png)

O Vectora GH Bot é um produto independente para automatizar trabalho em
repositórios GitHub. Ele consome a Vectora Engine e pode ser usado de duas
formas: hospedado e operado pela Vectora Ltda como benefício de assinatura, ou
self-hosted pelo próprio usuário em desktop, VPS ou cluster. No modo self-hosted, o
tráfego de review vai diretamente do GitHub para o endpoint do usuário; o
Services não fica no caminho de cada execução.

O produto é um app full-stack TypeScript com TanStack Start, executado pelo
Nitro como um único processo Node.js ou Bun, sem Electron. A interface usa
React, Vite, TanStack Router e Query, Zustand e Motion. Rotas de servidor e
server functions do próprio TanStack atendem a UI e integram Services e Engine;
não há servidor HTTP separado. A lógica reutilizável
de IA pertence à [Vectora Engine](https://github.com/vectora-company/engine), cuja
API Rust é consumida pelo binding TypeScript. Durante o desenvolvimento, o GH
Bot aponta diretamente para o checkout local da Engine; publicar uma versão npm
não é necessário para avançar ou testar a integração. A Company não é
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
  diretamente o endpoint público, protegido por TLS e opcionalmente exposto
  por um reverse proxy operado pelo usuário, sem executar o Bot no Services. O login no Services é usado para identidade e recursos
  que realmente dependam do Services, não para encaminhar cada evento.

No modo self-hosted, o custo de VPS, operação e disponibilidade é do usuário.
O modo hospedado troca essa responsabilidade pela assinatura. Os limites exatos
de cada plano são definidos pelo produto; o Services valida identidade e
entitlement, sem executar o bot.

## Instalação

```bash
npm install --global @vectora/gh-bot
gh-bot
```

O primeiro comando abre o CLI interativo. Nele, configure o bot, faça login,
abra o dashboard React ou deixe o serviço rodando em segundo plano. Também é
possível usar os comandos diretamente:

```bash
gh-bot config                 # editar todas as áreas de configuração
gh-bot auth login             # guardar o Vectora token localmente
gh-bot start                  # iniciar com o dashboard
gh-bot background             # iniciar sem servir o dashboard
gh-bot status                 # consultar execução em segundo plano
gh-bot stop                   # parar execução em segundo plano
gh-bot config export bot.json # exportar config sem login
gh-bot config import bot.json # importar sem substituir login local
gh-bot doctor
```

`gh-bot` e `vectora-gh-bot` são comandos globais publicados pelo pacote npm.
Também funciona com Bun (`bun add --global @vectora/gh-bot`). TanStack Start
serve dashboard e rotas HTTP no mesmo runtime; no modo background as páginas e
assets do dashboard retornam 404, enquanto health e APIs continuam disponíveis.

### Docker

```bash
docker run --rm -p 3210:3210 \
  -e VECTORA_GH_BOT_HOST=0.0.0.0 \
  -v vectora-gh-bot-data:/var/lib/vectora-gh-bot \
  ghcr.io/vectora-company/gh-bot:latest
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

Este repositório está no bootstrap inicial. O CLI interativo já edita e persiste
as seções de configuração, executa o servidor em primeiro ou segundo plano e
importa/exporta configuração sem autenticação. O comando `auth login` guarda o
Vectora token separado com permissões locais restritas. A validação remota do
token ainda depende do contrato de autenticação publicado pelo Services; vínculo
de GitHub, execução de jobs pela Engine e adapters de storage continuam no
roadmap e não são apresentados como conexões já funcionais.

Consulte [`docs/`](docs/README.md) para arquitetura, segurança, instalação e as
fronteiras com Services e Engine.

## Desenvolvimento conjunto com a Engine

Mantenha os repositórios `gh-bot` e `engine` como diretórios irmãos. O pacote
`@vectora/engine` no `package.json` é uma dependência `link:` para
`../engine/bindings/typescript`; mudanças locais de Rust e do binding ficam
imediatamente disponíveis ao GH Bot depois de compilar o addon.

```bash
scons install       # instala dependências dos dois checkouts
scons build         # compila o addon Rust local, o app e a CLI
pnpm doctor         # inclui o diagnóstico do runtime Rust local
pnpm exec tsx app/src/cli.ts engine status
```

Para validar uma chamada real de modelo pelo binding Rust, configure as
variáveis abaixo e rode `gh-bot engine chat "Responda apenas: ok"`:

```bash
VECTORA_GH_BOT_ENGINE_BASE_URL=https://seu-provider/v1
VECTORA_GH_BOT_ENGINE_MODEL=seu-modelo
VECTORA_GH_BOT_ENGINE_API_KEY=... # opcional para endpoints sem chave
```

O fluxo experimental do Bot serve para exercitar a Engine em conjunto. Se uma
capacidade necessária ainda não existir no binding, implemente-a na Engine e
conecte-a ao Bot na mesma stack; não substitua o runtime por TypeScript nem
espere uma publicação npm.

## Desenvolvimento

Requer Python 3.10+, SCons, Node.js 22+, pnpm 11.5 (compartilhado com o
binding TypeScript local da Engine) e pre-commit.

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
[vectora-company](https://github.com/vectora-company) e o fundador e principal
mantenedor é [brunosrz](https://github.com/brunosrz/).
