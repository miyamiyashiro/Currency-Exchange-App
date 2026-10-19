# Componentes e fluxo de dados

| Componente | Arquivo | Estilo | Responsabilidade / props |
| --- | --- | --- | --- |
| App | src/App.jsx | src/App.module.css | Guarda o par de moedas em useState e passa base, quote e onPairChange ao conversor. |
| Panel | src/components/Panel.jsx | src/App.module.css | Cartão reutilizável; recebe number, title, subtitle e children. |
| Converter | src/components/Converter.jsx | src/components/Converter.module.css | Guarda o valor digitado; consulta moedas e taxa; valida, converte e inverte o par por callback. |
| History | src/components/History.jsx | src/components/History.module.css | Recebe base e quote; guarda período e paginação, consulta histórico e apresenta gráfico Recharts e tabela. |
| Tabela histórica | Dentro de History | src/components/History.module.css | Usa a mesma resposta do gráfico, ordenada da data mais recente, com 25 linhas por página. Extração futura ao implementar filtros e CSV. |

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

## Etapa de histórico e gráfico
Os oito períodos são calculados em src/utils/history.js. Dias incluem hoje; meses e anos
respeitam o calendário e ajustam o dia para o final do mês quando necessário.
A consulta /rates usa from, to, base e quotes. A resposta é validada, deduplicada por data,
limitada ao intervalo e ordenada cronologicamente. Nenhum dia ausente é preenchido.
History usa o mesmo hook de consultas canceláveis e oferece carregamento, erro com nova
tentativa e ausência de dados. Gráfico e tabela usam a mesma lista.
Ao mudar o par ou período, a paginação retorna à primeira página.
A data final é capturada na abertura da tela; recarregue a página para atualizar após a virada do dia.

Verificação: oito testes automatizados, ESLint e build aprovados. Navegador conferido
com 7, 30 dias e 10 anos, inversão de moedas e paginação. Dez anos retornaram 3.653 registros
no par testado. O build informa bundle acima de 500 kB por incluir a biblioteca de gráficos;
a aplicação compila normalmente. Otimização de carregamento fica para o acabamento.
