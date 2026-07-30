import { useNavigate } from 'react-router-dom'
import styles from './ContactExperts.module.css'
import customer1 from '../../assets/vectors/customer1.png'

function ContactExperts() {
  const navigate = useNavigate()

  return (
    <section className={styles['container-expert']}>
      <div className={styles['content-1']}>
        <img
          data-aos="fade-right"
          data-aos-easing="ease"
          data-aos-duration="1000"
          className={styles['image-1']}
          src={customer1}
          alt="Image-Talk with expert person"
        />
        <div className={styles['text-contact']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
          <h1>Contact With Our Experts</h1>
          <p>Book your appointment to talk to our experts who will assist you with all your doubts regarding our services.</p>
          <div>
            <div className={styles['button-container']}>
              <button className={styles['button-1']} onClick={() => { window.location.href = 'mailto:info@welcongroup.com' }}>
                <span> <i className="fa fa-phone"></i> Contact</span>
              </button>
              <button className={styles['button-1']} onClick={() => navigate('/booking')}>
                <span> <i className="fa fa-calendar"></i> Book Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactExperts
