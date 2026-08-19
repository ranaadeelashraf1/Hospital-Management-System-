# MediCare — Hospital Management System UI

A modern, responsive Hospital Management System interface built with **React (Vite)** and **Tailwind CSS v4**.

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4 (custom design tokens via `@theme`)
- React Router v6 for routing
- Recharts for charts (revenue trend, department split, appointments)
- Framer Motion for animations/micro-interactions
- Lucide React for icons
- react-hot-toast for toast notifications

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`. Starts on `/login`.

To build for production:
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Card, Badge, Modal, Pagination, Input, Skeleton, StatCard, Logo
│   ├── layout/       # Sidebar, Navbar, Footer, MainLayout
│   └── charts/       # RevenueChart, DepartmentDonut
├── pages/            # Login, Register, Dashboard, Patients, Doctors, Departments,
│                      # Appointments, Prescriptions, Billing, Reports, Profile, Settings
├── data/
│   └── mockData.js   # All mock/sample data — swap with real API calls
├── index.css         # Design tokens (colors, fonts, shadows) via Tailwind v4 @theme
└── App.jsx           # Routes
```

## Design Notes
- **Palette**: primary blue (`#2563eb`), teal accent (`#0d9488`), slate grays — clean clinical feel.
- **Type**: Sora for headings, Inter for body text, JetBrains Mono for IDs/numbers/data.
- **Signature motif**: an animated ECG "vitals pulse" line used in the logo and login/register illustration panels.
- All data in `src/data/mockData.js` is mock/sample — connect to your backend API by replacing the imports with real fetch/axios calls.

## Notes for Production Use
- Login/Register currently simulate a network call and redirect — wire up real auth (JWT, sessions, etc.) before shipping.
- Add route guards (redirect to `/login` if unauthenticated) once auth is wired in.
- Dark mode toggle in Settings is UI-only — hook it into a theme context + Tailwind `dark:` classes to make it functional site-wide.
