# Integração com Vectora Services

## Papel no produto

Services autentica a conta Vectora pelo token emitido no dashboard da Company e
intermedeia a conexão de uma ou mais contas/instalações GitHub. A identidade
Vectora está disponível em conta Free. Login não equivale automaticamente a
entitlement para serviços hosted: a decisão de acesso é feita pelo Services.

O GH Bot não usa Company como frontend e não entrega provider keys, storage
credentials, políticas locais ou o runtime da Engine para o Services.

## Contratos necessários

O bootstrap necessita de contratos versionados para:

1. validar o Vectora token e trocar por sessão curta, revogável e escopada para
   uma instalação GH Bot;
2. iniciar/consultar conexão GitHub e listar contas e GitHub App installations;
3. renovar e revogar associações, com identidade e repositórios permitidos;
4. solicitar credenciais de instalação de curta duração ou usar uma API/relay
   Services para as operações GitHub estritamente necessárias;
5. entregar eventos ao processo self-hosted por webhook autenticado ou relay
   outbound, com cursor, replay, idempotência e limites se houver relay;
6. reportar versão, estado e métricas minimizadas sem prompts, diffs, chaves,
   tokens ou conteúdo privado.

Estes contratos não são presumidos como existentes. O GH Bot deve manter
interfaces e fixtures locais; produção não pode usar endpoints ad hoc ou
descobertos por adivinhação.

## Limite de entitlements

Conta Free pode autenticar e usar execução self-hosted/local com seus próprios
providers e recursos. Um entitlement só pode limitar uma capacidade que o
Services realmente opera ou subsidia (por exemplo, relay hospedado ou execução
hosted), e a decisão deve vir do contrato atual do Services. Uma flag local não
concede acesso remoto.

## Migração do fluxo anterior

As rotas antigas `gha-bot` e a `vectora-review-action` pertencem ao fluxo
anterior de jobs hosted ou despachados para o processo Vectora desktop. A nova
aplicação self-hosted tem outro cliente e ciclo de vida. Migração ou convivência
de tokens/rotas deve ser tratada em contrato e plano próprios; não acoplar o
novo CLI a endpoints antigos para parecer funcional.
