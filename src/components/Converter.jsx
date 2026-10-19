import { useState } from 'react'
import Panel from './Panel'
import useFrankfurter from '../hooks/useFrankfurter'
import { convertAmount, formatAmount, formatDate, validateAmount } from '../utils/conversion'
import styles from './Converter.module.css'

export default function Converter({ base, quote, onPairChange }) {
  const [amount, setAmount] = useState('100')
  const currencies = useFrankfurter('/currencies')
  const amountError = validateAmount(amount)
  const sameCurrency = base === quote
  const ready = currencies.data?.some(item => item.iso_code === base) &&
    currencies.data.some(item => item.iso_code === quote)
  const rate = useFrankfurter(ready && !sameCurrency && !amountError ? '/rate/' + base + '/' + quote : null)
  const converted = rate.data ? convertAmount(amount, rate.data.rate) : null

  function options(selected) {
    if (!currencies.data?.some(item => item.iso_code === selected)) {
      return <option value={selected}>{selected}</option>
    }
    return currencies.data.map(currency => <option key={currency.iso_code} value={currency.iso_code}>{currency.iso_code} — {currency.name}</option>)
  }

  return <Panel number="01" title="Conversor de moedas" subtitle="De uma moeda para outra, de um jeito simples.">
    <div className={styles.fields}>
      <label>Valor<input type="number" step="any" min="0" value={amount} onChange={event => setAmount(event.target.value)} aria-invalid={Boolean(amountError)} aria-describedby={amountError ? 'amount-error' : undefined} /></label>
      <label>De<select value={base} disabled={!currencies.data?.length} onChange={event => onPairChange({ base: event.target.value, quote })}>{options(base)}</select></label>
      <button type="button" className={styles.swap} disabled={!ready} aria-label="Inverter moedas" onClick={() => onPairChange({ base: quote, quote: base })}>⇄</button>
      <label>Para<select value={quote} disabled={!currencies.data?.length} onChange={event => onPairChange({ base, quote: event.target.value })}>{options(quote)}</select></label>
    </div>
    {amountError && <p id="amount-error" className={styles.error} role="alert">{amountError}</p>}
    {sameCurrency && <p className={styles.error} role="alert">Escolha moedas de origem e destino diferentes.</p>}
    <div aria-live="polite" aria-atomic="true" aria-busy={currencies.loading || rate.loading}>
      {currencies.loading && <p className={styles.status}>Carregando moedas disponíveis…</p>}
      {currencies.error && <div className={styles.error} role="alert">{currencies.error} <button onClick={currencies.retry}>Tentar novamente</button></div>}
      {currencies.data?.length === 0 && <div className={styles.status}>Nenhuma moeda disponível. <button onClick={currencies.retry}>Tentar novamente</button></div>}
      {currencies.data?.length > 0 && !ready && <p className={styles.status}>Selecione duas moedas disponíveis na lista.</p>}
      {rate.loading && <p className={styles.status}>Consultando cotação {base} → {quote}…</p>}
      {rate.error && <div className={styles.error} role="alert">{rate.error} <button onClick={rate.retry}>Tentar novamente</button></div>}
      {rate.data && converted === null && <p className={styles.error}>O valor é muito grande para converter. Informe um valor menor.</p>}
      {rate.data && converted !== null && <div className={styles.result}>
        <div><p>{formatAmount(Number(amount), base)} equivalem a</p><strong>{formatAmount(converted, quote)}</strong></div>
        <div><b>1 {base} = {new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8 }).format(rate.data.rate)} {quote}</b><p>Cotação de {formatDate(rate.data.date)}</p><p>Fonte: Frankfurter</p></div>
      </div>}
    </div>
  </Panel>
}
