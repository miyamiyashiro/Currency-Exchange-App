# Componentes — etapa visual

Nesta etapa os componentes estão em src/App.jsx e usam src/App.module.css.
src/index.css contém apenas estilos globais. A separação em arquivos individuais ocorrerá na próxima etapa.

| Componente | Responsabilidade | Props | Estado |
| --- | --- | --- | --- |
| App | Cabeçalho, apresentação, composição e rodapé | Nenhuma | Nenhum |
| Panel | Estrutura visual reutilizável de seção | number, title, subtitle, children | Nenhum |
| Converter | Campos e resultado ilustrativo | Nenhuma | Nenhum |
| History | Períodos e espaço reservado ao gráfico | Nenhuma | Nenhum |
| RatesTable | Filtros e tabela ilustrativa | Nenhuma | Nenhum |

App contém Converter, History e RatesTable. Cada um utiliza Panel.
Os controles estão desabilitados explicitamente: ainda não há consultas ou ações.
O gráfico real será integrado com biblioteca React, conforme o enunciado.
