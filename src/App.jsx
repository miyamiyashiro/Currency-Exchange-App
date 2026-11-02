import { useEffect, useState } from 'react'
import History from './components/History'
import Converter from './components/Converter'
import { initialLanguage, localeFor, translator } from './i18n'
import styles from './App.module.css'

export default function App() {
  const [language, setLanguage] = useState(initialLanguage)
  const t = translator(language)
  useEffect(() => {
    document.documentElement.lang = localeFor(language)
    try { localStorage.setItem('currency-language', language) } catch { /* O seletor funciona mesmo sem armazenamento. */ }
  }, [language])
  const [pair, setPair] = useState({ base: 'EUR', quote: 'USD' })
  return <div><a className={styles.skipLink} href="#inicio">{t('Pular para o conteúdo')}</a>
    <header className={styles.header}><a className={styles.brand} href="#inicio"><span aria-hidden="true">⇄</span>Currency Exchange <small>APP</small></a><div className={styles.headerActions}><span className={styles.badge}>{t('Projeto de estudos · React')}</span><div className={styles.language} role="group" aria-label={t('Idioma')}><button type="button" lang="pt-BR" aria-label="Português" aria-pressed={language === 'pt'} onClick={() => setLanguage('pt')}>PT</button><button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button></div></div></header>
    <main id="inicio" className={styles.main}>
      <div className={styles.intro}><p className={styles.eyebrow}>{t("UM NOVO OLHAR SOBRE O CÂMBIO")}</p><h1>{t("Moedas diferentes.")}<br /><em>{t("Possibilidades sem fronteiras.")}</em></h1><p>{t("Converta valores e explore a evolução das moedas em um só lugar.")}</p></div>
      <p className={styles.notice}>{t("Consulte as cotações disponíveis para cada período. Os valores apresentados são taxas de referência.")}</p>
      <Converter language={language} base={pair.base} quote={pair.quote} onPairChange={setPair} /><History language={language} base={pair.base} quote={pair.quote} />
    </main>
    <footer className={styles.footer}><span>Currency Exchange App</span><span>{t("Cotações fornecidas pela API Frankfurter")}</span></footer>
  </div>
}
