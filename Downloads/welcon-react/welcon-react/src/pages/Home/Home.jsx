import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'
import aboutStyles from '../AboutUs/AboutUs.module.css'
import Faq from '../../components/Faq/Faq.jsx'
import ContactExperts from '../../components/ContactExperts/ContactExperts.jsx'
import { faqItems } from '../../data/faqData.jsx'

import homeBanner from '../../assets/homepage/home.jpg'
import generalConstruction from '../../assets/bg/generalconstruction.webp'
import constructionManagement from '../../assets/bg/constructionmanagement.webp'
import designAndBuild from '../../assets/bg/design-and-build.webp'
import preconstruction from '../../assets/bg/preconstruction.webp'
import specialProjects from '../../assets/bg/special-projects.webp'
import renovation from '../../assets/bg/renovation.webp'
import buildWithQuality from '../../assets/vectors/build-with-quality.webp'

import cer1 from '../../assets/certificates/cer1.png'
import cer2 from '../../assets/certificates/cer2.png'
import cer3 from '../../assets/certificates/cer3.jpg'
import cer4 from '../../assets/certificates/cer4.jpg'

import p1 from '../../assets/clients/Picture1.jpg'
import p2 from '../../assets/clients/Picture2.png'
import p3 from '../../assets/clients/Picture3.png'
import p4 from '../../assets/clients/Picture4.png'
import p5 from '../../assets/clients/Picture5.png'
import p6 from '../../assets/clients/Picture6.jpg'
import p7 from '../../assets/clients/Picture7.jpg'
import p8 from '../../assets/clients/Picture8.jpg'
import p9 from '../../assets/clients/Picture9.png'
import p10 from '../../assets/clients/Picture10.png'
import p11 from '../../assets/clients/Picture11.jpg'
import p12 from '../../assets/clients/Picture12.png'

const serviceCards = [
  { img: generalConstruction, title: 'General Constructing' },
  { img: constructionManagement, title: 'Construction Management' },
  { img: designAndBuild, title: 'Design and Build' },
  { img: preconstruction, title: 'Preconstruction Consulting' },
  { img: specialProjects, title: 'Special Projects' },
  { img: renovation, title: 'Renovations' },
]
const servicesParagraph =
  'Construction work encompasses the creation and upkeep of structures such as buildings, roads, bridges, and tunnels.'

const whyChooseUsRow1 = [
  { title: 'Professional Staff', text: 'Our staff members are experts in their respective fields and are committed to providing exceptional service to our clients.' },
  { title: 'Save Time and Money', text: 'We understand that your time is valuable, which is why we offer efficient and convenient solutions that can streamline your daily tasks.' },
  { title: 'Detailed Estimated', text: 'We provide comprehensive breakdowns of costs and expenses associated with our products and services.' },
]
const whyChooseUsRow2 = [
  { title: 'On Time Completion', text: 'With our commitment to on-time completion, you can be confident that your projects and services will be delivered promptly and to your satisfaction.' },
  { title: 'No Hidden Cost', text: 'Honesty and clarity are crucial when it comes to pricing, and we strive to ensure that our customers are fully informed of all costs associated with our services.' },
  { title: 'Zero Complaints', text: 'Our commitment to quality and customer satisfaction is reflected in our track record of zero complaints.' },
]

const clientLogos = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12]
const certificates = [cer1, cer2, cer3, cer4]

function Home() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero Section Start - unified with AboutUs style */}
      <section className={styles['hero-main']}>
        <div
          className={aboutStyles['hero-bg']}
          style={{ backgroundImage: `url(${homeBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          id="home-slide"
        >
          <div className={aboutStyles['hero-heading']}>
            <div className={styles['hero-slogan-box']}>
              <p>Design. Build. Deliver.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Hero Section End */}

      {/* Services Section Started */}
      <section>
        <h2 className={styles['services-heading']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
          OUR SERVICES
        </h2>
        <div className={styles['services-box']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
          {serviceCards.map((card) => (
            <div className={styles['servicesection-image']} key={card.title}>
              <img src={card.img} alt={card.title} />
              <h3>{card.title}</h3>
              <p>{servicesParagraph}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Services Section End */}

      {/* BUILD WITH QUALITY SECTION */}
      <div className={styles['container-buildquality']}>
        <div className={styles['content-quality']}>
          <img
            className={styles['image-quality']}
            src={buildWithQuality}
            alt="Image- build-with-quality"
            data-aos="fade-right"
            data-aos-easing="ease"
            data-aos-duration="1000"
          />
          <div className={styles['text-qualitymaterial']} data-aos="fade-down" data-aos-easing="ease" data-aos-duration="1000">
            <h1>Build With Quality Materials</h1>
            <p>
              Every project we work on we always use selected materials to give good quality to the building and
              that's what many of our customers feel after working with us, their buildings are more sturdy and
              durable.
            </p>
            <div>
              <div className={styles['button-container']}>
                <button className={styles['button-material']} onClick={() => navigate('/about')}>
                  <span> About Us</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BUILD WITH QUALITY ENDS */}

      {/* Why Choose us Section Started */}
      <section className={styles['whyChooseUs-section']}>
        <div className={styles['whychooseus-overlay']}>
          <div className={styles['whychooseus-container']}>
            <div className={styles['whychooseus-row']}>
              <div className={styles['whychooseus-coloumn']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
                <h2>Why Choose us?</h2>
                <hr />
                <br />
              </div>
            </div>
            <div className={styles['whychooseus-row']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
              {whyChooseUsRow1.map((item) => (
                <div className={styles['whychooseus-block']} key={item.title}>
                  <i className="fa-solid fa-check"></i>
                  <div className={styles['whychooseus-coloumn']}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles['whychooseus-row']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="2000">
              {whyChooseUsRow2.map((item) => (
                <div className={styles['whychooseus-block']} key={item.title}>
                  <i className="fa-solid fa-check"></i>
                  <div className={styles['whychooseus-coloumn']}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us Section Finished */}

      {/* Clients Logo Marquee Section */}
      <section className={styles['clients-marquee-section']} aria-label="Our Clients">
        <div className={styles['clients-marquee-heading']} data-aos="fade-up" data-aos-duration="1000">
          <h2>Our Clients</h2>
          <p>Trusted partners who rely on our quality and dedication.</p>
        </div>
        <div className={styles['clients-marquee']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
          <div className={styles['clients-track']}>
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <div className={styles['client-item']} key={i}>
                <img src={logo} alt={`Client logo ${(i % clientLogos.length) + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Clients Logo Marquee Section End */}

      {/* Certificates Section Start */}
      <section className={styles['certificates-section']} aria-label="Certificates">
        <div className={styles['certificates-heading']} data-aos="fade-up" data-aos-duration="1000">
          <h2>Our Certificates</h2>
          <p>Recognitions that reflect our commitment to quality and excellence.</p>
        </div>
        <div className={styles['certificates-grid']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
          {certificates.map((cert, i) => (
            <div className={styles['certificate-card']} key={i}>
              <img src={cert} alt={`Certificate ${i + 1}`} />
            </div>
          ))}
        </div>
      </section>
      {/* Certificates Section End */}

      {/* Talk with Experts Section starts */}
      <ContactExperts />
      {/* Talk with Experts Section ends */}

      {/* FAQ starts */}
      <Faq items={faqItems} />
      {/* FAQ end */}
    </>
  )
}

export default Home
