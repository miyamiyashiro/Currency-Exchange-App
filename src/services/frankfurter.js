const API_URL = 'https://api.frankfurter.dev/v2'

export async function fetchResource(path, signal) {
  const response = await fetch(API_URL + path, { signal })
  if (!response.ok) {
    if (response.status === 404) throw new Error('Não há cotação disponível para este par de moedas.')
    if (response.status === 422) throw new Error('A API não conseguiu consultar as moedas selecionadas.')
    throw new Error('Não foi possível consultar a API. Tente novamente.')
  }
  const data = await response.json()
  if (path === '/currencies') {
    if (!Array.isArray(data)) throw new Error('A lista de moedas recebida é inválida.')
    return data.filter(currency => /^[A-Z]{3}$/.test(currency.iso_code) && typeof currency.name === 'string')
      .sort((a, b) => a.iso_code.localeCompare(b.iso_code))
  }
  const [, , base, quote] = path.split('/')
  if (!data || data.base !== base || data.quote !== quote ||
      !Number.isFinite(data.rate) || data.rate <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error('A API retornou uma cotação inválida. Tente novamente.')
  }
  return data
}
