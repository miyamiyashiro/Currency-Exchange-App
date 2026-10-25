# Componentes e fluxo de dados

| Componente | Arquivo JSX | CSS Module | Props | Estados e responsabilidade |
| --- | --- | --- | --- | --- |
| App | src/App.jsx | src/App.module.css | Nenhuma | pair: origem/destino compartilhados por Converter e History |
| Panel | src/components/Panel.jsx | src/App.module.css | number, title, subtitle, children | Sem estado; seção reutilizável |
| Converter | src/components/Converter.jsx | src/components/Converter.module.css | base, quote, onPairChange | amount; consulta moedas/taxa pelo hook; valida valor, calcula resultado e inverte par por callback |
| History | src/components/History.jsx | src/components/History.module.css | base, quote | period e today; consulta histórico, mostra estados e gráfico Recharts; fornece rows para RatesTable |
| RatesTable | src/components/RatesTable.jsx | src/components/RatesTable.module.css | rows, base, quote, unavailable | draft, applied, sort, page, exportMessage; filtros, ordenação, paginação e CSV |

## Relações

App → Converter → onPairChange → App → History → RatesTable.
Converter e History reutilizam useFrankfurter. Todos os painéis usam Panel.
O par compartilhado em App exemplifica lifting state up: uma mudança no conversor
atualiza também o histórico, sem duplicar esse estado.

## Hook e serviço

src/hooks/useFrankfurter.js usa useEffect, AbortController e timeout de 15 segundos.
Guarda response e attempt; expõe data, loading, error e retry. A limpeza cancela
a consulta e respostas antigas são ignoradas. A resposta precisa corresponder
ao caminho e à tentativa atuais.

src/services/frankfurter.js centraliza fetch com async/await, verifica HTTP e
valida o formato essencial. Sem chave, backend próprio ou persistência.

## Funções e regras

- conversion.js: valida valor positivo finito, multiplica pela taxa e formata
  moeda/data. Overflow é tratado; moedas iguais são bloqueadas na interface.
- history.js: oito períodos, com ajuste de fim de mês/bissexto; valida, deduplica,
  limita ao intervalo e ordena os registros. Não inventa dias sem dados.
- table.js: filtros inclusivos combinados, ordenação numérica e CSV com BOM UTF-8,
  CRLF, cabeçalho, datas ISO e taxa sem arredondar.

History captura a data final ao abrir a tela; recarregue após a virada do dia.
RatesTable recebe key baseada em par/período: uma mudança reinicia filtros e página.
Filtros inválidos preservam os últimos válidos e bloqueiam exportação.
Limpar filtros preserva a ordenação. O gráfico mantém o período completo.
CSV usa toda a lista filtrada e ordenada antes da paginação de 25 linhas.
