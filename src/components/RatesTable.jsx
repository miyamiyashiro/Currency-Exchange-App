import { useState } from 'react'
import Panel from './Panel'
import { formatDate } from '../utils/conversion'
import { emptyFilters, validateFilters, filterAndSort, createCsv, csvFilename } from '../utils/table'
import { localeFor, translator } from '../i18n'
import styles from './RatesTable.module.css'


export default function RatesTable({ rows, base, quote, unavailable, language = 'pt' }) {
  const t = translator(language)
  const locale = localeFor(language)
  const rateFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 8 })
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
    const url = URL.createObjectURL(new Blob([createCsv(filtered, language)], { type: 'text/csv;charset=utf-8;' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = csvFilename(filtered, language)
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setExportMessage(filtered.length)
  }

  const sortLabel = field => sort.field !== field ? 'none' : sort.direction === 'asc' ? 'ascending' : 'descending'
  const arrow = field => sort.field !== field ? '↕' : sort.direction === 'asc' ? '↑' : '↓'

  return <Panel number="03" title={t("Explore os dados")} subtitle={t("Os filtros abaixo afetam a tabela e o CSV. O gráfico mantém o período completo.")}>
    <div className={styles.filters} aria-describedby={error ? 'filter-error' : undefined}>
      <label>{t("Data inicial")}<input type="date" value={draft.from} onInput={event => changeFilter('from', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <label>{t("Data final")}<input type="date" value={draft.to} onInput={event => changeFilter('to', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <label>{t("Cotação mínima")}<input type="number" step="any" min="0" placeholder={t("Sem limite")} value={draft.min} onChange={event => changeFilter('min', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <label>{t("Cotação máxima")}<input type="number" step="any" min="0" placeholder={t("Sem limite")} value={draft.max} onChange={event => changeFilter('max', event.target.value)} disabled={Boolean(unavailable)} /></label>
      <button onClick={clearFilters}>{t("Limpar filtros")}</button>
    </div>
    {error && <p className={styles.error} role="alert" id="filter-error">{t(error)} {t('A tabela mantém os últimos filtros válidos.')}</p>}
    <div className={styles.toolbar}><p role="status"><b>{filtered.length}</b> {t('registros encontrados de')} {rows.length}</p><button disabled={!filtered.length || Boolean(error) || Boolean(unavailable)} onClick={exportCsv}>↓ {t('Exportar CSV')}</button></div>
    {exportMessage && <p role="status" className={styles.caption}>{t('Arquivo gerado com {count} registros.', { count: exportMessage })}</p>}
    {unavailable ? <p className={styles.empty}>{t(unavailable)}</p> : !filtered.length ? <div className={styles.empty}><p>{t("Nenhum registro corresponde aos filtros.")}</p><button onClick={clearFilters}>{t("Limpar filtros")}</button></div> : <>
      <div className={styles.scroll} tabIndex="0" role="region" aria-label={t("Tabela de cotações, com rolagem horizontal")}>
        <table><caption>{base} → {quote} · {t('ordenação por')} {t(sort.field === 'date' ? 'data' : 'cotação')} {t(sort.direction === 'asc' ? 'crescente' : 'decrescente')}</caption>
          <thead><tr><th scope="col" aria-sort={sortLabel('date')}><button onClick={() => orderBy('date')}>{t('Data')} {arrow('date')}</button></th><th scope="col">{t("Origem")}</th><th scope="col">{t("Destino")}</th><th scope="col" aria-sort={sortLabel('rate')}><button onClick={() => orderBy('rate')}>{t('Cotação')} {arrow('rate')}</button></th></tr></thead>
          <tbody>{visible.map(row => <tr key={row.date}><td>{formatDate(row.date, locale)}</td><td>{row.base}</td><td>{row.quote}</td><td>{rateFormat.format(row.rate)}</td></tr>)}</tbody>
        </table>
      </div>
      <nav className={styles.pagination} aria-label={t("Paginação das cotações")}><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>{t("Anterior")}</button><span>{t('Página {page} de {count}', { page: currentPage + 1, count: pageCount })}</span><button disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}>{t("Próxima")}</button></nav>
      <p className={styles.caption}>{t('O CSV inclui todos os {count} registros filtrados, na ordem da tabela, incluindo outras páginas.', { count: filtered.length })}</p>
    </>}
  </Panel>
}
