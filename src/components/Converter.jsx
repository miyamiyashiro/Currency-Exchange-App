import { useState } from 'react'
import Panel from './Panel'
import useFrankfurter from '../hooks/useFrankfurter'
import { convertAmount, formatAmount, formatDate, validateAmount } from '../utils/conversion'
import { localeFor, translator } from '../i18n'
import styles from './Converter.module.css'

export default function Converter({ base, quote, onPairChange, language = 'pt' }) {
  const t = translator(language)
  const locale = localeFor(language)
  const currencyNames = new Intl.DisplayNames([locale], { type: 'currency', fallback: 'none' })
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
    return currencies.data.map(currency => <option key={currency.iso_code} value={currency.iso_code}>{currency.iso_code} — {(currencyNames.of(currency.iso_code) || currency.name)}</option>)
  }

  return <Panel number="01" title={t("Conversor de moedas")} subtitle={t("De uma moeda para outra, de um jeito simples.")}>
    <div className={styles.fields}>
      <label>{t("Valor")}<input type="number" step="any" min="0" value={amount} onChange={event => setAmount(event.target.value)} aria-invalid={Boolean(amountError)} aria-describedby={amountError ? 'amount-error' : undefined} /></label>
      <label>{t("De")}<select value={base} disabled={!currencies.data?.length} onChange={event => onPairChange({ base: event.target.value, quote })}>{options(base)}</select></label>
      <button type="button" className={styles.swap} disabled={!ready} aria-label={t("Inverter moedas")} onClick={() => onPairChange({ base: quote, quote: base })}>⇄</button>
      <label>{t("Para")}<select value={quote} disabled={!currencies.data?.length} onChange={event => onPairChange({ base, quote: event.target.value })}>{options(quote)}</select></label>
    </div>
    {amountError && <p id="amount-error" className={styles.error} role="alert">{t(amountError)}</p>}
    {sameCurrency && <p className={styles.error} role="alert">{t("Escolha moedas de origem e destino diferentes.")}</p>}
    <div aria-live="polite" aria-atomic="true" aria-busy={currencies.loading || rate.loading}>
      {currencies.loading && <p className={styles.status}>{t("Carregando moedas disponíveis…")}</p>}
      {currencies.error && <div className={styles.error} role="alert">{t(currencies.error)} <button onClick={currencies.retry}>{t("Tentar novamente")}</button></div>}
      {currencies.data?.length === 0 && <div className={styles.status}>{t('Nenhuma moeda disponível.')} <button onClick={currencies.retry}>{t("Tentar novamente")}</button></div>}
      {currencies.data?.length > 0 && !ready && <p className={styles.status}>{t("Selecione duas moedas disponíveis na lista.")}</p>}
      {rate.loading && <p className={styles.status}>{t('Consultando cotação {base} → {quote}…', { base, quote })}</p>}
      {rate.error && <div className={styles.error} role="alert">{t(rate.error)} <button onClick={rate.retry}>{t("Tentar novamente")}</button></div>}
      {rate.data && converted === null && <p className={styles.error}>{t("O valor é muito grande para converter. Informe um valor menor.")}</p>}
      {rate.data && converted !== null && <div className={styles.result}>
        <div><p>{formatAmount(Number(amount), base, locale)} {t('equivalem a')}</p><strong>{formatAmount(converted, quote, locale)}</strong></div>
        <div><b>1 {base} = {new Intl.NumberFormat(locale, { maximumFractionDigits: 8 }).format(rate.data.rate)} {quote}</b><p>{t('Cotação de')} {formatDate(rate.data.date, locale)}</p><p>{t("Fonte: Frankfurter")}</p></div>
      </div>}
    </div>
  </Panel>
}
