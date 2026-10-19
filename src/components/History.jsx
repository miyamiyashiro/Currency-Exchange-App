import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Panel from './Panel'
import useFrankfurter from '../hooks/useFrankfurter'
import { calendarDate, periodRange, periods } from '../utils/history'
import { formatDate } from '../utils/conversion'
import styles from './History.module.css'

const rateFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 6 })

export default function History({ base, quote }) {
  const [period, setPeriod] = useState('30d')
  const [today] = useState(() => calendarDate())
  const { from, to } = periodRange(period, today)
  const sameCurrency = base === quote
  const params = new URLSearchParams({ from, to, base, quotes: quote })
  const history = useFrankfurter(sameCurrency ? null : '/rates?' + params)
  const rows = history.data ?? []
  const [page, setPage] = useState({ key: '', index: 0 })
  const pageKey = base + quote + period
  const pageIndex = page.key === pageKey ? page.index : 0
  const pageSize = 25
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(pageIndex, pageCount - 1)
  const visibleRows = rows.slice().reverse().slice(safePage * pageSize, (safePage + 1) * pageSize)
  const changePage = index => setPage({ key: pageKey, index })

  let status = null
  if (sameCurrency) status = <p>Escolha moedas diferentes no conversor para consultar o histórico.</p>
  else if (history.loading) status = <p>Carregando histórico de {base} para {quote}…</p>
  else if (history.error) status = <div role="alert"><p>{history.error}</p><button onClick={history.retry}>Tentar novamente</button></div>
  else if (history.data && !rows.length) status = <p>Não há cotações disponíveis neste período. Experimente outro intervalo.</p>

  return <>
    <Panel number="02" title="Evolução da cotação" subtitle={'Histórico ' + base + ' → ' + quote}>
      <div className={styles.periods} aria-label="Período do histórico">{periods.map(item => <button key={item.id} aria-pressed={period === item.id} className={period === item.id ? styles.selected : ''} onClick={() => setPeriod(item.id)}>{item.label}</button>)}</div>
      <p className={styles.caption}>De {formatDate(from)} a {formatDate(to)} · cotação de 1 {base} em {quote}</p>
      {status ? <div className={styles.status} aria-live="polite">{status}</div> : <div className={styles.chart} role="group" aria-label={'Gráfico de cotações ' + base + ' para ' + quote + '. Dados completos na tabela abaixo.'}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={rows} margin={{ top: 15, right: 15, left: 0, bottom: 10 }} accessibilityLayer>
            <CartesianGrid stroke="#eee5f2" strokeDasharray="4 4" />
            <XAxis dataKey="date" minTickGap={40} tickFormatter={date => formatDate(date)} tick={{ fontSize: 11 }} />
            <YAxis width={75} domain={['auto', 'auto']} tickFormatter={value => rateFormat.format(value)} tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={date => formatDate(String(date))} formatter={value => [rateFormat.format(value) + ' ' + quote, 'Cotação']} />
            <Line type="linear" dataKey="rate" stroke="#8346a4" strokeWidth={2} dot={rows.length === 1} activeDot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>}
      {!!rows.length && <p className={styles.caption}>{rows.length} cotações recebidas · datas efetivas de {formatDate(rows[0].date)} a {formatDate(rows.at(-1).date)}. Dias sem registros não são preenchidos.</p>}
    </Panel>
    <Panel number="03" title="Explore os dados" subtitle="Cotações do mesmo par e período selecionados acima.">
      <div className={styles.toolbar}><p><b>{rows.length}</b> registros encontrados</p><span>Filtros e CSV na próxima etapa</span></div>
      {status ? <p className={styles.caption}>{sameCurrency ? 'Selecione moedas diferentes.' : history.loading ? 'Aguardando a consulta do histórico…' : history.error ? 'Histórico indisponível. Tente novamente acima.' : 'Nenhum registro para exibir.'}</p> : <>
        <div className={styles.scroll} tabIndex="0" role="region" aria-label="Tabela de cotações, com rolagem horizontal">
          <table><caption>{base} → {quote} · mais recentes primeiro</caption><thead><tr><th scope="col">Data</th><th scope="col">Origem</th><th scope="col">Destino</th><th scope="col">Cotação</th></tr></thead><tbody>
            {visibleRows.map(row => <tr key={row.date}><td>{formatDate(row.date)}</td><td>{row.base}</td><td>{row.quote}</td><td>{rateFormat.format(row.rate)}</td></tr>)}
          </tbody></table>
        </div>
        <nav className={styles.pagination} aria-label="Paginação das cotações"><button disabled={safePage === 0} onClick={() => changePage(safePage - 1)}>Anterior</button><span>Página {safePage + 1} de {pageCount}</span><button disabled={safePage + 1 >= pageCount} onClick={() => changePage(safePage + 1)}>Próxima</button></nav>
      </>}
    </Panel>
  </>
}
