export const emptyFilters = { from: '', to: '', min: '', max: '' }

export function validateFilters(filters) {
  for (const date of [filters.from, filters.to]) {
    if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date)) return 'Informe datas válidas.'
  }
  if (filters.from && filters.to && filters.from > filters.to) return 'A data inicial deve ser anterior ou igual à data final.'
  for (const value of [filters.min, filters.max]) {
    if (value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0)) return 'As cotações devem ser números maiores ou iguais a zero.'
  }
  if (filters.min !== '' && filters.max !== '' && Number(filters.min) > Number(filters.max)) return 'A cotação mínima deve ser menor ou igual à máxima.'
  return ''
}

export function filterAndSort(rows, filters, sort) {
  return rows.filter(row =>
    (!filters.from || row.date >= filters.from) &&
    (!filters.to || row.date <= filters.to) &&
    (filters.min === '' || row.rate >= Number(filters.min)) &&
    (filters.max === '' || row.rate <= Number(filters.max))
  ).sort((a, b) => {
    const comparison = sort.field === 'rate' ? a.rate - b.rate : a.date.localeCompare(b.date)
    return comparison === 0 ? a.date.localeCompare(b.date) : comparison * (sort.direction === 'asc' ? 1 : -1)
  })
}

export function createCsv(rows) {
  if (!rows.length) throw new Error('Não há registros para exportar.')
  const escape = value => '"' + String(value).replaceAll('"', '""') + '"'
  const header = ['data', 'moeda_origem', 'moeda_destino', 'cotacao']
  return '\uFEFF' + [header.join(','), ...rows.map(row =>
    [row.date, row.base, row.quote, row.rate].map(escape).join(',')
  )].join('\r\n') + '\r\n'
}

export function csvFilename(rows) {
  const dates = rows.map(row => row.date).sort()
  return 'cotacoes_' + rows[0].base + '_' + rows[0].quote + '_' + dates[0] + '_' + dates.at(-1) + '.csv'
}
