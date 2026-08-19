# MediCare HMS - Professional Architecture

This project follows a clean, maintainable structure that separates responsibilities by layer and domain.

## Root structure

```text
medicare-hms-fullstack/
├── backend/                  # Node.js + Express API
│   ├── prisma/               # Prisma schema and seed scripts
│   ├── src/
│   │   ├── app.js            # Express app bootstrap
│   │   ├── config/           # Environment and database config
│   │   ├── controllers/      # Route handlers per resource
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── routes/           # API routes
│   │   ├── utils/            # JWT, async wrappers, validators
│   │   └── modules/          # Future feature-based modular layout
│   ├── server.js             # Server entry point
│   ├── package.json
│   └── README.md
│
├── frontend/                 # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── app/              # App shell + root router
│   │   ├── api/              # API client and endpoint wrappers
│   │   ├── assets/
│   │   ├── components/       # Shared UI/layout/charts/routing
│   │   ├── context/          # Auth provider and global state
│   │   ├── features/         # Feature-based modules
│   │   ├── hooks/            # Reusable custom hooks
│   │   ├── lib/              # Utility functions and helpers
│   │   ├── pages/            # Route-level pages
│   │   ├── services/         # API/service layer
│   │   ├── styles/           # Design tokens / global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── docs/                     # Project documentation
├── SETUP.md                  # Local setup guide
├── push_professional.ps1
├── push_to_github.ps1
└── README.md                 # Optional project overview
```

## Backend conventions

- `controllers/` handles request/response logic.
- `routes/` defines URL endpoints only.
- `middleware/` handles auth checks, validation, and error responses.
- `config/` contains database and environment configuration.
- `modules/` is reserved for future domain-driven grouping such as `auth`, `patients`, `appointments`.
- `utils/` stores shared helpers and validation utilities.

## Frontend conventions

- `app/` holds root-level app shell and route composition.
- `features/` groups UI logic by domain.
- `components/` stays reusable and generic.
- `pages/` is kept route-specific and lightweight.
- `api/` is the contract layer between React and the backend.
- `services/` can encapsulate complex business logic or API orchestration.

## Why this structure is better

- Easier onboarding for new developers.
- Clear separation of backend and frontend responsibilities.
- Scales better when new modules/features are added.
- Makes code reviews and maintenance more organized.
