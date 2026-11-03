import RatesTable from './RatesTable'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Panel from './Panel'
import useFrankfurter from '../hooks/useFrankfurter'
import { calendarDate, periodRange, periods } from '../utils/history'
import { formatDate } from '../utils/conversion'
import { localeFor, translator } from '../i18n'
import styles from './History.module.css'


export default function History({ base, quote, language = 'pt' }) {
  const t = translator(language)
  const locale = localeFor(language)
  const rateFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 6 })
  const [period, setPeriod] = useState('30d')
  const [today] = useState(() => calendarDate())
  const { from, to } = periodRange(period, today)
  const sameCurrency = base === quote
  const params = new URLSearchParams({ from, to, base, quotes: quote })
  const history = useFrankfurter(sameCurrency ? null : '/rates?' + params)
  const rows = history.data ?? []
  let status = null
  if (sameCurrency) status = <p>{t("Escolha moedas diferentes no conversor para consultar o histórico.")}</p>
  else if (history.loading) status = <p>{t('Carregando histórico de {base} para {quote}…', { base, quote })}</p>
  else if (history.error) status = <div role="alert"><p>{t(history.error)}</p><button onClick={history.retry}>{t("Tentar novamente")}</button></div>
  else if (history.data && !rows.length) status = <p>{t("Não há cotações disponíveis neste período. Experimente outro intervalo.")}</p>

  return <>
    <Panel id="historico" number="02" title={t("Evolução da cotação")} subtitle={t('Histórico') + ' ' + base + ' → ' + quote}>
      <div className={styles.periods} aria-label={t("Período do histórico")}>{periods.map(item => <button key={item.id} aria-pressed={period === item.id} className={period === item.id ? styles.selected : ''} onClick={() => setPeriod(item.id)}>{t(item.label)}</button>)}</div>
      <p className={styles.caption}>{t('De {from} a {to} · cotação de 1 {base} em {quote}', { from: formatDate(from, locale), to: formatDate(to, locale), base, quote })}</p>
      {status ? <div className={styles.status} aria-live="polite">{status}</div> : <div className={styles.chart} role="group" aria-label={t('Gráfico de cotações {base} para {quote}. Dados completos na tabela abaixo.', { base, quote })}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={rows} margin={{ top: 15, right: 15, left: 0, bottom: 10 }} accessibilityLayer>
            <CartesianGrid stroke="#eee5f2" strokeDasharray="4 4" />
            <XAxis dataKey="date" minTickGap={40} tickFormatter={date => formatDate(date, locale)} tick={{ fontSize: 11 }} />
            <YAxis width={75} domain={['auto', 'auto']} tickFormatter={value => rateFormat.format(value)} tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={date => formatDate(String(date), locale)} formatter={value => [rateFormat.format(value) + ' ' + quote, t('Cotação')]} />
            <Line type="linear" dataKey="rate" stroke="#8346a4" strokeWidth={2} dot={rows.length === 1} activeDot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>}
      {!!rows.length && <p className={styles.caption}>{t('{count} cotações recebidas · datas efetivas de {from} a {to}. Dias sem registros não são preenchidos.', { count: rows.length, from: formatDate(rows[0].date, locale), to: formatDate(rows.at(-1).date, locale) })}</p>}
    </Panel>
    <RatesTable language={language} key={base + quote + period} rows={rows} base={base} quote={quote}
      unavailable={sameCurrency ? 'Selecione moedas diferentes.' : history.loading ? 'Aguardando a consulta do histórico…' : history.error ? 'Histórico indisponível. Tente novamente acima.' : !rows.length ? 'Não há cotações disponíveis neste período.' : ''} />
  </>
}
