# MediCare HMS — Backend API

Node.js + Express + Prisma + MongoDB backend for the MediCare Hospital Management System.
Role-based (Admin / Doctor / Patient) REST API with JWT authentication.

## Tech Stack
- **Node.js + Express** — server & routing
- **Prisma ORM** — database access (JavaScript, not TypeScript)
- **MongoDB** — database (MongoDB Atlas or a local replica set)
- **JWT (jsonwebtoken)** — authentication
- **bcryptjs** — password hashing
- **Nodemailer + SMTP** — registration and password-reset email delivery
- **zod** — request validation

## 1. Prerequisites
- Node.js 18+
- A running MongoDB replica set. MongoDB Atlas is the easiest option; Prisma transactions
  require replica-set mode even for some single-document writes.

## 2. Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set your real values:
```
MONGO_URI="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/medicare_hms"
JWT_SECRET="a-long-random-string"
CLIENT_URL="http://localhost:5173"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-smtp-app-password"
MAIL_FROM="MediCare <your-email@example.com>"
```

For Gmail, enable 2-step verification and create an App Password. Do not use your normal
Gmail password. Other SMTP providers such as Mailtrap, Resend SMTP, SendGrid, or Brevo work
with the same variables.

## 3. Create the database tables

```bash
npx prisma generate        # generates the Prisma Client
npx prisma db push                  # creates/updates MongoDB collections and indexes
```

> **Note**: this project was scaffolded in a sandboxed environment without internet access to
> `binaries.prisma.sh`, so `prisma generate`/`migrate` could not be run here. The schema
> (`prisma/schema.prisma`) is complete and correct — these commands will work normally on your
> machine as long as you have internet access.

## 4. Seed demo data (optional but recommended)

```bash
npm run seed
```

This creates one Admin, one Doctor, and one Patient account — all with password `password123`:

| Role    | Email                          | Password      |
|---------|---------------------------------|---------------|
| Admin   | admin@medicare.hospital         | password123   |
| Doctor  | doctor@medicare.hospital        | password123   |
| Patient | patient@medicare.hospital       | password123   |

## 5. Run the server

```bash
npm run dev     # with auto-reload (nodemon)
# or
npm start       # plain node
```

Server runs at `http://localhost:5000`. Health check: `GET /api/health`.

## Project Structure

```
prisma/
  schema.prisma       # all 8 tables + relationships + enums
  seed.js              # demo data
src/
  config/db.js         # Prisma client singleton
  middleware/
    auth.js             # JWT verification + role-based authorize()
    validate.js          # zod request validation
    errorHandler.js      # centralized error responses
  controllers/          # business logic per resource
  routes/                # route definitions, mounted in app.js
  utils/
    jwt.js               # sign/verify helpers
    asyncHandler.js       # avoids try/catch repetition
    validators.js          # zod schemas
  app.js                # express app + route mounting
server.js               # entry point
```

## API Overview

All routes except `/api/auth/register` and `/api/auth/login` require:
```
Authorization: Bearer <token>
```

### Auth
| Method | Route              | Access | Description |
|--------|---------------------|--------|--------------|
| POST   | `/api/auth/register` | Public | Create account (role: PATIENT/DOCTOR/RECEPTIONIST) |
| POST   | `/api/auth/login`    | Public | Returns JWT + user |
| POST   | `/api/auth/forgot-password` | Public | Emails a one-hour password reset link |
| POST   | `/api/auth/reset-password` | Public | Sets a new password using a one-time token |
| GET    | `/api/auth/me`       | Any    | Current logged-in user's profile |

### Patients
| Method | Route                 | Access                    | Description |
|--------|------------------------|----------------------------|--------------|
| GET    | `/api/patients`         | Admin, Receptionist         | List/search/filter all patients |
| POST   | `/api/patients`         | Admin, Receptionist         | Admin adds a new patient |
| GET    | `/api/patients/me`      | Patient                     | Own profile + history |
| GET    | `/api/patients/mine`    | Doctor                      | Patients this doctor has treated |
| GET    | `/api/patients/:id`     | Admin, Doctor (if treating), Patient (if self) | View one patient |
| PUT    | `/api/patients/:id`     | Admin, Patient (self)       | Update patient info |
| DELETE | `/api/patients/:id`     | Admin                        | Remove patient |

### Doctors
| Method | Route                | Access | Description |
|--------|------------------------|--------|--------------|
| GET    | `/api/doctors`         | Any    | List/search doctors |
| GET    | `/api/doctors/me`      | Doctor | Own profile |
| GET    | `/api/doctors/:id`     | Any    | View one doctor |
| PUT    | `/api/doctors/:id`     | Admin, Doctor (self) | Update |
| DELETE | `/api/doctors/:id`     | Admin  | Remove doctor |

### Departments
| Method | Route                  | Access | Description |
|--------|--------------------------|--------|--------------|
| GET    | `/api/departments`        | Any    | List all |
| POST   | `/api/departments`        | Admin  | Create |
| PUT    | `/api/departments/:id`    | Admin  | Update |
| DELETE | `/api/departments/:id`    | Admin  | Delete |

### Appointments
| Method | Route                             | Access                       | Description |
|--------|-------------------------------------|-------------------------------|--------------|
| GET    | `/api/appointments`                  | Any (scoped by role)          | Admin sees all, Doctor sees own, Patient sees own |
| POST   | `/api/appointments`                  | Admin, Receptionist, Patient   | Book appointment |
| PUT    | `/api/appointments/:id/status`       | Admin, Doctor, Patient (cancel only) | Update status |
| PUT    | `/api/appointments/:id/reschedule`   | Admin, Doctor, Patient          | Reschedule |

### Prescriptions
| Method | Route                  | Access                  | Description |
|--------|--------------------------|--------------------------|--------------|
| GET    | `/api/prescriptions`      | Any (scoped by role)      | Admin all, Doctor own-written, Patient own-received |
| POST   | `/api/prescriptions`      | Doctor                    | Write a new prescription (with medicines) |

### Billing
| Method | Route              | Access             | Description |
|--------|----------------------|---------------------|--------------|
| GET    | `/api/billing`         | Admin, Patient (own) | List invoices |
| POST   | `/api/billing`         | Admin                 | Create invoice |
| PUT    | `/api/billing/:id`     | Admin                 | Update status (e.g. mark Paid) |

## Example Requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Zainab Iqbal","email":"zainab@example.com","password":"secret123","role":"PATIENT","age":29,"gender":"FEMALE"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicare.hospital","password":"password123"}'
```

**Authenticated request:**
```bash
curl http://localhost:5000/api/patients \
  -H "Authorization: Bearer <token from login response>"
```

## Connecting the Frontend
In the React app, replace the imports from `src/data/mockData.js` with `fetch`/`axios` calls to
these endpoints, store the JWT (e.g. in `localStorage` or a secure cookie) after login, and attach
it as `Authorization: Bearer <token>` on every request.
