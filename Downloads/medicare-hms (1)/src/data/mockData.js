export const currentUser = {
  name: "Dr. Ayesha Raza",
  role: "Administrator",
  email: "ayesha.raza@medicare.hospital",
  avatar: "AR",
};

// The logged-in patient for the Patient Portal demo
export const currentPatient = {
  id: "PT-2201",
  name: "Ali Hassan",
  age: 34,
  gender: "Male",
  phone: "+92 300 1234567",
  email: "ali.hassan@example.com",
  address: "House 12, Gulberg III, Lahore",
  bloodGroup: "O+",
  department: "Cardiology",
  status: "Admitted",
  avatar: "AH",
};

// The logged-in doctor for the Doctor Portal demo
export const currentDoctor = {
  id: "DR-101",
  name: "Dr. Farhan Iqbal",
  specialization: "Cardiologist",
  experience: "14 yrs",
  phone: "+92 321 1112233",
  email: "farhan.iqbal@medicare.hospital",
  availability: "Mon–Fri, 9am–3pm",
  department: "Cardiology",
  rating: 4.9,
  status: "Available",
  avatar: "FI",
};

export const statCards = [
  { id: 1, label: "Total Patients", value: 3248, change: "+8.2%", trend: "up", spark: [4, 6, 5, 8, 7, 9, 12] },
  { id: 2, label: "Total Doctors", value: 86, change: "+2.1%", trend: "up", spark: [3, 3, 4, 4, 5, 5, 6] },
  { id: 3, label: "Today's Appointments", value: 47, change: "-3.4%", trend: "down", spark: [9, 8, 10, 7, 6, 8, 5] },
  { id: 4, label: "Total Revenue", value: "$128,430", change: "+14.6%", trend: "up", spark: [4, 5, 6, 6, 8, 10, 13] },
];

export const revenueTrend = [
  { month: "Jan", revenue: 62000, appointments: 210 },
  { month: "Feb", revenue: 71000, appointments: 240 },
  { month: "Mar", revenue: 68000, appointments: 225 },
  { month: "Apr", revenue: 80000, appointments: 265 },
  { month: "May", revenue: 95000, appointments: 300 },
  { month: "Jun", revenue: 89000, appointments: 280 },
  { month: "Jul", revenue: 112000, appointments: 330 },
  { month: "Aug", revenue: 128430, appointments: 360 },
];

export const departmentSplit = [
  { name: "Cardiology", value: 28, color: "#2563eb" },
  { name: "Neurology", value: 18, color: "#0d9488" },
  { name: "Orthopedics", value: 22, color: "#60a5fa" },
  { name: "Pediatrics", value: 16, color: "#5eead4" },
  { name: "Dermatology", value: 16, color: "#93c5fd" },
];

export const departments = [
  { id: 1, name: "Cardiology", head: "Dr. Farhan Iqbal", doctors: 12, patients: 480, icon: "HeartPulse" },
  { id: 2, name: "Neurology", head: "Dr. Sana Malik", doctors: 8, patients: 260, icon: "Brain" },
  { id: 3, name: "Orthopedics", head: "Dr. Bilal Khan", doctors: 10, patients: 390, icon: "Bone" },
  { id: 4, name: "Pediatrics", head: "Dr. Hina Shaikh", doctors: 9, patients: 520, icon: "Baby" },
  { id: 5, name: "Dermatology", head: "Dr. Omar Siddiqui", doctors: 6, patients: 210, icon: "Sparkles" },
  { id: 6, name: "Radiology", head: "Dr. Zara Ahmed", doctors: 7, patients: 175, icon: "Scan" },
];

export const patients = [
  { id: "PT-2201", name: "Ali Hassan", age: 34, gender: "Male", phone: "+92 300 1234567", department: "Cardiology", status: "Admitted", lastVisit: "2026-07-28", avatar: "AH" },
  { id: "PT-2202", name: "Mariam Farooq", age: 27, gender: "Female", phone: "+92 301 2345678", department: "Dermatology", status: "Outpatient", lastVisit: "2026-08-01", avatar: "MF" },
  { id: "PT-2203", name: "Usman Tariq", age: 52, gender: "Male", phone: "+92 302 3456789", department: "Orthopedics", status: "Discharged", lastVisit: "2026-07-15", avatar: "UT" },
  { id: "PT-2204", name: "Fatima Noor", age: 8, gender: "Female", phone: "+92 303 4567890", department: "Pediatrics", status: "Admitted", lastVisit: "2026-08-03", avatar: "FN" },
  { id: "PT-2205", name: "Hamza Sheikh", age: 45, gender: "Male", phone: "+92 304 5678901", department: "Neurology", status: "Outpatient", lastVisit: "2026-07-30", avatar: "HS" },
  { id: "PT-2206", name: "Ayesha Malik", age: 61, gender: "Female", phone: "+92 305 6789012", department: "Cardiology", status: "Discharged", lastVisit: "2026-07-10", avatar: "AM" },
  { id: "PT-2207", name: "Bilal Ahmed", age: 30, gender: "Male", phone: "+92 306 7890123", department: "Radiology", status: "Outpatient", lastVisit: "2026-08-02", avatar: "BA" },
  { id: "PT-2208", name: "Sana Yousaf", age: 19, gender: "Female", phone: "+92 307 8901234", department: "Dermatology", status: "Admitted", lastVisit: "2026-08-04", avatar: "SY" },
];

export const doctors = [
  { id: "DR-101", name: "Dr. Farhan Iqbal", specialization: "Cardiologist", experience: "14 yrs", phone: "+92 321 1112233", email: "farhan.iqbal@medicare.hospital", availability: "Mon–Fri, 9am–3pm", rating: 4.9, status: "Available", avatar: "FI" },
  { id: "DR-102", name: "Dr. Sana Malik", specialization: "Neurologist", experience: "11 yrs", phone: "+92 322 2223344", email: "sana.malik@medicare.hospital", availability: "Mon–Thu, 10am–4pm", rating: 4.8, status: "On Leave", avatar: "SM" },
  { id: "DR-103", name: "Dr. Bilal Khan", specialization: "Orthopedic Surgeon", experience: "18 yrs", phone: "+92 323 3334455", email: "bilal.khan@medicare.hospital", availability: "Tue–Sat, 8am–2pm", rating: 4.7, status: "Available", avatar: "BK" },
  { id: "DR-104", name: "Dr. Hina Shaikh", specialization: "Pediatrician", experience: "9 yrs", phone: "+92 324 4445566", email: "hina.shaikh@medicare.hospital", availability: "Mon–Sat, 11am–6pm", rating: 5.0, status: "Available", avatar: "HS" },
  { id: "DR-105", name: "Dr. Omar Siddiqui", specialization: "Dermatologist", experience: "7 yrs", phone: "+92 325 5556677", email: "omar.siddiqui@medicare.hospital", availability: "Mon–Fri, 1pm–7pm", rating: 4.6, status: "In Surgery", avatar: "OS" },
  { id: "DR-106", name: "Dr. Zara Ahmed", specialization: "Radiologist", experience: "12 yrs", phone: "+92 326 6667788", email: "zara.ahmed@medicare.hospital", availability: "Mon–Fri, 9am–5pm", rating: 4.8, status: "Available", avatar: "ZA" },
];

export const appointments = [
  { id: "AP-501", patient: "Ali Hassan", doctor: "Dr. Farhan Iqbal", department: "Cardiology", date: "2026-08-05", time: "09:30 AM", status: "Confirmed" },
  { id: "AP-502", patient: "Mariam Farooq", doctor: "Dr. Omar Siddiqui", department: "Dermatology", date: "2026-08-05", time: "10:15 AM", status: "Pending" },
  { id: "AP-503", patient: "Usman Tariq", doctor: "Dr. Bilal Khan", department: "Orthopedics", date: "2026-08-05", time: "11:00 AM", status: "Completed" },
  { id: "AP-504", patient: "Fatima Noor", doctor: "Dr. Hina Shaikh", department: "Pediatrics", date: "2026-08-05", time: "01:30 PM", status: "Confirmed" },
  { id: "AP-505", patient: "Hamza Sheikh", doctor: "Dr. Sana Malik", department: "Neurology", date: "2026-08-06", time: "02:00 PM", status: "Cancelled" },
  { id: "AP-506", patient: "Ayesha Malik", doctor: "Dr. Farhan Iqbal", department: "Cardiology", date: "2026-08-06", time: "03:15 PM", status: "Confirmed" },
  { id: "AP-507", patient: "Bilal Ahmed", doctor: "Dr. Zara Ahmed", department: "Radiology", date: "2026-08-07", time: "09:00 AM", status: "Pending" },
];

export const prescriptions = [
  {
    id: "RX-9001",
    patient: "Ali Hassan",
    doctor: "Dr. Farhan Iqbal",
    date: "2026-07-28",
    diagnosis: "Hypertension, Stage 1",
    medicines: [
      { name: "Amlodipine", dosage: "5mg, once daily", duration: "30 days" },
      { name: "Atorvastatin", dosage: "10mg, at night", duration: "30 days" },
    ],
    instructions: "Low-sodium diet. Monitor blood pressure twice daily. Follow up in 4 weeks.",
  },
  {
    id: "RX-9002",
    patient: "Fatima Noor",
    doctor: "Dr. Hina Shaikh",
    date: "2026-08-03",
    diagnosis: "Acute Viral Fever",
    medicines: [
      { name: "Paracetamol Syrup", dosage: "5ml, every 6 hours", duration: "5 days" },
      { name: "ORS Sachets", dosage: "1 sachet after each loose stool", duration: "as needed" },
    ],
    instructions: "Ensure adequate fluid intake. Return if fever persists beyond 3 days.",
  },
  {
    id: "RX-9003",
    patient: "Mariam Farooq",
    doctor: "Dr. Omar Siddiqui",
    date: "2026-08-01",
    diagnosis: "Contact Dermatitis",
    medicines: [
      { name: "Hydrocortisone Cream", dosage: "Apply thin layer, twice daily", duration: "14 days" },
      { name: "Cetirizine", dosage: "10mg, once daily", duration: "10 days" },
    ],
    instructions: "Avoid known allergens. Do not scratch affected area.",
  },
];

export const billing = [
  { id: "INV-3001", patient: "Ali Hassan", department: "Cardiology", amount: 12500, date: "2026-07-28", status: "Paid" },
  { id: "INV-3002", patient: "Mariam Farooq", department: "Dermatology", amount: 4200, date: "2026-08-01", status: "Paid" },
  { id: "INV-3003", patient: "Usman Tariq", department: "Orthopedics", amount: 28900, date: "2026-07-15", status: "Unpaid" },
  { id: "INV-3004", patient: "Fatima Noor", department: "Pediatrics", amount: 3100, date: "2026-08-03", status: "Pending" },
  { id: "INV-3005", patient: "Hamza Sheikh", department: "Neurology", amount: 15600, date: "2026-07-30", status: "Unpaid" },
  { id: "INV-3006", patient: "Ayesha Malik", department: "Cardiology", amount: 21000, date: "2026-07-10", status: "Paid" },
];

export const notifications = [
  { id: 1, title: "New appointment booked", detail: "Ali Hassan booked a slot with Dr. Farhan Iqbal", time: "5 min ago", unread: true },
  { id: 2, title: "Lab results ready", detail: "Fatima Noor's blood work has been uploaded", time: "42 min ago", unread: true },
  { id: 3, title: "Invoice overdue", detail: "INV-3003 for Usman Tariq is 3 days overdue", time: "2 hrs ago", unread: false },
  { id: 4, title: "Doctor on leave", detail: "Dr. Sana Malik marked unavailable till Aug 8", time: "1 day ago", unread: false },
];

export const recentPatients = patients.slice(0, 5);
