export function validateAmount(value) {
  if (value.trim() === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
    return 'Informe um valor numérico maior que zero.'
  }
  return ''
}

export function convertAmount(value, rate) {
  const result = Number(value) * rate
  return Number.isFinite(result) ? result : null
}

export function formatAmount(value, currency, locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'code' }).format(value)
}

export function formatDate(date, locale = 'pt-BR') {
  const [year, month, day] = date.split('-')
  return locale === 'en-US' ? [month, day, year].join('/') : [day, month, year].join('/')
}
