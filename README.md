# MediCare HMS

A professional full-stack hospital management system built with React on the frontend and Express + Prisma on the backend.

## Project structure

```text
medicare-hms-fullstack/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── ...
│   ├── package.json
│   ├── server.js
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
├── SETUP.md
├── push_professional.ps1
├── push_to_github.ps1
└── .gitignore
```

## Architecture overview

- Backend is organized by feature responsibilities and layered responsibilities.
- Frontend is organized by domain-driven modules and reusable UI building blocks.
- Shared documentation lives under the docs folder for maintainability.

## Suggested standards

- Keep controllers thin and route-focused.
- Keep utilities reusable and framework-agnostic.
- Use feature folders for application-level business logic.
- Keep UI components small, composable, and reusable.
- Separate API integration from page logic.

## Workflow

1. Start backend
2. Start frontend
3. Connect through environment variables
4. Keep docs updated with each feature addition
