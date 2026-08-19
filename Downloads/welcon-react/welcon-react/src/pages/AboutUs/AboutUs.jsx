import { useEffect } from 'react'
import styles from './AboutUs.module.css'
import Faq from '../../components/Faq/Faq.jsx'
import HireUsBanner from '../../components/HireUsBanner/HireUsBanner.jsx'
import { faqItems } from '../../data/faqData.jsx'

import visionImg from '../../assets/vectors/vision.webp'
import officeImg from '../../assets/vectors/office.webp'
import missionImg from '../../assets/vectors/mission.webp'
import safetyImg from '../../assets/vectors/safety-1.png'

const safetySteps = [
  'Safety training and education',
  'Use of Personal protective equipment (PPE)',
  'Emergency preparedness',
  'Equipment safety Assurance',
  'Fall protection',
  'Hazardous materials management',
  'Regular inspections and audits to ensure compliance with safety standards',
]

function AboutUs() {
  // Initialize the Swiper hero carousel (loaded globally from CDN, see index.html)
  useEffect(() => {
    let swiperInstance
    if (window.Swiper) {
      swiperInstance = new window.Swiper('.swiper', {
        loop: true,
        pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
        autoplay: { delay: 5000, disableOnInteraction: false },
      })
    }
    return () => {
      if (swiperInstance) swiperInstance.destroy(true, true)
    }
  }, [])

  return (
    <>
      {/* Hero Section */}
      <div className="swiper" style={{ zIndex: 0 }}>
        <div className="swiper-wrapper">
          {[1, 2, 3, 4, 5].map((n) => (
            <div className={`swiper-slide ${styles['hero-bg']}`} id={`slide-${n}`} key={n}>
              <div className={styles['hero-heading']}>
                <h1>About Us</h1>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-pagination"></div>
      </div>
      {/* Hero Section End */}

      {/* About name */}
      <section className={styles.aboutus}>
        <p><a href="/">Home</a> / About us</p>
      </section>
      {/* About name end */}

      {/* How it Started Section Started */}
      <section className={styles['how-it-started']}>
        <h1 data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">How it Started</h1>
        <p data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
          Welcon Construction began with a commitment to deliver high-quality projects through practical innovation,
          sustainable design, and careful execution. Our goal is to provide clients with reliable, cost-effective
          solutions that align with their long-term vision.
        </p>
      </section>
      {/* How it Started Section End */}

      {/* Vision Section Started */}
      <section className={styles.vision}>
        <div className={styles['vision-container']}>
          <div className={styles['vision-content']} data-aos="fade-down" data-aos-easing="ease" data-aos-duration="1000">
            <h1>Our Vision</h1>
            <p>
              To be recognized as a trusted construction partner offering complete solutions from concept through
              completion, supported by safety, quality, and transparency.
            </p>
          </div>
          <div className={styles['vision-content']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
            <img src={visionImg} alt="Illustration of vision" />
          </div>
        </div>
      </section>
      {/* Vision Section End */}

      {/* Meet Section Start */}
      <section className={styles.meet}>
        <div className={styles['meet-container']}>
          <div className={styles['meet-content']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
            <h1>See. Touch. Experience.</h1>
            <p>
              Visit our Experience Centre to explore real project showcases, review material selections, and
              experience our approach to design and execution.
            </p>
            <p>
              <a href="mailto:info@welcongroup.com">Request a consultation <i className="fa-solid fa-arrow-right"></i></a>
            </p>
          </div>
          <div className={styles['meet-content']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
            <img src={officeImg} alt="Welcon office experience" />
          </div>
        </div>
      </section>
      {/* Meet Section End */}

      {/* Mission Section Start */}
      <section className={styles.mission}>
        <div className={styles['mission-container']}>
          <div className={styles['mission-content']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
            <img src={missionImg} alt="mission illustration" />
          </div>
          <div className={styles['mission-content']} data-aos="fade-down" data-aos-easing="ease" data-aos-duration="1000">
            <h1>Our Mission</h1>
            <p>
              We aim to establish Welcon Construction as a leading EPC organization by delivering safe, efficient,
              and sustainable projects locally and abroad.
            </p>
          </div>
        </div>
      </section>
      {/* Mission Section End */}

      {/* Values Section Start */}
      <section className={styles.values}>
        <div className={styles['values-container']}>
          <div className={styles['values-content']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
            <h1>Our Values</h1>
            <p>
              We foster a culture of professionalism, teamwork, and accountability. Our approach encourages
              continuous learning, strong communication, and a consistent commitment to safety and quality.
            </p>
          </div>
        </div>
      </section>
      {/* Values Section End */}

      {/* About Company Section Start */}
      <section className={styles['about-company']}>
        <div className={styles['about-company-container']}>
          <div className={styles['about-company-content']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
            <p>
              Welcon Construction is built around a dedicated team of construction specialists. Our integrated
              delivery model combines planning, engineering, procurement, construction, quality control, and HSE
              management to ensure that every project meets client expectations.
            </p>
            <p>
              Our team collaborates closely with clients and partners to deliver practical, cost-effective solutions.
              We focus on technical excellence, proactive communication, and disciplined execution to drive better
              project outcomes.
            </p>
          </div>
        </div>
      </section>
      {/* About Company Section End */}

      {/* Safety Section Start */}
      <section className={styles.meet}>
        <div className={styles['meet-container']}>
          <div className={styles['meet-content']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
            <h1>Our Commitment to Safety</h1>
            <p>
              <b>Your safety is most important to US</b>
              <br />
              We understand that safety is paramount, and we have made it our top priority. Here are some of the key
              steps we have taken to ensure your safety.
            </p>
            <br />
            <ul>
              {safetySteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
          <div className={styles['meet-content']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
            <img src={safetyImg} alt="" height="550" width="50" />
          </div>
        </div>
      </section>
      {/* Safety Section End */}

      {/* FAQ starts */}
      <Faq items={faqItems} />
      {/* FAQ end */}

      {/* Hire Us Section */}
      <HireUsBanner />
    </>
  )
}

export default AboutUs
