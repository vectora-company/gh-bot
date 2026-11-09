# Arquitetura

## Visão de componentes

```mermaid
flowchart LR
  Operator[Operador] --> UI[Web UI do GH Bot]
  Operator --> CLI[CLI npm]
  UI --> API[GH Bot Node API]
  CLI --> API
  API --> Services[Vectora Services<br/>login e capacidades contratadas]
  API --> Engine[Vectora Engine<br/>Rust via binding npm]
  Engine --> Providers[Providers e Decision Models]
  Engine --> Stores[SQLite / LanceDB / NATS<br/>PostgreSQL / Qdrant / Redis]
  GitHub[GitHub] -->|review-action: endpoint + token| Edge[DNS / roteamento de borda opcional]
  Edge -->|origin hosted ou self-hosted| API
  API --> GitHub
```

## Limites

- A UI chama somente a API local. Tokens e credenciais não vão para o bundle.
- API Node controla configuração, setup, ciclo de vida de jobs e adaptadores
  GitHub; a Engine executa o runtime genérico.
- O binding TypeScript chama o núcleo Rust. Contrato, eventos, erros e
  cancelamento vêm da Engine.
- Services autentica a conta Vectora e oferece capacidades compartilhadas
  explicitamente contratadas. Não encaminha cada evento, chamada GitHub,
  chamada de modelo ou operação de storage.
- GitHub App/`review-action` são as fronteiras de instalação, autorização e
  chamadas. Self-hosted recebe a chamada direto na sua URL; hosted usa o
  endpoint operado pela Vectora. Não aceitar requests não autenticados.

## Caminho de um evento

1. `vectora-review-action` no workflow do repositório chama o endpoint público
   configurado, autenticando com token/segredo. A borda Cloudflare pode rotear
   o request até o origin self-hosted; Services não processa esse payload.
2. GH Bot valida a autenticação, instalação, repositório, evento, entrega e
   política local; verifica idempotency key antes de agendar.
3. GH Bot constrói um contexto tipado e limitado e pede uma execução à Engine.
4. Engine usa provider/modelo/Decision Models configurados e os adapters de
   storage necessários.
5. GH Bot valida a saída, cria review/comentário pelo escopo da instalação,
   registra estado e correlaciona IDs de GitHub, job e run.

## Configuração e estado

O modo hospedado é operado pela Vectora Ltda e controlado por assinatura. No
modo self-hosted, o usuário opera o processo, endpoint e storage em sua
infraestrutura. Os dois modos consomem a mesma Engine e têm a mesma UI/CLI; só
mudam hospedagem, responsabilidade operacional e entitlement. O fluxo de review
não passa pelo backend de aplicação do Services: `review-action` chama o
endpoint público, que pode usar roteamento da borda até o origin.

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
