import { useState } from 'react'
import styles from './SlotBooking.module.css'

const API_ENDPOINT = 'https://welcon-ecru.vercel.app'

const NAME_FORMAT = /^[A-Z a-z]+$/
// eslint-disable-next-line no-useless-escape
const EMAIL_FORMAT = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
const PHONE_FORMAT = /^\d{10}$/
const PIN_FORMAT = /^\d{6}$/

const initialValues = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  mode: '',
  address: '',
  pinCode: '',
  message: '',
}

const errorMessages = {
  name: 'This field is required!',
  email: 'Enter a valid email address!',
  phone: 'Phone must be 10 digits long!',
  date: 'Choose a date!',
  time: 'Pick a time!',
  mode: 'Choose appointment mode!',
  address: 'Enter your address!',
  pinCode: 'Postal code must be 6 digits long!',
  message: 'Enter project details!',
}

function SlotBooking() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const [popup, setPopup] = useState({ show: false, message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const showPopup = (message) => {
    setPopup({ show: true, message })
    setTimeout(() => setPopup({ show: false, message: '' }), 4000)
  }

  const validate = () => {
    const newErrors = {}
    if (!values.name || !NAME_FORMAT.test(values.name)) newErrors.name = true
    if (!values.email || !EMAIL_FORMAT.test(values.email)) newErrors.email = true
    if (!values.phone || !PHONE_FORMAT.test(values.phone)) newErrors.phone = true
    if (!values.date) newErrors.date = true
    if (!values.time) newErrors.time = true
    if (!values.mode) newErrors.mode = true
    if (!values.address) newErrors.address = true
    if (!values.pinCode || !PIN_FORMAT.test(values.pinCode)) newErrors.pinCode = true
    if (!values.message) newErrors.message = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const response = await fetch(`${API_ENDPOINT}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      await response.json()
      showPopup('Thank you! Your booking request has been submitted successfully.')
      setValues(initialValues)
      setErrors({})
    } catch (err) {
      showPopup('Sorry, something went wrong. Please try again later.')
    }
  }

  const inputProps = (name) => ({
    name,
    id: name,
    value: values[name],
    onChange: handleChange,
    onFocus: () => setFocusedField(name),
    style: errors[name] ? { border: '1.5px solid red' } : focusedField === name ? { border: '2px solid rgb(48, 61, 203)' } : undefined,
  })

  const errorText = (name) => (
    <p style={{ display: errors[name] ? 'block' : 'none' }}>{errorMessages[name]}</p>
  )

  return (
    <>
      {/* Success / error popup */}
      <div id="formPopup" className={`${styles['form-popup']} ${popup.show ? styles.show : ''}`}>
        <div className={styles['form-popup-content']}>
          <i className="fa-solid fa-circle-check"></i>
          <p id="popupMessage">{popup.message}</p>
        </div>
      </div>

      {/* Slot Booking start */}
      <div id="infoHead">
        <h1>Book an appointment</h1>
        <h3>Book now, build your dream later.</h3>
      </div>
      <div className={styles.aptForm}>
        <div className={styles.infoMain}>
          <form id="slotForm" name="slotForm" onSubmit={handleSubmit}>
            <div className={styles['input-container']}>
              <div className={styles['form-input']}>
                <label htmlFor="name">Name <span>*</span></label>
                <div>
                  <input type="text" placeholder="Enter Your Name" {...inputProps('name')} />
                  {errorText('name')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="email">Email <span>*</span></label>
                <div>
                  <input type="email" placeholder="Enter Your Email" {...inputProps('email')} />
                  {errorText('email')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="phone">Phone <span>*</span></label>
                <div>
                  <input type="tel" placeholder="Enter Your Phone" {...inputProps('phone')} />
                  {errorText('phone')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="date">Date <span>*</span></label>
                <div>
                  <input type="date" {...inputProps('date')} />
                  {errorText('date')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="time">Time <span>*</span></label>
                <div>
                  <input type="time" {...inputProps('time')} />
                  {errorText('time')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="mode">Mode <span>*</span></label>
                <div>
                  <select {...inputProps('mode')}>
                    <option value="">Select</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  {errorText('mode')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="address">Address <span>*</span></label>
                <div>
                  <input type="text" placeholder="Enter Your Address" {...inputProps('address')} />
                  {errorText('address')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="pinCode">Postal Code <span>*</span></label>
                <div>
                  <input type="text" placeholder="Enter Your Postal Code" {...inputProps('pinCode')} />
                  {errorText('pinCode')}
                </div>
              </div>

              <div className={styles['form-input']}>
                <label htmlFor="message">Message <span>*</span></label>
                <div>
                  <textarea cols="30" rows="1" placeholder="Enter your project details here..." {...inputProps('message')}></textarea>
                  {errorText('message')}
                </div>
              </div>

              <div className={`${styles['form-input']} ${styles['empty-item']}`}></div>
              <div className={styles['form-input']} id="formBT">
                <label htmlFor="btn" style={{ visibility: 'hidden' }}>Submit</label>
                <button type="submit" id="btn" name="btn" value="submit">Submit</button>
              </div>
              <div className={`${styles['form-input']} ${styles['emptyBT-item1']}`}></div>
              <div className={`${styles['form-input']} ${styles['emptyBT-item2']}`}></div>
            </div>
          </form>
        </div>
      </div>
      {/* Slot Booking end */}
    </>
  )
}

export default SlotBooking
