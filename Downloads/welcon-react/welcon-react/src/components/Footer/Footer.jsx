import styles from './Footer.module.css'
import logo from '../../assets/logo/welcon_logo_resized.png'

const serviceLinks = [
  { hash: 'interior-designing', label: 'Interior Designing' },
  { hash: 'construction-management', label: 'Construction Management' },
  { hash: 'consultancy-services', label: 'Consultancy Services' },
  { hash: 'environmental-service', label: 'Environmental Services' },
  { hash: 'retrofication', label: 'Retrofication' },
  { hash: 'destructive', label: 'Destructive & NDT Testing' },
]

const repairLinks = [
  { hash: 'home-repair', label: 'Home Repairs' },
  { hash: 'kitchen-repair', label: 'Kitchen Repairs' },
  { hash: 'bathroom-repair', label: 'Bathroom Repair' },
  { hash: 'furniture-repair', label: 'Furniture Repair' },
  { hash: 'plumbing', label: 'Plumbing & Pipes' },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={`${styles['footer-col']} ${styles['footer-brand']}`}>
            <div className={styles['footer-logo']}>
              <img src={logo} alt="Welcon logo" />
            </div>
            <div className={styles['social-links']}>
              <a href="#top"><i className="fab fa-facebook-f"></i></a>
              <a href="#top"><i className="fab fa-twitter"></i></a>
              <a href="#top"><i className="fab fa-instagram"></i></a>
              <a href="#top"><i className="fab fa-linkedin-in"></i></a>
              <a href="#top"><i className="fab fa-github"></i></a>
            </div>
          </div>

          <div className={`${styles['footer-col']} ${styles.service}`}>
            <h4>Services</h4>
            <ul>
              {serviceLinks.map((item) => (
                <li key={item.hash}>
                  <a href={`/services#${item.hash}`}>
                    <i className="fa-solid fa-angle-right"></i> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles['footer-col']} ${styles.repair}`}>
            <h4>Repairs</h4>
            <ul>
              {repairLinks.map((item) => (
                <li key={item.hash}>
                  <a href={`/repair#${item.hash}`}>
                    <i className="fa-solid fa-angle-right"></i> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles['footer-col']} ${styles.contact}`}>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:info@welcongroup.com">
                  <i className="fa-solid fa-envelope"></i> info@welcongroup.com
                </a>
              </li>
              <li>
                <a href="tel:+923219536003"><i className="fa-solid fa-phone"></i> +92 3219536003</a>
              </li>
              <li>
                <a href="tel:+923004451561"><i className="fa-solid fa-phone"></i> +92 3004451561</a>
              </li>
              <li>
                <a href="tel:+924237864003"><i className="fa-solid fa-phone"></i> +92 4237864003</a>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ margin: '0 auto', width: '90%', marginTop: '10px' }} />

        <div>
          <div className={styles['footer-copyright']}>
            Copyright &#169; {year} <a href="https://welcon-ecru.vercel.app/">Welcon Group</a>, All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
