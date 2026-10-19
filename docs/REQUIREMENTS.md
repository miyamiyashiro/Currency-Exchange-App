# Requisitos — Currency Exchange App

Documento reconstituído em 19/10/2026 após a pasta docs deixar de constar no projeto durante a preparação do Vite.

Fonte: https://deluxe-blue-bc1.notion.site/Projeto-01-Currency-Exchange-App-3e4dfca74d8d819ebfeedbdbe661d76e

## Contexto, público e objetivo
Centralizar consultas de câmbio para viajantes, estudantes e interessados em moedas. Permitir conversão de valores, análise histórica e exportação dos dados.

## Escopo funcional
- Selecionar origem e destino entre moedas da API Frankfurter.
- Informar valor, validar entradas, converter e inverter moedas.
- Mostrar taxa e data efetiva retornadas pela API.
- Histórico nos períodos 7 e 15 e 30 dias, 3 e 6 meses, 1 e 5 e 10 anos.
- Atualizar gráfico e tabela ao mudar par ou período.
- Tabela com data, origem, destino e cotação.
- Combinar filtros por datas e cotações mínima e máxima; limpar filtros.
- Ordenar por data e cotação em ambas as direções e contar resultados.
- Exportar dados filtrados em CSV com cabeçalhos e nome identificável; bloquear exportação vazia.
- Mostrar carregamento, erro e ausência de dados.

## Restrições e qualidade
React + JavaScript, JSX, Vite, props, useState, lifting state up, useEffect, hooks customizados, fetch com async/await, CSS Modules e biblioteca de gráficos. Interface desktop e mobile com campos rotulados, navegação por teclado e mensagens claras. Respostas antigas não devem substituir a seleção atual.

## Fora do escopo
Login, cadastro, backend próprio, banco de dados, pagamentos e transações reais.

## Decisões iniciais de negócio
- Conversão = valor informado multiplicado pela taxa.
- Aceitar valor finito maior que zero; bloquear moedas iguais. Estas são decisões do projeto, ajustáveis.
- Preservar data e precisão recebidas; arredondar apenas a apresentação.
- Não inventar registros para datas sem dados.
- Inverter moedas mantendo o valor digitado.
- Aplicar filtros inclusivos e combinados aos dados consultados. Limites vazios não restringem.
- Validar intervalos invertidos antes de aplicar filtros.
- Limpar filtros ao mudar par ou período; manter o gráfico independente dos filtros da tabela.
- CSV deve preservar registros e ordenação da tabela, em UTF-8, com data YYYY-MM-DD, vírgula separadora e ponto decimal.
- Períodos terminam hoje; dias são corridos, meses e anos usam calendário.

## Critérios de aceite
1. Valor 100 com taxa de teste 2 produz 200; taxa e data são exibidas.
2. Entrada inválida apresenta orientação e impede conversão.
3. Inversão atualiza o par e sua taxa, mantendo o valor.
4. Todos os oito períodos atualizam histórico e gráfico.
5. Filtros combinados deixam somente registros dentro dos limites; contador confere.
6. Limpar filtros restaura os registros; ordenação é cronológica ou numérica.
7. CSV contém os mesmos registros e ordem da tabela; vazio não pode ser exportado.
8. Carregamento, falha com nova tentativa e ausência de dados possuem estados próprios.
9. Mudanças rápidas de seleção terminam com dados da última seleção.
10. Layout funciona em desktop e mobile, com tabela rolável no celular.

## Entregáveis
- Repositório público e commits reais de evolução.
- Aplicação funcionando, README, requisitos e mapeamento de componentes.
- Figma: wireframe, protótipo de média fidelidade, desktop, proposta mobile e estados.
- Collection do Postman com investigação de moedas, taxa, histórico, erros e datas sem cotação.

Prazo: 27/10/2026 às 23h59, horário de Brasília.

## Atualização — 19/10/2026
Conversor, histórico, gráfico, tabela, filtros, ordenação e CSV implementados.
Filtros inválidos preservam a última seleção válida e bloqueiam exportação.
Limpar filtros mantém a ordenação; mudar par ou período reinicia os filtros e a página.
O CSV contém todos os resultados filtrados, incluindo páginas não visíveis.
Revisão final de responsividade, documentação de entrega e envio ao GitHub continuam pendentes.
