# Verificação e entrega

## Verificações realizadas
- Build e ESLint executados nas etapas de desenvolvimento.
- 12 testes automatizados: cálculo, entradas inválidas, overflow, HTTP de erro,
  par incorreto, moedas, datas de períodos, bissextos, histórico inválido, filtros,
  ordenação numérica e exportação com mais de uma página.
- Navegador: conversão real, zero inválido, inversão preservando valor.
- Navegador: histórico de 7 e 30 dias e 10 anos; troca de par e paginação.
- Navegador: data inicial com cotação mínima, ordenação e quatro linhas exportadas.
- CSV baixado e lido: cabeçalho, quantidade, precisão e ordem conferidos.
- Filtro sem correspondências: mensagem e exportação desabilitada.

## Postman — observações da investigação
A collection contém cinco requisições:
1. Moedas disponíveis — resposta 200 e lista de moedas.
2. Cotação EUR para USD — resposta 200 com date, base, quote e rate.
3. Histórico EUR para USD — resposta 200 e lista de registros.
4. Moeda INVALID — resposta 422 com mensagem de moeda inválida.
5. Fim de semana 04–05/05/2024 — resposta 200 com registros para as duas datas.
O teste de fim de semana não demonstrou ausência de dados. Não se infere dele que
toda data terá cotação ou que todo fim de semana retornará vazio.
Os resultados acima foram observados nos prints enviados durante o desenvolvimento.
A collection guarda as requisições; não contém exemplos de respostas salvos.

## Revisão em 20/10/2026
- Adicionado atalho de teclado para pular ao conteúdo.
- Campos mobile com fonte de 16px e principais botões com altura mínima de 44px.
- README atualizado para o comportamento funcional e comando npm test.
- Revisão visual mobile ainda pendente: o servidor iniciado pelo agente não ficou
  acessível ao navegador de teste nesta sessão. CSS responsivo não substitui essa verificação.

## Roteiro de teste manual pendente
- [ ] Abrir o app em 390px e 320px; conferir cabeçalho, conversor, gráfico, filtros e tabela.
- [ ] Confirmar que somente a tabela rola horizontalmente, sem transbordamento da página.
- [ ] Percorrer campos e botões com Tab; verificar foco visível e link Pular para o conteúdo.
- [ ] Testar erro de rede e Tentar novamente após restabelecer a conexão.
- [ ] Trocar rapidamente moedas e períodos; conferir que a última seleção prevalece.
- [ ] Abrir o CSV no programa de planilha escolhido e importar com separador vírgula.
- [ ] Conferir no Figma wireframe, média fidelidade, mobile e estados.

## Entrega
- [x] Código e documentação no repositório local.
- [x] Collection do Postman em formato v2.1.
- [x] Histórico local de commits por etapa.
- [ ] Enviar os commits ao GitHub e conferir acesso público.
- [ ] Conferir o link público do Figma com o arquivo final.
- [ ] Finalizar os testes manuais acima.
- [ ] Entregar os links e arquivos solicitados até 27/10/2026, 23h59, horário de Brasília.

Não há publicação de site hospedado configurada. O README permite executar localmente.
