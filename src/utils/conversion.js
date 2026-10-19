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

export function formatAmount(value, currency) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency, currencyDisplay: 'code' }).format(value)
}

export function formatDate(date) {
  return date.split('-').reverse().join('/')
}
