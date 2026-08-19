# Frontend App Layer

This folder represents the root app shell, routing, and provider setup.

## Recommended layout

```text
src/app/
├── AppRouter.jsx
├── AppLayout.jsx
├── providers/
│   ├── AuthProvider.jsx
│   └── ToastProvider.jsx
└── routes/
    └── routeConfig.js
```

This keeps the root composition separate from page UI and feature logic.
