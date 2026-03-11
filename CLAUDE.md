# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MedicalSystemFrontEnd is a Vue 3 + TypeScript medical management system frontend using Vite as the build tool. It integrates with a backend API running at `localhost:8080`.

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Element Plus
- **HTTP Client**: Axios
- **Routing**: Vue Router 5
- **Icons**: Font Awesome

## Available Commands

```bash
# Start development server with hot reload
npm run dev

# Type-check, compile and minify for production
npm run build

# Preview production build locally
npm run preview

# Run linting (ESLint + oxlint)
npm run lint

# Format code with Prettier
npm run format
```

## Code Architecture

### Directory Structure
```
src/
├── api/          # API service functions (e.g., staff.ts)
├── utils/        # Utilities (request.ts - axios wrapper)
├── views/        # Page components
├── router/       # Vue Router configuration
├── App.vue       # Root component
└── main.ts       # Entry point
```

### Path Alias
The `@` alias maps to `src/` (configured in `vite.config.ts`).

### HTTP Request Layer
`src/utils/request.ts` provides a pre-configured axios instance with:
- Request interceptor: Adds JWT token from localStorage to Authorization header
- Response interceptor: Handles API responses with `code === 0` as success, manages 401/403/500 errors
- Methods: `get`, `post`, `put`, `patch`, `delete`

### API Services
API functions in `src/api/*.ts` use the request wrapper and export typed functions with TypeScript interfaces for request/response data.

### Environment Variables
- `.env.development`: `VITE_API_BASE_URL` = `http://localhost:8080`

## Key Patterns

- Use `<script setup lang="ts">` for Vue components
- Element Plus components are globally registered in `main.ts`
- API calls should use the request wrapper from `src/utils/request.ts`
- Routes are defined in `src/router/index.ts`
