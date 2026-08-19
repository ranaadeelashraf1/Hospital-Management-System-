import { useState } from 'react'
import styles from './Faq.module.css'

/**
 * Reusable FAQ accordion.
 * items: [{ q: string, a: string | JSX }]
 */
function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section className={styles.faq}>
      <div className={styles['faq-heading']}>
        <h1>FAQs</h1>
      </div>
      <div className={styles['faq-content']}>
        {items.map((item, i) => (
          <div
            className={styles['faq-block']}
            data-aos="fade-up"
            data-aos-easing="ease"
            data-aos-duration={500 + i * 500}
            key={item.q}
          >
            <div className={styles['faq-question']} onClick={() => toggle(i)}>
              <h2>{item.q}</h2>
              <i className={`fa-solid ${openIndex === i ? 'fa-minus' : 'fa-plus'} fa-xl`}></i>
            </div>
            <div className={`${styles['faq-answer']} ${openIndex === i ? styles['show-answer'] : ''}`}>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Faq
