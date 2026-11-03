import styles from '../App.module.css'

export default function Panel({ id, number, title, subtitle, children }) {
  return <section id={id} tabIndex={id ? -1 : undefined} className={styles.panel}><div className={styles.heading}><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</section>
}
