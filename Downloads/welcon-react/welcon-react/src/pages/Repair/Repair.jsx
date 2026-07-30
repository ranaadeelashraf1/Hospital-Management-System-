import styles from './Repair.module.css'
import Faq from '../../components/Faq/Faq.jsx'
import HireUsBanner from '../../components/HireUsBanner/HireUsBanner.jsx'
import { faqItems } from '../../data/faqData.jsx'

import homeRepairImg from '../../assets/vectors/home-repair.webp'
import kitchenImg from '../../assets/vectors/kitchen.webp'
import bathroomImg from '../../assets/vectors/bathroom-repair.webp'
import furnitureImg from '../../assets/vectors/furniture-repair.webp'
import plumberImg from '../../assets/vectors/plumber_1.webp'

const repairSections = [
  {
    id: 'home-repair',
    variant: 1,
    imgFirst: true,
    title: 'Home Repair',
    img: homeRepairImg,
    alt: 'Home Repair',
    text: 'Home repair refers to the process of fixing or improving damaged or broken parts of a house, such as walls, roofs, plumbing, electrical systems, and more. It can range from small, routine repairs like fixing a leaky faucet or patching a hole in the wall, to complex projects like replacing a roof or renovating a bathroom.',
  },
  {
    id: 'kitchen-repair',
    variant: 0,
    imgFirst: false,
    title: 'Kitchen Repair',
    img: kitchenImg,
    alt: 'Kitchen Repair',
    text: 'Kitchen repair involves fixing or replacing damaged or broken parts of a kitchen, such as cabinets, countertops, appliances, plumbing, and electrical systems. Common kitchen repairs include fixing leaky faucets, repairing or replacing broken cabinets or drawers, repairing appliances, and fixing or replacing damaged flooring.',
  },
  {
    id: 'bathroom-repair',
    variant: 1,
    imgFirst: true,
    title: 'Bathroom Repair',
    img: bathroomImg,
    alt: 'Bathroom Repair',
    text: 'Bathroom repair involves fixing or replacing damaged or broken parts of a bathroom, such as the toilet, sink, shower, bathtub, flooring, and plumbing. Common bathroom repairs include fixing leaks, repairing or replacing damaged tiles or flooring, repairing or replacing broken fixtures, and unclogging drains. Proper and timely bathroom repair is important to maintain the safety, functionality, and value of a home.',
  },
  {
    id: 'furniture-repair',
    variant: 0,
    imgFirst: false,
    title: 'Furniture Repair',
    img: furnitureImg,
    alt: 'Furniture Repair',
    text: 'Furniture repair involves fixing or restoring damaged or broken furniture pieces. Common furniture repairs include fixing or replacing broken legs or arms, repairing or replacing damaged upholstery or cushions, and repairing or replacing broken drawers or hardware. Proper and timely furniture repair is important to maintain the functionality and aesthetic appeal of furniture pieces, and to ensure their longevity.',
  },
  {
    id: 'plumbing',
    variant: 1,
    imgFirst: true,
    title: 'Plumbing and Pipes',
    img: plumberImg,
    alt: 'Plumbing and Pipes',
    text: 'Plumbing and pipes are an essential part of any building\u2019s infrastructure, responsible for carrying water and other liquids throughout the building. Regular maintenance and repair of plumbing and pipes are essential to prevent leaks, water damage, and other issues. Common plumbing and pipe problems include leaks, clogs, broken pipes, and low water pressure.',
  },
]

function RepairBlock({ section }) {
  const sectionClass = section.variant === 1 ? styles['home-repair1'] : styles['home-repair']
  const containerClass = section.variant === 1 ? styles['home-repair-container1'] : styles['home-repair-container']
  const colClass = section.variant === 1 ? styles['home-repair-col1'] : styles['home-repair-col']

  const textBlock = (
    <div className={colClass} data-aos="fade-up" data-aos-easing="ease" data-aos-duration="1000">
      <h1>{section.title}</h1>
      <p>{section.text}</p>
      <button onClick={() => { window.location.href = '/booking' }}>
        <span> Book appointment</span>
      </button>
    </div>
  )
  const imageBlock = (
    <div className={colClass} data-aos="fade-right" data-aos-easing="ease" data-aos-duration="1000">
      <img src={section.img} alt={section.alt} />
    </div>
  )

  return (
    <section id={section.id} className={sectionClass}>
      <div className={containerClass}>
        {section.imgFirst ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  )
}

function Repair() {
  return (
    <>
      {/* Hero Section Start */}
      <section className={styles.hero}>
        <div className={styles['hero-overlay']}>
          <div className={styles['hero-heading']}>Improvement & Repair</div>
        </div>
      </section>
      {/* Hero Section End */}

      {/* Repair name */}
      <section style={{ padding: '20px' }}>
        <p><a href="/">Home</a> / Improvement & Repair</p>
      </section>
      {/* Repair name end */}

      {/* repair sections */}
      {repairSections.map((section) => (
        <RepairBlock section={section} key={section.id} />
      ))}
      {/* repair sections end */}

      {/* FAQ starts */}
      <Faq items={faqItems} />
      {/* FAQ end */}

      {/* Hire Us Section */}
      <HireUsBanner />
    </>
  )
}

export default Repair
