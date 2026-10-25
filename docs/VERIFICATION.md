# Verificação e entrega

## Revisão final — 25/10/2026

Enunciado completo, incluindo seções 9–12, conferido no Notion.
Foram acrescentados FIGMA.md, API_TESTS.md, FUNCTION_TESTS.md, AI_USAGE.md e
imagens reais da aplicação e dos protótipos, que faltavam na documentação.

| Verificação | Evidência / resultado |
| --- | --- |
| Testes de funções | 12 aprovados, 0 falhas; detalhes em FUNCTION_TESTS.md |
| ESLint | Sem erros |
| Build | Concluído; aviso não impeditivo de bundle ~589 kB |
| Instalação limpa | Cópia do commit e3fcfb5 sem node_modules; npm ci instalou 182 pacotes e build passou |
| Conversão | Dados reais EUR/USD, valor 100; taxa e data da resposta exibidas |
| Oito períodos | 7, 15, 30 dias, 3, 6 meses, 1, 5 e 10 anos carregados com gráfico e tabela |
| Contagem observada EUR/USD | 7, 15, 30, 93, 184, 366, 1827 e 3653 registros, respectivamente |
| Troca rápida | Destino BRL → USD e período 7 dias: resultado final EUR/USD e 7 registros |
| Filtros combinados | 22–24/10/2026 e taxa 1,122–1,124: duas linhas, 22 e 23/10 |
| Ausência por filtro | Mínimo 99: mensagem sem registros e CSV desabilitado |
| Mobile | Nova captura em 390px; largura do documento igual à viewport, sem overflow da página |
| Figma | Link abriu sem login; desktop, wireframe cinza, mobile e estados visíveis |
| GitHub | Público; 7 commits de desenvolvimento visíveis antes desta revisão |

A instalação limpa usou npm ci com acesso ao registro; a tentativa offline inicial
não tinha todos os pacotes em cache e não foi considerada aprovação.

## Verificações anteriores preservadas

- Inversão preservando valor, zero inválido, paginação e ordenação.
- CSV baixado e lido: cabeçalho, quantidade, precisão e ordem conferidos;
  teste real com quatro registros filtrados.
- Layout em 320px e 390px; somente a tabela rola horizontalmente.
- Região da tabela recebeu foco visível e respondeu à seta direita.
- Erro HTTP 422 observado no Postman e tradução do serviço coberta por teste.

## Limites da revisão

Não foram concluídos teste manual de desconexão/reconexão com retry, percurso
integral por teclado ou abertura do CSV em Excel/LibreOffice. Os mecanismos de
erro/retry foram revisados no código; isso não equivale a um teste end-to-end.
A resposta histórica vazia foi verificada por HTTP em 25/10 (ver API_TESTS.md),
e sua normalização é coberta por teste. Não houve simulação da tela vazia da API
no navegador; o estado vazio provocado pelos filtros foi verificado.

## Entrega

- [x] Código, collection, requisitos e documentos obrigatórios presentes.
- [x] Evidências da aplicação desktop/mobile e Figma no repositório.
- [x] GitHub público e histórico incremental anterior confirmado.
- [x] Figma acessível sem login.
- [ ] Enviar ao GitHub o commit desta revisão final.
- [ ] Aluna revisar AI_USAGE.md e preparar explicação do funcionamento.
- [ ] Conferir/mover os cartões do próprio board conforme evolução.
- [ ] Entregar GitHub, Figma e collection até 27/10/2026, 23h59 BRT.

O enunciado exige aplicação executável; não exige explicitamente hospedagem.
Não há site hospedado configurado. O README documenta a execução local.
