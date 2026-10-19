export const periods = [
  { id: '7d', label: '7 dias', days: 7 },
  { id: '15d', label: '15 dias', days: 15 },
  { id: '30d', label: '30 dias', days: 30 },
  { id: '3m', label: '3 meses', months: 3 },
  { id: '6m', label: '6 meses', months: 6 },
  { id: '1y', label: '1 ano', months: 12 },
  { id: '5y', label: '5 anos', months: 60 },
  { id: '10y', label: '10 anos', months: 120 },
]

// Datas de calendário, sem converter meia-noite local para outro fuso.
export function calendarDate(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

export function periodRange(id, today = calendarDate()) {
  const period = periods.find(item => item.id === id)
  if (!period) throw new Error('Período inválido.')
  const [year, month, day] = today.split('-').map(Number)
  const start = new Date(Date.UTC(year, month - 1, day))
  if (period.days) start.setUTCDate(day - period.days + 1)
  else {
    start.setUTCDate(1)
    start.setUTCMonth(start.getUTCMonth() - period.months)
    const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate()
    start.setUTCDate(Math.min(day, lastDay))
  }
  return { from: start.toISOString().slice(0, 10), to: today }
}

export function normalizeHistory(data, { base, quote, from, to }) {
  if (!Array.isArray(data)) throw new Error('O histórico recebido é inválido.')
  const unique = new Map()
  for (const row of data) {
    if (!row || row.base !== base || row.quote !== quote ||
        !Number.isFinite(row.rate) || row.rate <= 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(row.date) ||
        !Number.isFinite(Date.parse(row.date)) ||
        new Date(row.date).toISOString().slice(0, 10) !== row.date) {
      throw new Error('O histórico contém uma cotação inválida.')
    }
    // Algumas fontes podem devolver uma data anterior ao início solicitado.
    if (row.date >= from && row.date <= to) unique.set(row.date, row)
  }
  return [...unique.values()].sort((a, b) => a.date.localeCompare(b.date))
}
