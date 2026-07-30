import { useNavigate } from 'react-router-dom'
import styles from './HireUsBanner.module.css'

function HireUsBanner({ heading = 'Transform your living space into a work of Art!' }) {
  const navigate = useNavigate()

  return (
    <section className={styles.hireus}>
      <div className={styles['hireus-box']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
        <div className={styles['hireus-content']}>
          <h1>{heading}</h1>
          <button onClick={() => navigate('/booking')}>
            <span> Hire us</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default HireUsBanner
