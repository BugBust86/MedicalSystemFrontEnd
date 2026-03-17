# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MedicalSystemFrontEnd is a Vue 3 + TypeScript medical management system frontend, using Vite as the build tool. It integrates with a backend API running on `localhost:8080`.

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Element Plus
- **HTTP Client**: Axios
- **Routing**: Vue Router 5
- **Icons**: Font Awesome

## Available Commands

```bash
# Start development server with hot reload
npm run dev

# Type check, build and minify for production
npm run build

# Preview production build locally
npm run preview

# Run code linting (ESLint + oxlint)
npm run lint

# Format code with Prettier
npm run format

# Type check only
npm run type-check
```

## Code Architecture

### Directory Structure

```
src/
├── api/                    # API service functions
│   ├── staff.ts           # Staff authentication
│   ├── admin/             # Admin APIs (dept, drug, staff, worktable management)
│   ├── doctor/            # Doctor APIs (duty, appointment, prescription, profile)
│   └── labTech/           # Lab technician APIs (profile, check projects)
├── utils/                  # Utilities (request.ts - axios wrapper)
├── views/                  # Page components (organized by role: admin/, doctor/, labTech/)
├── router/                 # Vue Router configuration
├── App.vue                 # Root component
└── main.ts                 # Entry point
```

### Path Alias

`@` alias maps to `src/` (configured in `vite.config.ts`).

### Role-Based Routing

The system supports three user roles with route-based access control:
- `/` - Login page (loginRegister.vue)
- `/doctor` - Doctor pages (child routes: duty-info, appointment, prescription, profile)
- `/admin` - Administrator pages
- `/lab-technician` - Lab technician pages
- `/unauthorized` - Unauthorized access page

Route guards implement role-based access control:
- `meta.requiresAuth` - Requires authentication
- `meta.allowedRoles` - Array of allowed roles
- After successful login, automatically redirects based on user role

### HTTP Request Layer

`src/utils/request.ts` provides a pre-configured axios instance with:
- Request interceptor: Adds JWT token to Authorization header (`Bearer ${token}`)
- Response interceptor: Handles `code === 0` as success, manages 401/403/404/500 errors
- Auto-clears token and redirects to login on 401
- Methods: `get`, `post`, `put`, `patch`, `delete`, `postForm`

### API Services

**`src/api/staff.ts`** - Staff authentication:
- `staffRegisterService` - Staff registration
- `staffLoginService` - Staff login
- `uploadAvatarService` - Avatar upload

**`src/api/doctor/`** - Doctor-related APIs:
- `doctorDutyInfo.ts` - Duty schedule management
- `doctorAppointment.ts` - Patient appointments
- `doctorPrescription.ts` - Prescription CRUD operations
- `doctorProfile.ts` - Doctor profile management

**`src/api/admin/`** - Admin APIs:
- `staffManage.ts` - Staff management
- `deptManage.ts` - Department management
- `drugManage.ts` - Drug management
- `workTableManage.ts` - Worktable/schedule management
- `adminProfile.ts` - Admin profile

**`src/api/labTech/`** - Lab Technician APIs:
- `labTechProfile.ts` - Profile management
- `checkProject.ts` - Lab test project management

### Environment Variables

- `.env.development`: `VITE_API_BASE_URL` = `http://localhost:8080`

## Key Patterns

- Vue components use `<script setup lang="ts">`
- Element Plus components are globally registered in `main.ts`
- API calls use the request wrapper from `src/utils/request.ts`
- Routes in `src/router/index.ts` use dynamic imports for code splitting
- JWT token stored in localStorage after successful login
- API responses follow `{ code: number, data: T, message?: string }` format

### Views Structure

```
src/views/
├── loginRegister.vue         # Login/registration page
├── unauthorized.vue          # Unauthorized access page
├── doctor/                  # Doctor role pages
│   ├── DoctorIndex.vue      # Doctor layout wrapper
│   └── child/               # Doctor child pages (duty-info, appointment, prescription, profile)
├── admin/                   # Admin role pages
└── labTech/                 # Lab technician role pages
```

### Default Credentials

- Admin: `admin_no: A2022000`, `password: 123456`
