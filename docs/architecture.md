# Arquitetura

## Visão de componentes

```mermaid
flowchart LR
  Operator[Operador] --> UI[Web UI do GH Bot]
  Operator --> CLI[CLI npm]
  UI --> App[TanStack Start · Nitro · Node.js / Bun]
  CLI --> App
  App --> Services[Vectora Services<br/>login e capacidades contratadas]
  App --> Engine[Vectora Engine<br/>Rust via binding npm]
  Engine --> Providers[Providers e Decision Models]
  Engine --> Stores[SQLite / LanceDB / NATS<br/>PostgreSQL / Qdrant / Redis]
  GitHub[GitHub] -->|review-action: HTTPS endpoint + token| Proxy[Reverse proxy opcional do operador]
  Proxy -->|origin hosted ou self-hosted| API
  API --> GitHub
```

## Limites

- O produto é um único app e pacote npm. `app/src/routes/` contém páginas e
  endpoints TanStack Start; `app/src/` contém componentes, middleware e CLI.
  Nitro hospeda tudo no mesmo processo, sem servidor HTTP separado.

- Server functions e server routes do TanStack Start controlam configuração,
  setup, ciclo de vida de jobs e adaptadores GitHub; a Engine executa o runtime
  genérico. Tokens e credenciais não vão para o bundle do navegador.
- O binding TypeScript chama o núcleo Rust. Contrato, eventos, erros e
  cancelamento vêm da Engine.
- Services autentica a conta Vectora e oferece capacidades compartilhadas
  explicitamente contratadas. Não encaminha cada evento, chamada GitHub,
  chamada de modelo ou operação de storage.
- GitHub App/`review-action` são as fronteiras de instalação, autorização e
  chamadas. Self-hosted recebe a chamada direto na sua URL; hosted usa o
  endpoint operado pela Vectora. Não aceitar requests não autenticados.

## Caminho de um evento

1. `vectora-review-action` no workflow do repositório chama diretamente o
   endpoint público configurado, autenticando com token/segredo. Um reverse
   proxy configurado pelo operador pode terminar TLS e encaminhar o request;
   Services não processa esse payload.
2. GH Bot valida a autenticação, instalação, repositório, evento, entrega e
   política local; verifica idempotency key antes de agendar.
3. GH Bot constrói um contexto tipado e limitado e pede uma execução à Engine.
4. Engine usa provider/modelo/Decision Models configurados e os adapters de
   storage necessários.
5. GH Bot valida a saída, cria review/comentário pelo escopo da instalação,
   registra estado e correlaciona IDs de GitHub, job e run.

## API HTTP

- Server routes file-based atendem endpoints como `/api/v1/bootstrap` e
  `/healthz`; server functions servem chamadas internas tipadas entre UI e
  servidor. Valide entrada e autorização dentro de cada handler.
- Middleware global TanStack adiciona request ID, cabeçalhos seguros e logs
  estruturados com duração e status; middleware CSRF protege server functions.
- Nitro entrega o app para Node.js ou Bun. Vite inicia a aplicação integrada
  no desenvolvimento; um reverse proxy pode terminar TLS em VPS.

## Painel web

- React e Vite compõem o painel sem acoplamento ao processo desktop do Vectora.
- TanStack Router controla rotas tipadas e navegação; TanStack Query mantém o
  estado remoto e políticas de cache/refetch.
- Zustand fica reservado ao estado transitório de interface. Estado de API não
  é duplicado no store global.
- Motion anima transições locais; `MotionConfig` respeita a preferência de
  movimento reduzido do sistema operacional.

## Configuração e estado

O modo hospedado é operado pela Vectora Ltda e controlado por assinatura. No
modo self-hosted, o usuário opera o processo, endpoint e storage em sua
infraestrutura. Os dois modos consomem a mesma Engine e têm a mesma UI/CLI; só
mudam hospedagem, responsabilidade operacional e entitlement. O fluxo de review
não passa pelo backend de aplicação do Services: `review-action` chama o
endpoint público, que pode ser exposto por um reverse proxy até o origin.

Configuração é versionada e guardada no runtime correspondente. Segredos ficam separados da
configuração declarativa, cifrados com uma chave de instalação ou delegados ao
secret manager do runtime. O diretório de dados deve permitir backup/restore e
proteger permissões no POSIX; Kubernetes deve permitir PVC/CSI ou storage
externo. SQLite é o modo local inicial. Replicas concorrentes precisam de
coordenação distribuída explícita.

## Availability

Health, readiness e estado de integração são separados. `healthz` informa se o
processo responde; readiness verifica setup e dependências necessárias à
capacidade ativada. Uma falha de provider não pode aparecer como Services
offline, e storage indisponível não pode aparecer como execução concluída.
