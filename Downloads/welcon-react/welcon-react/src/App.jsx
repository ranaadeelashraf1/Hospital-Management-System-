import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import WhatsAppFloat from './components/WhatsAppFloat/WhatsAppFloat.jsx'
import GoToTop from './components/GoToTop/GoToTop.jsx'

import Home from './pages/Home/Home.jsx'
import ServiceSection from './pages/ServiceSection/ServiceSection.jsx'
import Repair from './pages/Repair/Repair.jsx'
import AboutUs from './pages/AboutUs/AboutUs.jsx'
import Contact from './pages/Contact/Contact.jsx'
import SlotBooking from './pages/SlotBooking/SlotBooking.jsx'

// Scrolls to a #hash on route change (matches old anchor-link behaviour),
// and scrolls to the top on a plain route change.
function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location])

  return null
}

// AOS (scroll animation library) is loaded from CDN in index.html.
function useAOS() {
  const location = useLocation()
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init()
      window.AOS.refresh()
    }
  }, [location])
}

function App() {
  useAOS()

  return (
    <>
      <div id="top" />
      <ScrollManager />
      <Navbar />
      <WhatsAppFloat />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServiceSection />} />
        <Route path="/repair" element={<Repair />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<SlotBooking />} />
      </Routes>
      <GoToTop />
      <Footer />
    </>
  )
}

export default App
