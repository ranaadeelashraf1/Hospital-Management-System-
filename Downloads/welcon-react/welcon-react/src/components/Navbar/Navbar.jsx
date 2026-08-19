import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'
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

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)
  const [isMobileRepairOpen, setIsMobileRepairOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isRepairDropdownOpen, setIsRepairDropdownOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsMobileServicesOpen(false)
    setIsMobileRepairOpen(false)
  }

  const closeDesktopMenus = () => {
    setIsServicesDropdownOpen(false)
    setIsRepairDropdownOpen(false)
  }

  const closeAllMenus = () => {
    closeMobileMenu()
    closeDesktopMenus()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((current) => !current)
  }

  const toggleDesktopDropdown = (menuType) => {
    if (isMobileView) return

    if (menuType === 'services') {
      setIsServicesDropdownOpen((current) => {
        const next = !current
        if (next) setIsRepairDropdownOpen(false)
        return next
      })
      return
    }

    setIsRepairDropdownOpen((current) => {
      const next = !current
      if (next) setIsServicesDropdownOpen(false)
      return next
    })
  }

  const renderDropdownLinks = (links, basePath, closeDropdown) => (
    <ul>
      {links.map((item) => (
        <li key={item.hash}>
          <Link to={`${basePath}#${item.hash}`} onClick={closeDropdown}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateMobileView = (event) => setIsMobileView(event.matches)

    setIsMobileView(mediaQuery.matches)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMobileView)
    } else {
      mediaQuery.addListener(updateMobileView)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMobileView)
      } else {
        mediaQuery.removeListener(updateMobileView)
      }
    }
  }, [])

  const location = useLocation()
  useEffect(() => {
    closeAllMenus()
  }, [location.pathname, location.hash])

  return (
    <>
      <div className={styles['top-contact-bar']}>
        <div className={styles['top-contact-content']}>
          <span>
            <i className="fa-solid fa-phone" /> +92 321 9536003
          </span>
          <span>
            <i className="fa-solid fa-envelope" /> info@welcongroup.com
          </span>
        </div>
      </div>

      <nav
        className={styles.navBar1}
        style={isMobileMenuOpen ? { boxShadow: '0px 24px 3px -24px gray' } : undefined}
      >
        <div className={styles.fullNav}>
          <div className={styles.logo}>
            <Link to="/" onClick={closeAllMenus}>
              <img className={styles.logoImg} src={logo} alt="Welcon logo" />
            </Link>
          </div>

          <ul className={styles.list1}>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li id="services">
              <div>
                <pre>
                  <Link to="/services">Services</Link>{' '}
                  <i
                    className="fas fa-chevron-circle-down"
                    role="button"
                    aria-label="Toggle Services submenu"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      toggleDesktopDropdown('services')
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </pre>
              </div>

              <div className={styles.drop1} style={{ display: isServicesDropdownOpen ? 'block' : undefined }}>
                <div className={styles.empty} />
                <div className={styles['non-empty']}>
                  {renderDropdownLinks(serviceLinks, '/services', () => setIsServicesDropdownOpen(false))}
                </div>
              </div>
            </li>

            <li id="repair">
              <div>
                <pre>
                  <Link to="/repair">Repairs</Link>{' '}
                  <i
                    className="fas fa-chevron-circle-down"
                    role="button"
                    aria-label="Toggle Repairs submenu"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      toggleDesktopDropdown('repair')
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </pre>
              </div>

              <div className={styles.drop2} style={{ display: isRepairDropdownOpen ? 'block' : undefined }}>
                <div className={styles.empty} />
                <div className={styles['non-empty']}>
                  {renderDropdownLinks(repairLinks, '/repair', () => setIsRepairDropdownOpen(false))}
                </div>
              </div>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          <div id="bt2">
            <button
              className={styles.hamburgerBtn}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
              style={{
                background: isMobileMenuOpen ? 'rgba(42,42,114,0.95)' : 'transparent',
                borderColor: isMobileMenuOpen ? 'rgba(255,255,255,0.12)' : 'rgba(42,42,114,0.12)',
              }}
            >
              <i
                className={isMobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'}
                style={{ color: isMobileMenuOpen ? '#ffffff' : '#2a2a72', fontSize: 22 }}
              />
            </button>
          </div>
        </div>
      </nav>

      <div id="mobNavParent">
        {isMobileView && (
          <>
            <div
              className={styles['mobile-backdrop']}
              onClick={closeMobileMenu}
              style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
            />

            <nav
              className={`${styles.navBar2} ${isMobileMenuOpen ? styles.navOpen : styles.navClose}`}
              style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
            >
              <ul className={styles.list2}>
                <li>
                  <Link to="/" onClick={closeAllMenus}>
                    Home
                  </Link>
                </li>

                <li>
                  <div
                    id="services2"
                    onClick={() => {
                      setIsMobileServicesOpen((current) => {
                        const next = !current
                        if (next) setIsMobileRepairOpen(false)
                        return next
                      })
                    }}
                  >
                    <pre>
                      <Link to="/services" onClick={closeMobileMenu}>
                        Services
                      </Link>{' '}
                      <i
                        id="ser"
                        className={isMobileServicesOpen ? 'fas fa-chevron-circle-up' : 'fas fa-chevron-circle-down'}
                      />
                    </pre>
                  </div>

                  <div className={styles.drop3} style={{ display: isMobileServicesOpen ? 'block' : 'none' }}>
                    <div className={styles.empty} />
                    <div>
                      {renderDropdownLinks(serviceLinks, closeMobileMenu, '/services')}
                    </div>
                  </div>
                </li>

                <li>
                  <div
                    id="repair2"
                    onClick={() => {
                      setIsMobileRepairOpen((current) => {
                        const next = !current
                        if (next) setIsMobileServicesOpen(false)
                        return next
                      })
                    }}
                  >
                    <pre>
                      <Link to="/repair" onClick={closeMobileMenu}>
                        Repairs
                      </Link>{' '}
                      <i
                        id="rep"
                        className={isMobileRepairOpen ? 'fas fa-chevron-circle-up' : 'fas fa-chevron-circle-down'}
                      />
                    </pre>
                  </div>

                  <div className={styles.drop4} style={{ display: isMobileRepairOpen ? 'block' : 'none' }}>
                    <div className={styles.empty} />
                    <div>
                      {renderDropdownLinks(repairLinks, closeMobileMenu, '/repair')}
                    </div>
                  </div>
                </li>

                <li>
                  <Link to="/about" onClick={closeMobileMenu}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={closeMobileMenu}>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </>
  )
}

export default Navbar
