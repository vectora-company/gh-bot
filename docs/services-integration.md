# Integração com Vectora Services

## Papel no produto

Services é principalmente a camada de login/identidade Vectora: valida o token
emitido/disponibilizado pela Company e autentica a conta no GH Bot. A identidade
Vectora está disponível em conta Free. Login não equivale automaticamente a
entitlement para o GH Bot hospedado: a assinatura determina esse acesso.

O GH Bot não usa Company como frontend e não envia provider keys, credenciais de
storage, políticas locais ou conteúdo de review ao Services. Services não fica
no caminho normal de chamadas GitHub, eventos, providers ou storage. Para uma
instância self-hosted, o Services pode guardar a configuração de conexão
necessária (endpoint e credenciais de acesso) e disponibilizar o endereço
público. A chamada do GitHub segue pela borda/roteamento configurado até a
instância do usuário; o Services não processa nem encaminha o payload como
serviço de aplicação. O plano hospedado é operado pela Vectora Ltda; Services
pode validar conta e entitlement, sem transformar a API Services em proxy do
runtime.

## Contratos necessários

O bootstrap necessita de contratos versionados para:

1. validar o Vectora token e trocar por sessão curta, revogável e escopada para
   a identidade do GH Bot;
2. consultar a identidade e entitlement para a modalidade hospedada do produto;
3. oferecer login/consentimento de GitHub somente se isso fizer parte de um
   contrato explícito; as chamadas operacionais continuam entre o Bot e GitHub;
4. guardar, se necessário, endpoint e credenciais da instalação self-hosted para
   onboarding/roteamento, sem terminar ou encaminhar payloads de execução pelo
   serviço de aplicação do Services;
5. reportar versão, estado e métricas minimizadas sem prompts, diffs, chaves,
   tokens ou conteúdo privado.

Estes contratos não são presumidos como existentes. O GH Bot deve manter
interfaces e fixtures locais; produção não pode usar endpoints ad hoc ou
descobertos por adivinhação.

## Limite de entitlements

Conta Free pode autenticar e usar a modalidade self-hosted com seus próprios
recursos. O GH Bot hospedado pela Vectora é o modo pago. O entitlement pode
controlar acesso ao runtime hospedado, capacidade e limites da assinatura; não
deve ser inferido localmente nem exigir tráfego de execução pelo Services.

## Migração do fluxo anterior

As rotas antigas `gha-bot` e o fluxo anterior de `vectora-review-action`
representavam jobs associados ao Vectora App/Company. O novo produto tem
runtime próprio: no self-hosted a Action chama o endpoint do usuário; no modo
hospedado chama o endpoint operado pela Vectora. A API Services pode cuidar de
login e entitlement, mas não deve ser proxy desses requests. Compatibilidade
com rotas antigas exige decisão explícita e não deve ser presumida.
