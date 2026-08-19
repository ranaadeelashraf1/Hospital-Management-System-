<<<<<<< HEAD
# Hospital-Management-System-
=======
# MediCare — Hospital Management System (Frontend)

A modern, responsive Hospital Management System UI built with **React (Vite)** and **Tailwind CSS v4**,
connected to the companion `hms-backend` REST API. Three portals — **Admin**, **Doctor**, and **Patient** —
each with real login, role-based routing, and live data.

> This folder is the frontend only. The backend lives in the sibling `hms-backend/` folder — see the
> top-level `SETUP.md` (one level up) for how to run both together.

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4 (custom design tokens via `@theme`)
- React Router v6 — routing + role-based route guards
- **Axios** — API client, wired to `hms-backend`
- Recharts — charts (revenue trend, department split)
- Framer Motion — animations/micro-interactions
- Lucide React — icons
- react-hot-toast — toast notifications

## Getting Started

```bash
npm install
cp .env.example .env   # set VITE_API_URL if your backend isn't on localhost:5000
npm run dev
```

App runs at `http://localhost:5173`, starting on `/login`. **The backend must be running** (see
`../hms-backend/README.md`) for login, registration, and every data page to work.

To build for production:
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/              # Axios wrappers per resource: auth, patients, doctors, departments,
│                      # appointments, prescriptions, billing — all call hms-backend
├── context/
│   └── AuthContext.jsx   # login/register/logout, current user, token persistence
├── components/
│   ├── ui/            # Button, Card, Badge, Modal, Pagination, Input, Skeleton, StatCard, Logo
│   ├── layout/         # Sidebar/Navbar per portal (admin, doctor, patient) + MainLayout wrappers
│   ├── charts/          # RevenueChart, DepartmentDonut
│   └── routing/
│       └── ProtectedRoute.jsx   # role-based route guard
├── pages/              # Admin pages (Dashboard, Patients, Doctors, Departments, Appointments,
│                        # Prescriptions, Billing, Reports, Profile, Settings)
│   ├── doctor/           # Doctor portal pages
│   └── patient/           # Patient portal pages
├── data/
│   └── mockData.js     # Only still used by Reports.jsx (illustrative charts) and the admin
│                        # navbar's static notification list — everything else is live data
├── index.css           # Design tokens (colors, fonts, shadows) via Tailwind v4 @theme
└── App.jsx             # Routes, wrapped in AuthProvider + ProtectedRoute per portal
```

## What's connected to the real backend

| Area | Status |
|---|---|
| Login / Register | ✅ Real JWT auth, redirects by actual account role |
| Route protection | ✅ `ProtectedRoute` blocks/redirects based on role |
| Admin: Patients (list/add/view/delete) | ✅ |
| Admin: Doctors (list) | ✅ |
| Admin: Departments (list/add) | ✅ |
| Admin: Appointments (list/book/cancel/reschedule) | ✅ |
| Admin: Prescriptions (list) | ✅ |
| Admin: Billing (list/create/mark paid) | ✅ |
| Admin: Dashboard stats & charts | ✅ computed from live data |
| Doctor: patients under their care, appointments, prescriptions (write), profile | ✅ |
| Patient: own appointments (book/cancel/reschedule), prescriptions, billing, profile | ✅ |
| Reports page charts | ⚠️ still illustrative/mock (no analytics endpoint yet) |
| Settings pages (dark mode, notification toggles) | ⚠️ UI-only, local state (no settings table in the schema) |
| Password change forms | ⚠️ UI present, backend has no change-password endpoint yet |
| Notification bell contents | ⚠️ static sample data (no notifications table/endpoint yet) |

## Design Notes
- **Palette**: primary blue (`#2563eb`), teal accent (`#0d9488`), slate grays.
- **Type**: Sora for headings, Inter for body text, JetBrains Mono for IDs/numbers.
- **Signature motif**: an animated ECG "vitals pulse" line in the logo and login/register panels.

## Extending
To wire up the remaining ⚠️ items, add the corresponding endpoint to `hms-backend` first
(e.g. `PUT /api/auth/change-password`, a `Settings` table, a `Notification` table), then add a
matching wrapper in `src/api/` and call it from the relevant page.
>>>>>>> 8f45242 (Initial commit — MediCare HMS project upload)
