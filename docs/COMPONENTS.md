# Componentes e fluxo de dados

| Componente | Arquivo | Estilo | Responsabilidade / props |
| --- | --- | --- | --- |
| App | src/App.jsx | src/App.module.css | Guarda o par de moedas em useState e passa base, quote e onPairChange ao conversor. |
| Panel | src/components/Panel.jsx | src/App.module.css | Cartão reutilizável; recebe number, title, subtitle e children. |
| Converter | src/components/Converter.jsx | src/components/Converter.module.css | Guarda o valor digitado; consulta moedas e taxa; valida, converte e inverte o par por callback. |
| History | src/App.jsx | src/App.module.css | Prévia estática; integração pendente. |
| RatesTable | src/App.jsx | src/App.module.css | Dados ilustrativos; filtros e CSV pendentes. |

## Hook e serviço
useFrankfurter usa useEffect para consultar a API quando o caminho ou a tentativa muda.
Expõe data, loading, error e retry. Cancela requisições na limpeza do efeito e ignora respostas antigas.
O timeout é de 15 segundos. Resultados só aparecem para o caminho e tentativa correspondentes.
fetchResource usa fetch com async/await, verifica HTTP e valida os dados essenciais.

## Conversão
A aplicação multiplica o valor pela taxa, sem arredondar antes da apresentação.
Intl.NumberFormat formata em pt-BR respeitando a moeda; a data recebida é apresentada sem conversão de fuso.
Valores vazios, não finitos ou menores ou iguais a zero e moedas iguais são bloqueados.
O par fica em App (lifting state up), preparado para ser compartilhado com o histórico na próxima etapa.

## Verificação desta etapa
Build e ESLint aprovados.
Quatro testes Node cobrem cálculo, entradas inválidas, overflow, erro HTTP, resposta de par incorreto e lista de moedas.
No navegador, consulta real, validação de zero e inversão preservando o valor foram conferidas.
