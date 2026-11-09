# Vectora GH Bot

O Vectora GH Bot é um serviço **self-hosted** para automatizar trabalho em
repositórios GitHub. Cada operador instala e controla sua própria instância,
conecta uma ou mais contas GitHub e configura providers, modelos, Decision
Models, storage e comportamento pela interface web ou pela CLI.

O produto é escrito em TypeScript/Node.js, sem Electron. A lógica reutilizável
de IA pertence à [Vectora Engine](https://github.com/vectora-ltda/engine), cuja
API Rust é consumida pelo binding TypeScript publicado no npm. A Company não é
o painel de configuração do Bot: ela fornece a conta e o Vectora token usado
para autenticar a instalação no Services.

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

## O que configura na própria instalação

- Providers, credenciais, modelos por tarefa e rotas de fallback.
- Decision Models e critérios de seleção/avaliação.
- Storage local, remoto ou misto, selecionado por capability da Engine.
- Regras de comportamento do Bot, eventos, políticas de review e limites.
- Segredos de integração e opções operacionais do serviço.

Credenciais de provider e storage pertencem ao operador e não são enviadas à
Company. O Services valida a identidade Vectora e intermedeia integrações que
precisam de uma URL pública compartilhada. O Bot executa o fluxo GitHub e a
Engine localmente na infraestrutura escolhida pelo operador.

## Estado do bootstrap

Este repositório está no bootstrap inicial. O CLI, a API de health e o painel
de setup são o esqueleto de desenvolvimento; login no Services, vínculo de
GitHub, execução de jobs pela Engine, persistência de configuração e adaptadores
de storage ainda não estão implementados. A interface mostra esses estados como
pendentes e não simula conexões bem-sucedidas.

Consulte [`docs/`](docs/README.md) para arquitetura, segurança, instalação e as
fronteiras com Services e Engine.

## Desenvolvimento

Requer Node.js 22+ e pnpm 10.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test
```

## Governança

O Vectora GH Bot é open source sob GNU AGPL-3.0. A organização oficial é
[vectora-ltda](https://github.com/vectora-ltda) e o fundador e principal
mantenedor é [brunosrz](https://github.com/brunosrz/).
