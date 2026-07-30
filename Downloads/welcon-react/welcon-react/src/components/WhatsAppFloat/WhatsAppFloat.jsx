import styles from './WhatsAppFloat.module.css'

function WhatsAppFloat() {
  return (
    <a
      className={styles['whatsapp-float']}
      href="https://wa.me/923219536003"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  )
}

export default WhatsAppFloat
