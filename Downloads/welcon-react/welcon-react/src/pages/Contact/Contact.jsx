import styles from './Contact.module.css'
import Faq from '../../components/Faq/Faq.jsx'
import HireUsBanner from '../../components/HireUsBanner/HireUsBanner.jsx'
import ContactExperts from '../../components/ContactExperts/ContactExperts.jsx'
import { faqItems } from '../../data/faqData.jsx'

const getInTouchCards = [
  {
    key: 'call',
    icon: 'fa-solid fa-phone fa-2xl',
    title: 'Call us',
    duration: 700,
    content: (
      <>
        <p><a style={{ color: '#00308F' }} href="tel:+923219536003">+92 3219536003</a></p>
        <p><a style={{ color: '#00308F' }} href="tel:+923004451561">+92 3004451561</a></p>
      </>
    ),
  },
  {
    key: 'office',
    icon: 'fa-solid fa-map-location-dot fa-2xl',
    title: 'Our Office',
    duration: 1000,
    content: <p>Sec-76, Noida</p>,
    onClick: () => window.open('https://www.google.com/maps/dir/Current+Location/Sec-76+Noida', '_blank'),
  },
  {
    key: 'mail',
    icon: 'fa-solid fa-envelope fa-2xl',
    title: 'Mail Us',
    duration: 1300,
    content: <p>info@welcongroup.com</p>,
    onClick: () => window.open('mailto:info@welcongroup.com', '_blank'),
  },
  {
    key: 'whatsapp',
    icon: 'fab fa-whatsapp fa-2xl',
    title: 'DM us',
    duration: 1600,
    content: <p>+92 3219536003</p>,
    onClick: () => window.open('https://api.whatsapp.com/send?phone=+923219536003&text=Hello%20there!', '_blank'),
  },
]

function Contact() {
  return (
    <>
      {/* Hero Section Start */}
      <section className={styles.hero}>
        <div className={styles['hero-heading']}>
          <h1 id="contact-heading1">Contact Us</h1>
        </div>
      </section>
      {/* Hero Section End */}

      {/* Contact us name */}
      <section style={{ padding: '30px' }}>
        <p><a href="/">Home</a> / Contact</p>
      </section>
      {/* Contact us name end */}

      {/* Talk with Experts Section starts */}
      <ContactExperts />
      {/* Talk with Experts Section ends */}

      {/* Get in Touch Section */}
      <section className={styles.getintouch}>
        <div className={styles['getintouch-heading']}>
          <h1>Get in Touch</h1>
          <p>
            Feel free to contact us if you have any queries regarding our services. <br />
            We'll feel happy to serve you with our best services.
          </p>
        </div>
        <div className={styles['getintouch-row']}>
          {getInTouchCards.map((card) => (
            <div
              className={styles['getintouch-contact-cards']}
              data-aos="fade-up"
              data-aos-easing="ease"
              data-aos-duration={card.duration}
              onClick={card.onClick}
              key={card.key}
            >
              <div className={styles['getintouch-icon']}>
                <i className={card.icon}></i>
              </div>
              <div className={styles['getintouch-card-content']}>
                <h3>{card.title}</h3>
                {card.content}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Get in touch End */}

      {/* FAQ starts */}
      <Faq items={faqItems} />
      {/* FAQ end */}

      {/* Hire Us Section */}
      <HireUsBanner />
    </>
  )
}

export default Contact
