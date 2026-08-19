# Welcon Construction — React (Vite) Version

Yeh aapki original multi-page HTML/CSS/JS Welcon Construction website ka poora React
conversion hai — clean, reusable components ke sath, same visuals/behaviour ke sath.

## Project ko chalane ke liye

```bash
npm install
npm run dev
```

Phir browser mein `http://localhost:5173` open karein.

Production build:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  assets/            -> saari images (bg, certificates, clients, logo, vectors, slotBooking)
  components/
    Navbar/          -> top contact bar + desktop/mobile nav (dropdowns, hamburger menu)
    Footer/          -> shared footer
    WhatsAppFloat/    -> floating WhatsApp button
    GoToTop/         -> scroll-to-top button
    Faq/             -> reusable FAQ accordion (Home, About, Contact, Repair, Services)
    HireUsBanner/    -> reusable "Hire us" CTA banner
    ContactExperts/  -> reusable "Contact With Our Experts" CTA section
  pages/
    Home/            -> "/"
    ServiceSection/  -> "/services"
    Repair/          -> "/repair"
    AboutUs/         -> "/about"
    Contact/         -> "/contact"
    SlotBooking/     -> "/booking" (appointment form, connects to the same API)
  data/
    faqData.jsx      -> shared FAQ question/answer content
  App.jsx            -> React Router routes + AOS/scroll handling
  main.jsx           -> app entry point
```

## Notes

- Routing `react-router-dom` se hota hai; navbar links (`/services#interior-designing` jaisi)
  hash ke sath sahi section tak scroll kar dete hain (jaisa original site mein tha).
- **AOS** (scroll animations), **Swiper** (About Us hero carousel) aur **particles.js**
  (home page background) CDN se load hote hain (`index.html` mein), bilkul original
  site ki tarah — koi extra npm install nahi chahiye inke liye.
- Booking form (`/booking`) wahi validation rules follow karta hai (name/email/phone/pin
  format) aur wahi `https://welcon-ecru.vercel.app/email` API par POST karta hai jo
  original project use kar raha tha.
- Styling **CSS Modules** se hai — har component/page ka apna scoped `*.module.css` file.
- Is sandbox mein internet access disabled tha, isliye `npm install` yahan run nahi ho
  saka — apne local machine par `npm install` chalate hi sab dependencies (React, React
  Router, Vite) download ho jayengi.
