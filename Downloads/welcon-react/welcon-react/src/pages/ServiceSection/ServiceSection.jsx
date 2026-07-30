import styles from './ServiceSection.module.css'
import Faq from '../../components/Faq/Faq.jsx'
import HireUsBanner from '../../components/HireUsBanner/HireUsBanner.jsx'
import { faqItems } from '../../data/faqData.jsx'

import servicenew from '../../assets/bg/servicenew.jpg'
import hotel from '../../assets/bg/hotel.webp'
import houseconstruction from '../../assets/bg/houseconstruction.webp'
import hospital from '../../assets/bg/hospital.webp'
import falts from '../../assets/bg/falts.webp'
import school from '../../assets/bg/school.webp'
import roads from '../../assets/bg/roads.webp'
import interiorImg from '../../assets/bg/interior.webp'
import constructionManagement from '../../assets/bg/constructionmanagement.webp'
import preconstruction from '../../assets/bg/preconstruction.webp'
import retro from '../../assets/bg/retro.webp'

const featuredWork = [
  { img: hotel, label: 'Hotel Construction' },
  { img: houseconstruction, label: 'House Construction' },
  { img: hospital, label: 'HealthCare' },
  { img: falts, label: 'Flats' },
  { img: school, label: 'School Construction' },
  { img: roads, label: 'Road Construction' },
]

const serviceDetails = [
  {
    id: 'interior-designing',
    layout: 'left',
    title: 'INTERIOR DESIGNING',
    img: interiorImg,
    text: 'Welcon delivers interior design solutions that balance form, function, and budget. We create interiors that reflect your identity while optimizing circulation, finishes, lighting, and material selection for a cohesive built environment.',
  },
  {
    id: 'construction-management',
    layout: 'right',
    title: 'CONSTRUCTION MANAGEMENT',
    img: constructionManagement,
    text: 'Our construction management services keep projects on schedule and under control. We manage procurement, scheduling, quality assurance, and subcontractor coordination from planning through handover.',
  },
  {
    id: 'consultancy-services',
    layout: 'left',
    title: 'CONSULTANCY SERVICES',
    img: preconstruction,
    text: 'Welcon offers construction consulting expertise to help clients assess risk, estimate costs, and optimize project delivery. Our consultants provide practical guidance across planning, permitting, quality assurance, and sustainability.',
  },
  {
    id: 'environmental-service',
    layout: 'right',
    title: 'ENVIRONMENTAL SERVICE',
    img: preconstruction,
    text: 'Our environmental service offering includes landscaping, ecological restoration, and sustainable site design. We focus on creating outdoor spaces that add long-term value and support biodiversity and wellbeing.',
  },
  {
    id: 'retrofication',
    layout: 'left',
    title: 'RETROFICATION',
    img: retro,
    text: 'Retrofication upgrades existing buildings with modern systems and efficient solutions. We help clients improve energy performance, reduce operating costs, and extend asset lifespan through targeted retrofits.',
  },
  {
    id: 'destructive',
    layout: 'right',
    title: 'DESTRUCTIVE AND NDT TESTING',
    img: preconstruction,
    text: (
      <>
        Destructive and non-destructive testing (NDT) help verify the reliability of materials, systems, and structural
        components. Our testing services support safe, compliant construction by identifying defects and confirming
        performance under real-world conditions.
      </>
    ),
  },
]

function ServiceDetailSection({ service }) {
  const isLeftLayout = service.layout === 'left'
  const wrapperClass = isLeftLayout ? styles.cont : styles['cont-right']
  const contentClass = isLeftLayout ? styles['contents-cont'] : styles['contents-right']
  const textClass = isLeftLayout ? styles['inner-items'] : styles['inner-itemsleft']
  const imageAnimation = isLeftLayout ? 'fade-right' : 'fade-down'
  const textAnimation = isLeftLayout ? 'fade-up' : 'fade-right'

  return (
    <section id={service.id} className={styles.serviceSection}>
      <div className={wrapperClass}>
        <div className={contentClass}>
          {isLeftLayout && (
            <img src={service.img} alt={service.title} data-aos={imageAnimation} data-aos-easing="ease" data-aos-duration="1000" />
          )}
          <div className={textClass} data-aos={textAnimation} data-aos-easing="ease" data-aos-duration="1000">
            <h1>{service.title}</h1>
            <p>{service.text}</p>
          </div>
          {!isLeftLayout && (
            <img src={service.img} alt={service.title} data-aos={imageAnimation} data-aos-easing="ease" data-aos-duration="1000" />
          )}
        </div>
      </div>
    </section>
  )
}

function ServiceSection() {
  return (
    <>
      {/* OUR SERVICES PAGE STARTS */}
      <div className={styles['serviceimg-container']}>
        <img src={servicenew} alt="SERVICES" />
        <div className={styles['OUR-services']}>SERVICES</div>
      </div>

      {/* FEATURED WORK STARTS */}
      <div className={styles['feature-box']}>
        <h1 className={styles['heading-featurebox']} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
          Featured Work
        </h1>
        <div className={styles['work-gallery']} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
          {featuredWork.map((item) => (
            <div className={styles.imagegallery} key={item.label}>
              <img src={item.img} alt={item.label} />
              <div className={styles['image-text1']}>
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* FEATURED WORK ENDS */}

      {/* service detail sections */}
      {serviceDetails.map((service) => (
        <ServiceDetailSection service={service} key={service.id} />
      ))}
      {/* OUR SERVICES PAGE ENDS */}

      {/* FAQ starts */}
      <Faq items={faqItems} />
      {/* FAQ end */}

      {/* Hire Us Section */}
      <HireUsBanner />
    </>
  )
}

export default ServiceSection
