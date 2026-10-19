# Currency Exchange App

Projeto acadêmico de conversão e análise de moedas com React, JavaScript e Vite.

## Executar
No terminal da pasta do projeto:
npm install
npm run dev

No PowerShell, utilize npm.cmd se a execução de npm.ps1 estiver bloqueada.

## Verificar
npm run build
npm run lint

## Etapa atual
Interface estática inspirada no Figma, com CSS Modules e layout adaptado ao celular.
O conversor consulta moedas e taxas reais, valida valores e permite inverter o par. Histórico e tabela consultam o mesmo par e período, com gráfico Recharts e paginação de 25 registros.
Filtros, ordenação interativa e CSV serão implementados na próxima etapa. Testes: node --test tests/*.test.mjs

## Documentação
- docs/REQUIREMENTS.md: requisitos e critérios de aceite.
- docs/COMPONENTS.md: componentes da etapa atual.
- postman/: collection exportada pela autora.

## Protótipo
https://www.figma.com/design/r8NQLtIt4OJN4LrsHzV0Vz/
