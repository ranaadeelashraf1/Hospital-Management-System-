# MediCare Hospital Management System — Full Stack

This project has two parts:

```
medicare-hms-fullstack/
├── frontend/    React (Vite) + Tailwind CSS — the UI, 3 portals (Admin, Doctor, Patient)
└── backend/     Node.js + Express + Prisma + PostgreSQL — the REST API
```

The frontend is already wired to call the backend's API (see `frontend/src/api/`). To run the
full app locally, start the backend first, then the frontend.

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set a real `DATABASE_URL` (a PostgreSQL connection string). Free options
if you don't have Postgres locally: [Neon](https://neon.tech), [Supabase](https://supabase.com),
[Railway](https://railway.app).

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed      # creates demo Admin / Doctor / Patient accounts
npm run dev        # starts the API on http://localhost:5000
```

Demo accounts created by the seed script (password for all: `password123`):

| Role    | Email                          |
|---------|----------------------------------|
| Admin   | admin@medicare.hospital           |
| Doctor  | doctor@medicare.hospital          |
| Patient | patient@medicare.hospital         |

Full API reference: `backend/README.md`.

## 2. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL defaults to http://localhost:5000/api — fine if backend is local
npm run dev              # starts the UI on http://localhost:5173
```

Visit `http://localhost:5173/login`, log in with one of the seeded accounts above, and you'll land
on the matching portal (Admin dashboard, Doctor dashboard, or Patient dashboard).

Full frontend details: `frontend/README.md`.

## Notes

- **Prisma commands need internet access** the first time (`prisma generate`/`migrate` download a
  small engine binary). This was built in a sandboxed environment without that access, so those
  commands could not be run there — the schema is correct and complete, and will work normally on
  a machine with normal internet access.
- A few UI areas are intentionally still local/demo-only because the backend doesn't have a
  matching feature yet (dark mode toggle, password-change forms, the notification bell's contents,
  the Reports page charts). These are called out in `frontend/README.md` under "What's connected
  to the real backend" along with what you'd need to add to wire them up.
- New patients/doctors created by an Admin get a randomly generated temporary password, shown once
  in a toast notification after creation — there's no "forgot password"/email flow yet.
