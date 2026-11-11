# Integração com Vectora Engine

O GH Bot é consumidor TypeScript da Engine. O backend Python do Vectora App usa
a binding Python; os dois chegam à mesma implementação Rust. O Bot não chama
uma cópia TypeScript do runtime.

## Responsabilidade do Bot

- Converter eventos e ações GitHub em inputs aprovados do runtime.
- Passar identidade, repositório, escopo, políticas e capacidades por contexto
  confiável, sem conceder ao modelo permissões implícitas.
- Configurar provider/modelo por tarefa, Decision Models, limites, cancelamento
  e armazenamento segundo o contrato de Engine.
- Traduzir eventos/resultado do runtime para comentários, reviews e status
  GitHub com idempotência do lado do produto.

## Desenvolvimento conjunto

Durante o desenvolvimento, o GH Bot consome `../engine/bindings/typescript`
diretamente como dependência local `link:`. Não é necessário publicar nem
versionar um pacote npm para desenvolver ou testar os dois projetos juntos.

`scons install` instala as dependências do binding local e do GH Bot, sem
compilar o addon nativo. `scons build` compila a Engine Rust e sua binding
TypeScript antes da aplicação e da CLI. O diretório irmão `../engine` deve
estar disponível no checkout de desenvolvimento. A integração é validada
contra o código Engine presente nesse diretório, incluindo alterações ainda
não publicadas.

O GH Bot deve exercitar primeiro as capabilities que já têm contratos e
bindings reais. Se uma capability necessária estiver faltando, ela é
implementada na Engine e ligada ao fluxo do Bot na mesma stack de trabalho;
não se cria um runtime substituto em TypeScript nem se bloqueia o trabalho
esperando uma release. Fixtures continuam úteis para testes determinísticos de
fronteira, mas não substituem a validação de carregamento e execução do addon
Rust local.

O Bot mantém responsabilidades específicas do produto: autenticação e eventos
GitHub, autorização por instalação/repositório, configuração e apresentação
operacional. A Engine fornece o runtime reutilizável e os contratos. Os testes
do Bot devem distinguir falhas do addon Engine, configuração incompleta e
indisponibilidade de integrações externas, sem enviar credenciais ao estado de
health ou bootstrap.
