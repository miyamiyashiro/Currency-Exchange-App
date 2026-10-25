# Investigação da API no Postman

API: Frankfurter v2. Base: https://api.frankfurter.dev/v2.
GET sem corpo e sem chave de API.

[Collection JSON v2.1](../postman/Currency%20Exchange%20App.postman_collection.json).
Para reproduzir: importar no Postman, selecionar a requisição e clicar em Send.

## Casos executados

Resultados observados nos screenshots enviados pela aluna durante o desenvolvimento.
Não são respostas inventadas nem garantia de resultados futuros.

| Caminho | Objetivo | Resultado observado |
| --- | --- | --- |
| /currencies | Lista de moedas | 200; array com iso_code, name e metadados |
| /rate/EUR/USD | Taxa atual | 200; date, base, quote e rate |
| /rates?from=2024-05-01&to=2024-05-31&base=EUR&quotes=USD | Histórico e parâmetros | 200; registros por data |
| /rate/INVALID/USD | Moeda inválida | 422; mensagem invalid currency: INVALID |
| /rates?from=2024-05-04&to=2024-05-05&base=EUR&quotes=USD | Fim de semana | 200; registros para as duas datas |

## Interpretação

- base é a origem; quote é o destino da resposta. A consulta histórica usa quotes.
- from e to usam YYYY-MM-DD. A data efetiva é a retornada pela API.
- A taxa corresponde a uma unidade da origem: conversão = valor × taxa.
- O fim de semana retornou registros; não se deve supor que todo fim de semana
  ficará vazio. Este caso não comprovou ausência de dados.
- A aplicação não preenche dias ausentes. O caso de lista vazia está coberto por
  testes de funções; uma resposta vazia foi verificada por HTTP direto nesta revisão, conforme seção abaixo.
- O erro INVALID é intencional e deve permanecer na collection.

## Evidências e limites

As duas primeiras consultas têm asserção de status 200; as demais foram conferidas
manualmente. A collection não contém exemplos de respostas salvos. Não foi
registrada execução de Collection Runner. Testes do serviço com respostas
controladas são descritos em [FUNCTION_TESTS.md](FUNCTION_TESTS.md).

## Complemento da revisão — 25/10/2026

GET /rates?from=2024-05-01&to=2024-05-02&base=EUR&quotes=XCG retornou
HTTP 200 e corpo []. A verificação foi feita por HTTP direto (Invoke-WebRequest),
sem Postman. A sexta requisição foi adicionada à collection com asserções de
status e lista vazia para permitir reprodução; não se afirma que essas asserções
tenham sido executadas no Postman. Isso complementa o caso de fim de semana,
que retornou registros.
