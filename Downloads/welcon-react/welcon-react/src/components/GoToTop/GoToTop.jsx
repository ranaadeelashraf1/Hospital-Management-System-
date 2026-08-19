import styles from './GoToTop.module.css'

function GoToTop() {
  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <a className={styles.gotop} href="#top" onClick={scrollToTop}>
      <i className="fa-solid fa-arrow-up fa-lg"></i>
    </a>
  )
}

export default GoToTop
