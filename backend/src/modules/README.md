# Backend Modules

This folder is reserved for feature-based backend modules.

## Recommended layout

```text
src/modules/
├── auth/
│   ├── auth.controller.js
│   ├── auth.routes.js
│   ├── auth.service.js
│   └── auth.validator.js
├── patients/
│   ├── patient.controller.js
│   ├── patient.routes.js
│   ├── patient.service.js
│   └── patient.validator.js
├── doctors/
├── appointments/
├── billing/
├── prescriptions/
└── departments/
```

This keeps the codebase cleaner and helps scale the project as more features are added.
