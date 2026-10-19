import { useState } from 'react'
import Panel from './Panel'
import { formatDate } from '../utils/conversion'
import { emptyFilters, validateFilters, filterAndSort, createCsv, csvFilename } from '../utils/table'
import styles from './RatesTable.module.css'

const rateFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8 })

export default function RatesTable({ rows, base, quote, unavailable }) {
  const [draft, setDraft] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [sort, setSort] = useState({ field: 'date', direction: 'desc' })
  const [page, setPage] = useState(0)
  const [exportMessage, setExportMessage] = useState('')
  const error = validateFilters(draft)
  const filtered = filterAndSort(rows, applied, sort)
  const pageCount = Math.max(1, Math.ceil(filtered.length / 25))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(currentPage * 25, (currentPage + 1) * 25)

  function changeFilter(field, value) {
    const next = { ...draft, [field]: value }
    setDraft(next)
    setExportMessage('')
    if (!validateFilters(next)) {
      setApplied(next)
      setPage(0)
    }
  }

  function clearFilters() {
    setDraft(emptyFilters)
    setApplied(emptyFilters)
    setPage(0)
    setExportMessage('')
  }

  function orderBy(field) {
    setSort({ field, direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc' })
    setPage(0)
    setExportMessage('')
  }

  function exportCsv() {
    if (!filtered.length || error || unavailable) return
    const url = URL.createObjectURL(new Blob([createCsv(filtered)], { type: 'text/csv;charset=utf-8;' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = csvFilename(filtered)
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setExportMessage('Arquivo gerado com ' + filtered.length + ' registros.')
  }

  const sortLabel = field => sort.field !== field ? 'none' : sort.direction === 'asc' ? 'ascending' : 'descending'
  const arrow = field => sort.field !== field ? '↕' : sort.direction === 'asc' ? '↑' : '↓'

  return <Panel number="03" title="Explore os dados" subtitle="Os filtros abaixo afetam a tabela e o CSV. O gráfico mantém o período completo.">
    <div className={styles.filters} aria-describedby={error ? 'filter-error' : undefined}>
      <label>Data inicial<input type="date" value={draft.from} onInput={event => changeFilter('from', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <label>Data final<input type="date" value={draft.to} onInput={event => changeFilter('to', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <label>Cotação mínima<input type="number" step="any" min="0" placeholder="Sem limite" value={draft.min} onChange={event => changeFilter('min', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <label>Cotação máxima<input type="number" step="any" min="0" placeholder="Sem limite" value={draft.max} onChange={event => changeFilter('max', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <button onClick={clearFilters}>Limpar filtros</button>
    </div>
    {error && <p className={styles.error} role="alert" id="filter-error">{error} A tabela mantém os últimos filtros válidos.</p>}
    <div className={styles.toolbar}><p role="status"><b>{filtered.length}</b> registros encontrados de {rows.length}</p><button disabled={!filtered.length || Boolean(error) || Boolean(unavailable)} onClick={exportCsv}>↓ Exportar CSV</button></div>
    {exportMessage && <p role="status" className={styles.caption}>{exportMessage}</p>}
    {unavailable ? <p className={styles.empty}>{unavailable}</p> : !filtered.length ? <div className={styles.empty}><p>Nenhum registro corresponde aos filtros.</p><button onClick={clearFilters}>Limpar filtros</button></div> : <>
      <div className={styles.scroll} tabIndex="0" role="region" aria-label="Tabela de cotações, com rolagem horizontal">
        <table><caption>{base} → {quote} · ordenação por {sort.field === 'date' ? 'data' : 'cotação'} {sort.direction === 'asc' ? 'crescente' : 'decrescente'}</caption>
          <thead><tr><th scope="col" aria-sort={sortLabel('date')}><button onClick={() => orderBy('date')}>Data {arrow('date')}</button></th><th scope="col">Origem</th><th scope="col">Destino</th><th scope="col" aria-sort={sortLabel('rate')}><button onClick={() => orderBy('rate')}>Cotação {arrow('rate')}</button></th></tr></thead>
          <tbody>{visible.map(row => <tr key={row.date}><td>{formatDate(row.date)}</td><td>{row.base}</td><td>{row.quote}</td><td>{rateFormat.format(row.rate)}</td></tr>)}</tbody>
        </table>
      </div>
      <nav className={styles.pagination} aria-label="Paginação das cotações"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Anterior</button><span>Página {currentPage + 1} de {pageCount}</span><button disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}>Próxima</button></nav>
      <p className={styles.caption}>O CSV inclui todos os {filtered.length} registros filtrados, na ordem da tabela, incluindo outras páginas.</p>
    </>}
  </Panel>
}
