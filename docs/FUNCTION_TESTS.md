# Testes das funções JavaScript

Executar na raiz: `npm test` (PowerShell: `npm.cmd test`).
Utiliza node:test e node:assert/strict, sem dependência adicional.

Resultado em 25/10/2026: **12 testes aprovados, 0 falhas**.

| Arquivo | Casos e resultados esperados |
| --- | --- |
| tests/conversion.test.mjs | Vazio, zero, negativo, texto e infinito rejeitados; 100 × 1,1234 ≈ 112,34; overflow retorna null; data formatada sem mudar fuso |
| tests/conversion.test.mjs | HTTP 422 traduzido; par incorreto rejeitado; taxa válida aceita; moedas inválidas descartadas e lista ordenada |
| tests/history.test.mjs | 7, 15 e 30 dias incluem hoje e atravessam anos corretamente |
| tests/history.test.mjs | Meses e anos ajustam finais de mês e bissextos; oito opções disponíveis |
| tests/history.test.mjs | Ordenação, deduplicação e limites do histórico; lista vazia preservada; dias ausentes não preenchidos |
| tests/history.test.mjs | Outro par, taxa null e data impossível rejeitados |
| tests/table.test.mjs | Filtros combinados inclusivos; ordem numérica 2, 3, 10; array original preservado |
| tests/table.test.mjs | Datas impossíveis, limites invertidos, taxa negativa e texto rejeitados; zero e limites vazios aceitos |
| tests/table.test.mjs | CSV com cabeçalho, BOM, precisão, ordem e 30 registros incluindo outra página; nome identificável; vazio rejeitado |
| tests/table.test.mjs | Filtro sem correspondências retorna lista vazia |

Algumas linhas agrupam testes. A contagem oficial vem do executor.
Os testes de fetchResource usam fetch simulado e não dependem da API.
Não equivalem a testes end-to-end dos hooks.

Lint e build passaram em 25/10/2026. Build tem aviso não impeditivo de JavaScript
acima de 500 kB (~589 kB minificado).
Verificações no navegador: [VERIFICATION.md](VERIFICATION.md).
