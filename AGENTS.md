# AGENTS.md — Connectimi Frontend

> **Maintenance rule:** Every time a meaningful change is made to this repository (new route, new page, new component, new environment variable, changed styling pattern, etc.), update the relevant sections of this file to keep it accurate.

---

## Project Overview

**Connectimi** is a professional networking platform. This directory (`Connectimi-Startup-Frontend/`) contains the React/Vite SPA (Single Page Application) that serves as the web frontend for the platform. The frontend features a responsive, glassmorphic UI with animations, supporting both **personal/individual users** and a dedicated **B2B/organization portal**.

---

## Repository Structure

```
connectimi-web-frontend/
├── public/                     # Static assets (favicon, manifest, images, service worker)
│   ├── images/                 # Default profile and banner images
│   ├── manifest.json           # Web App Manifest for PWA installation
│   └── sw.js                   # Service Worker handling caching and offline routing fallback
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── home/               # Sub-components specific to the Home Feed (Feed, Sidebars)
│   │   ├── Avatar.jsx          # Configurable user avatar (round, square, hexagon)
│   │   ├── Connectimi_logo.jsx # SVG brand logo component
│   │   ├── CVModal.jsx         # CV/resume upload modal
│   │   ├── editProfile.jsx     # Full profile editing form
│   │   ├── ImageCropperModal.jsx # Image cropping wrapper (uses react-easy-crop)
│   │   ├── Navbar.jsx          # Responsive main navigation header
│   │   └── PaymentModal.jsx    # Premium payment interface modal
│   ├── context/                # Global React context providers
│   │   ├── AuthContext.jsx     # Session state, login, logout, and token storage
│   │   ├── ProfileContext.jsx  # Local profile loading and syncing state
│   │   └── ThemeContext.jsx    # Dark/Light mode theme state
│   ├── data/                   # Static/mock data used by components
│   ├── organization/           # B2B / Organization portal module
│   │   ├── components/         # Org-specific UI components
│   │   ├── pages/              # Org-specific views (feed, profile, messages, ads, etc.)
│   │   └── OrganizationLayout.jsx # Layout wrapper for organization routes
│   ├── pages/                  # Personal/individual user views
│   │   ├── AccountCompletion.jsx # Personal onboarding details page
│   │   ├── CourseRoadmap.jsx   # Interactive module-by-module course path view
│   │   ├── Courses.jsx         # Course discovery catalog page (Coming Soon placeholder)
│   │   ├── ForgotPassword.jsx  # Password recovery email trigger
│   │   ├── Home.jsx            # Main dashboard / feed container
│   │   ├── Landing.jsx         # Public marketing page with PWA install promo
│   │   ├── Login.jsx           # Sign-in page
│   │   ├── Messaging.jsx       # Real-time messages page
│   │   ├── MyNetwork.jsx       # Network dashboard (connections, invitations, followers)
│   │   ├── Notifications.jsx   # Live notifications history page
│   │   ├── Profile.jsx         # Public/private professional profile page
│   │   ├── Signup.jsx          # Register account form page
│   │   ├── VerifyEmail.jsx     # OTP input page
│   │   └── Work.jsx            # Job discovery and search board
│   ├── services/
│   │   └── api.js              # Axios instance configured with JWT authorization interceptors
│   ├── utils/
│   │   └── adapters.js         # Data adapter transforming camelCase (FE) <-> snake_case (BE)
│   ├── App.jsx                 # Central router & navigation visibility setup
│   ├── index.css               # Global styles, Tailwind directives, & CSS variable design tokens
│   └── main.jsx                # Application entry point & service worker registration
├── testsprite_tests/           # Automated Playwright/Selenium test scenarios (written in Python)
├── .env                        # Local environment configuration file — NEVER commit
├── eslint.config.js            # ESLint rules and globals config
├── index.html                  # HTML entry point (mounting #root container)
├── package.json
├── vercel.json                 # Vercel routing configuration for SPA fallback
└── vite.config.js              # Vite configuration (react, tailwind plugins & react-compiler)
```

---

## Tech Stack

| Dependency | Technology | Version |
|---|---|---|
| Runtime | Browser-compatible SPA | — |
| Core Framework | React (Strict Mode) | ^19.2.0 |
| Build Tool | Vite | ^7.2.4 |
| Routing | React Router DOM | ^7.11.0 |
| Styling | Tailwind CSS (v4) + Vanilla CSS | ^4.1.18 |
| HTTP Client | Axios | ^1.13.2 |
| Animations | GSAP (GreenSock) | ^3.14.2 |
| Image Cropper | react-easy-crop | ^5.5.6 |
| Icons | react-icons | ^5.5.0 |
| Compiler | React Compiler (via `babel-plugin-react-compiler`) | ^1.0.0 |
| Linting | ESLint (v9) | ^9.39.1 |

---

## Git Workflow

- **Branches:** `main` (production) and `testing` (verification).
- **Merging:** Both direct pushes and pull requests are used.
- **Environment:** No separate staging environment is configured.

---

## Development Environment Setup

### Prerequisites

- Node.js v18 or later (per README instructions)
- npm v9 or later (only package manager used — do **not** use yarn or pnpm)

### Installation

```bash
# 1. Clone/Navigate to the frontend directory
cd Connectimi-Startup-Frontend

# 2. Install all dependencies
npm install

# 3. Create or configure your .env file
# Ensure VITE_API_URL is set correctly (see Environment Variables below)
```

---

## Run Commands

```bash
# Start local development server
npm run dev

# Build the app for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Lint the codebase
npm run lint
```

The development server runs at `http://localhost:5173` by default.

---

## Testing

- Automated tests are written in Python and located under the `testsprite_tests/` directory.
- There are no npm test scripts configured for these tests in `package.json`.

---

## Linting & Formatting

- Configured via ESLint in `eslint.config.js`.
- **Custom Rule Notice:** The `no-unused-vars` rule is configured to ignore variables matching the pattern `^[A-Z_]` (uppercase or starting with an underscore).
- Ensure your code does not introduce linting errors. Run `npm run lint` to verify.

---

## Environment Variables

### Required Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g., `http://localhost:3001` or production host). **Note:** This is the official variable name (do not use VITE_API_BASE_URL). |

---

## Styling Architecture

Styling uses a hybrid of **Tailwind CSS v4** and **Vanilla CSS**.
- Tailwind v4 is integrated as a Vite plugin (`@tailwindcss/vite`).
- Design tokens, CSS variables, dark/light theme properties, and global overrides are defined centrally in `src/index.css`.
- Pages and components typically have a **co-located CSS file** (e.g., `Courses.jsx` has `Courses.css` in the same directory). When creating new pages or components, follow this convention.
- CSS classes leverage custom variables (e.g., `var(--primary-green)`) to support Dark/Light mode theme switching.

---

## Routing & Layouts

- All client-side routes are defined centrally in `src/App.jsx`.
- **Routing Guards:**
  - `PublicRoute`: Restricts landing, login, signup, forgot password, and email verification routes to unauthenticated users. Logged-in users are automatically redirected to their correct landing/home page depending on profile completion status.
  - `ProtectedRoute`: Restricts routes to authenticated users with completed profiles. Unauthenticated users are redirected to `/`. Users with incomplete profiles are redirected to their respective completion page. Also supports role-based checks (e.g., separating `personal` vs `consultant` routes).
  - `CompletionRoute`: Restricts onboarding/completion routes to authenticated users with *incomplete* profiles of the correct role. Completed users are redirected to their dashboard; unauthenticated users are redirected to `/`.
- **Personal Routes:** Located under `/home`, `/profile`, `/work`, `/mynetwork`, `/notifications`, `/courses`. Wrapped in `ProtectedRoute` (allowedRoles: `["personal"]`).
- **Organization Routes:** Nested under `/organization/` (e.g., `/organization/feed`, `/organization/profile`). Wrapped in `ProtectedRoute` (allowedRoles: `["consultant"]`).
- **Conditional Layout:** The main `Navbar` is conditionally hidden on public landing pages (`/`), auth screens (`/login`, `/signup`, `/forgot-password`, `/verify-email`), onboarding flows (`/account-completion`, `/org-account-completion`), and any route prefixed with `/organization`.
- **Organization Portal Isolation:** Org portal pages are nested under `src/organization/pages/` and render inside the `OrganizationLayout.jsx` wrapper.

---

## State Management & Context

Global state is managed via React Context providers in `src/context/`:
1. `AuthContext.jsx` — Stores user authentication status, holds the JWT token in `localStorage` under `connectimi_token`, stores public user metadata under `connectimi_user`, and exposes helper routines (`login`, `logout`, `updateUser`).
2. `ThemeContext.jsx` — Exposes the current visual theme (`light` or `dark`), toggles themes, and updates classes on the HTML `document` element.
3. `ProfileContext.jsx` — Caches user profile information for editing, completing profile details, and syncing across screens.

---

## Services & API Integration

- All API communications must flow through the central Axios instance in `src/services/api.js`.
- The API client automatically configures `baseURL` utilizing `VITE_API_URL` (appending `/api/v1`).
- **Request Interceptor:** Automatically reads `connectimi_token` from `localStorage` and attaches it to the `Authorization` header as `Bearer <token>`.
- **Response Interceptor:** If the backend returns a `401 Unauthorized` status (e.g., token expired), the interceptor automatically logs the user out by purging credentials from `localStorage`.
- **Data Adaptation:** Because the frontend uses `camelCase` properties and the backend MongoDB models use `snake_case`, always use the helper transformations in `src/utils/adapters.js`:
  - `transformProfileToBackend(data)` — Map camelCase state payloads to snake_case.
  - `transformProfileToFrontend(user)` — Map snake_case response fields to camelCase.

---

## PWA Capabilities

The frontend behaves as a Progressive Web App (PWA):
- **Service Worker (`public/sw.js`):** Intercepts network fetches. Uses a Network-First strategy for navigating HTML pages, and Cache-First strategy for static assets (scripts, styles, images, fonts). If offline, it serves cached `/index.html` as fallback.
- **Cache Versioning:** Update `CACHE_VERSION` in `public/sw.js` during deployment tasks to ensure clients pull fresh, updated assets.
- **Manifest (`public/manifest.json`):** Defines icons, colors, scope, and display configurations.
- **Install Prompt:** `src/main.jsx` captures the `beforeinstallprompt` event and stores it on `window.__deferredPrompt` early. The landing page (`Landing.jsx`) listens for PWA prompt events to present a custom install experience.

---

## Deployment

- **Host:** Vercel
- **Configurations:** Guided by `vercel.json` to rewrite all route traffic back to `/index.html` to support client-side routing on reload.
- **Branches:** `main` acts as the production branch.

---

## Coding Standards

### JavaScript & React
- Use **ES Module** syntax (`import`/`export`) everywhere.
- Name component files in PascalCase (e.g., `ImageCropperModal.jsx`).
- Avoid `console.log` in production-facing components.
- Rely on co-located CSS files alongside Tailwind utility styles to handle complex visual treatments.
- Leverage the React Compiler. Minimize manual `useMemo` and `useCallback` unless necessary, letting the compiler optimize renders automatically.
- All backend-communicating pages/components must transform payloads using `adapters.js` to prevent casing mismatches.

### State & Storage
- Always read auth state from `useAuth` hook rather than parsing `localStorage` manually within components.
- Clean up all custom window event listeners (e.g., resize, scroll, scroll animations) on component unmount.

---

## Agent Operating Rules

1. **Read existing components and context before writing new code.** Follow existing formatting and structuring paradigms.
2. **Confirm with the user before writing any new helper functions or components** (per user's global rule).
3. **Never modify .env directly** — if a new environment configuration is introduced, update the documentation or instructions.
4. **Use VITE_API_URL** for any backend endpoints configuration. Do not invent new endpoint prefixes.
5. **Always update the context in the AGENTS.md file** after making any changes to directories, configurations, or structures.

---

## Checklist Before Completing Any Task

- [ ] New routes are registered inside `App.jsx`.
- [ ] Customized styling follows the co-located CSS and CSS variables theme setup.
- [ ] No `console.log` statements are left in modified frontend files.
- [ ] API payloads are properly transformed using `adapters.js` transforms.
- [ ] Auth state checks are queried from `useAuth` or standard context getters.
- [ ] Global ESLint rules are satisfied (verify by running `npm run lint`).
- [ ] If changing caching or PWA features, `CACHE_VERSION` in `sw.js` is updated.
- [ ] `AGENTS.md` is updated to reflect any structural changes.
