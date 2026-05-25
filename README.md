# Connectimi — Web Frontend

> **Connect with Ambition** · A professional networking platform for the next generation.

Connectimi is a full-featured professional social network enabling individuals and organizations to connect, collaborate, discover opportunities, and grow through courses, messaging, and a dynamic feed.

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) with [Vite 7](https://vite.dev/) |
| Routing | [React Router DOM v7](https://reactrouter.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla CSS |
| HTTP Client | [Axios](https://axios-http.com/) |
| Animations | [GSAP](https://gsap.com/) |
| Icons | [React Icons](https://react-icons.github.io/react-icons/) |
| Image Cropping | [react-easy-crop](https://github.com/ValentinH/react-easy-crop) |
| Compiler | React Compiler (via `babel-plugin-react-compiler`) |
| Font | [Satoshi](https://fontshare.com/fonts/satoshi) via Fontshare |

---

## 📁 Project Structure

```
connectimi-web-frontend/
├── public/                     # Static assets (logo, icons)
├── src/
│   ├── components/             # Shared UI components
│   │   ├── Navbar.jsx          # Main navigation bar
│   │   ├── Avatar.jsx          # User avatar component
│   │   ├── CVModal.jsx         # CV/resume upload modal
│   │   ├── editProfile.jsx     # Edit profile form
│   │   ├── ImageCropperModal.jsx
│   │   ├── PaymentModal.jsx
│   │   ├── Icon.jsx
│   │   ├── Connectimi_logo.jsx
│   │   └── home/               # Home feed sub-components
│   ├── pages/                  # Individual user-facing pages
│   │   ├── Landing.jsx         # Public landing page
│   │   ├── Login.jsx           # Authentication — login
│   │   ├── Signup.jsx          # Authentication — signup
│   │   ├── ForgotPassword.jsx  # Password recovery
│   │   ├── VerifyEmail.jsx     # Email verification
│   │   ├── AccountCompletion.jsx # Onboarding flow
│   │   ├── Home.jsx            # Main feed
│   │   ├── Profile.jsx         # User profile
│   │   ├── Work.jsx            # Jobs & opportunities
│   │   ├── MyNetwork.jsx       # Connections & network
│   │   ├── Notifications.jsx   # Activity notifications
│   │   ├── Courses.jsx         # Course discovery
│   │   └── CourseRoadmap.jsx   # Individual course roadmap
│   ├── organization/           # Organization (B2B) portal
│   │   ├── OrganizationLayout.jsx
│   │   ├── components/
│   │   └── pages/
│   │       ├── OrgFeed.jsx
│   │       ├── OrgProfile.jsx
│   │       ├── OrgAccountCompletion.jsx
│   │       ├── OrgMessages.jsx
│   │       ├── OrgAlerts.jsx
│   │       ├── OrgCourses.jsx
│   │       └── OrgAds.jsx
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── ThemeContext.jsx    # Light/Dark theme
│   ├── data/                   # Static data / mock data
│   ├── App.jsx                 # Root component & routing
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles & design tokens
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## ✨ Features

### Individual Users
- **Landing Page** — Public marketing page with sign-up CTA
- **Authentication** — Sign up, log in, forgot password, email verification, and onboarding flow
- **Home Feed** — Dynamic post feed with interactions
- **Profile** — Rich user profiles with CV upload, image cropping, and editing
- **My Network** — Connection management and discovery
- **Work** — Browse job listings and opportunities
- **Notifications** — Real-time activity alerts
- **Courses** — Discover and follow learning paths with roadmaps
- **Messaging** — Direct messages between users

### Organizations
- **Organization Portal** — Dedicated layout and navigation for org accounts
- **Org Profile** — Public-facing organization page
- **Org Feed** — Post and engage as an organization
- **Org Courses** — Publish and manage learning courses
- **Org Ads** — Create and manage sponsored ads
- **Org Alerts & Messages** — Internal communication tools

### Platform
- **Theme Support** — Light/dark mode via `ThemeContext`
- **Protected Routing** — Auth-aware route handling
- **React Compiler** — Enabled for optimized renders

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd connectimi-web-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example` if available):

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Running Locally

```bash
npm run dev
```

The app will start at `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
```

Output is placed in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🧩 Key Conventions

- **Routing** — All routes are defined centrally in [`App.jsx`](./src/App.jsx). The `Navbar` is conditionally rendered; it is hidden on auth, landing, and org routes.
- **Styling** — Each page/component has a co-located `.css` file alongside Tailwind utility classes.
- **Context** — Global state (auth, theme) lives in `src/context/` and is provided at the root of the app.
- **Organization Module** — Org-specific pages and components are isolated under `src/organization/` with their own layout.

---

## 📄 License

Private — All rights reserved © Connectimi
