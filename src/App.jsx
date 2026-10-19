import { useState } from 'react'
import History from './components/History'
import Converter from './components/Converter'
import styles from './App.module.css'

export default function App() {
  const [pair, setPair] = useState({ base: 'EUR', quote: 'USD' })
  return <div>
    <header className={styles.header}><a className={styles.brand} href="#inicio"><span aria-hidden="true">⇄</span>Currency Exchange <small>APP</small></a><span className={styles.badge}>Projeto de estudos · React</span></header>
    <main id="inicio" className={styles.main}>
      <div className={styles.intro}><p className={styles.eyebrow}>UM NOVO OLHAR SOBRE O CÂMBIO</p><h1>Moedas diferentes.<br /><em>Possibilidades sem fronteiras.</em></h1><p>Converta valores e explore a evolução das moedas em um só lugar.</p></div>
      <p className={styles.notice}>Consulte as cotações disponíveis para cada período. Os valores apresentados são taxas de referência.</p>
      <Converter base={pair.base} quote={pair.quote} onPairChange={setPair} /><History base={pair.base} quote={pair.quote} />
    </main>
    <footer className={styles.footer}><span>Currency Exchange App</span><span>Cotações fornecidas pela API Frankfurter</span></footer>
  </div>
}
