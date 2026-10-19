import { useState } from 'react'
import Panel from './components/Panel'
import Converter from './components/Converter'
import styles from './App.module.css'

const periods = ['7 dias', '15 dias', '30 dias', '3 meses', '6 meses', '1 ano', '5 anos', '10 anos']

function History() {
  return <Panel number="02" title="Evolução da cotação" subtitle="Histórico EUR → USD">
    <div className={styles.periods} aria-label="Período do histórico">{periods.map(period => <button disabled key={period} aria-pressed={period === '30 dias'} className={period === '30 dias' ? styles.selected : ''}>{period}</button>)}</div>
    <div className={styles.placeholder}><span aria-hidden="true">↗</span><strong>Seu histórico, em perspectiva</strong><p>O gráfico de cotações será exibido aqui após a integração com a API.</p></div>
    <p className={styles.caption}>Visualização demonstrativa · sem dados históricos carregados</p>
  </Panel>
}

// Valores fictícios, usados somente nesta primeira etapa visual.
const examples = [
  { date: '16/10/2026', rate: '1,0840' },
  { date: '15/10/2026', rate: '1,0825' },
  { date: '14/10/2026', rate: '1,0785' },
]

function RatesTable() {
  return <Panel number="03" title="Explore os dados" subtitle="Consulte, filtre e exporte o histórico de cotações.">
    <div className={styles.filters}>
      <label>Data inicial<input type="date" disabled /></label><label>Data final<input type="date" disabled /></label>
      <label>Cotação mínima<input type="number" placeholder="0,00" disabled /></label><label>Cotação máxima<input type="number" placeholder="0,00" disabled /></label>
      <button disabled>Limpar filtros</button>
    </div>
    <div className={styles.toolbar}><p><b>3</b> registros ilustrativos</p><button disabled>↓ Exportar CSV</button></div>
    <div className={styles.scroll} tabIndex="0" role="region" aria-label="Cotações ilustrativas, tabela com rolagem horizontal"><table><caption>Exemplo EUR → USD · dados fictícios</caption><thead><tr><th scope="col"><button disabled>Data ↕</button></th><th scope="col">Origem</th><th scope="col">Destino</th><th scope="col"><button disabled>Cotação ↕</button></th></tr></thead><tbody>{examples.map(row => <tr key={row.date}><td>{row.date}</td><td>EUR</td><td>USD</td><td>{row.rate}</td></tr>)}</tbody></table></div>
  </Panel>
}

export default function App() {
  const [pair, setPair] = useState({ base: 'EUR', quote: 'USD' })
  return <div>
    <header className={styles.header}><a className={styles.brand} href="#inicio"><span aria-hidden="true">⇄</span>Currency Exchange <small>APP</small></a><span className={styles.badge}>Projeto de estudos · React</span></header>
    <main id="inicio" className={styles.main}>
      <div className={styles.intro}><p className={styles.eyebrow}>UM NOVO OLHAR SOBRE O CÂMBIO</p><h1>Moedas diferentes.<br /><em>Possibilidades sem fronteiras.</em></h1><p>Converta valores e explore a evolução das moedas em um só lugar.</p></div>
      <p className={styles.notice}>Conversor conectado à API. Histórico e tabela abaixo ainda são demonstrativos; filtros e exportação serão ativados depois.</p>
      <Converter base={pair.base} quote={pair.quote} onPairChange={setPair} /><History /><RatesTable />
    </main>
    <footer className={styles.footer}><span>Currency Exchange App</span><span>Cotações fornecidas pela API Frankfurter</span></footer>
  </div>
}

