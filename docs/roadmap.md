# Roadmap do bootstrap

Este é um bootstrap e um ambiente controlado para validar o GH Bot e a Engine
em conjunto. A ordem é vertical e orientada a experimentos: cada fatia deve
exercitar um caminho real de ponta a ponta e registrar falhas reproduzíveis.

1. **Loop local Engine–GH Bot:** manter os checkouts irmãos; instalar e compilar
   a Engine Rust e seu binding TypeScript diretamente do checkout. Não exigir
   pacote npm publicado ou versões coordenadas durante desenvolvimento.
2. **Experimentos de runtime:** conectar configurações locais de provider e
   modelo, exercitar streaming, cancelamento, erros, timeout, retry e saída
   estruturada pelo binding real. Corrigir contratos e testes nos dois repos
   conforme os resultados.
3. **Primeiro fluxo GitHub experimental:** receber eventos de uma conta e
   repositórios isolados, validar autenticação/escopo, deduplicação, execução
   pela Engine e publicação controlada de resultado. Falhas nesses projetos
   experimentais são parte do ciclo de validação.
4. **Persistência e recuperação:** introduzir ledger, checkpoint, idempotência,
   replay e storage escolhido por capability; testar reinício, concorrência e
   falhas parciais junto com execuções reais do Bot.
5. **Configuração operacional:** completar CLI e dashboard para provider,
   modelo, comportamento e storage; manter diagnósticos sem expor credenciais.
6. **Serviços e modos de operação:** integrar login/identidade e entitlement
   quando o fluxo de execução local estiver demonstrado; então exercitar o modo
   self-hosted e o hosted sem transformar Services em proxy universal.
7. **Distribuição:** só depois de os fluxos locais e experimentais estarem
   utilizáveis, preparar npm, Docker/Kubernetes, upgrades e operação hosted.

As etapas 1–5 podem avançar simultaneamente entre os repositórios. Uma
capacidade ausente no binding é trabalho de desenvolvimento, não bloqueio para
o GH Bot: implementar o contrato na Engine Rust, expô-lo pelo binding e validar
imediatamente pelo consumidor GH Bot. Publicar pacotes fica para distribuição,
nunca é pré-requisito para esse ciclo.

Login por Services, self-hosted com recursos próprios e plano hosted pago
operado pela Vectora são princípios de produto. O modelo exato de
contas/credenciais GitHub continua configurável pelo GH Bot; Services não deve
ser tratado como broker universal.
