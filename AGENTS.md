# AGENTS.md — Connectimi Frontend

> **Maintenance rule:** Every time a meaningful change is made to this repository (new route, new page, new component, new environment variable, changed styling pattern, etc.), update the relevant sections of this file to keep it accurate.

---

## Project Overview

**Connectimi** is a professional networking platform. This directory (`Connectimi-Startup-Frontend/`) contains the React/Vite SPA (Single Page Application) that serves as the web frontend for the platform. The frontend features a responsive, glassmorphic UI with animations, supporting both **personal/individual users** and a dedicated **B2B/organization portal**.

For high-level system documentation and overall system architecture, see:
- [PROJECT_OVERVIEW.md](file:///d:/StartUp/Connectme/Connectimi-Production/PROJECT_OVERVIEW.md)
- [ARCHITECTURE.md](file:///d:/StartUp/Connectme/Connectimi-Production/ARCHITECTURE.md)

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
│   │   ├── Landing.jsx         # Public animated high-conversion landing page with slim modern glass header, team section (Animesh, Suroj, Sanniv, Arnab), Tier 2/3 pitch, product features & FOMO grid
│   │   ├── Login.jsx           # Sign-in page
│   │   ├── Messaging.jsx       # Real-time messages page
│   │   ├── MyNetwork.jsx       # Network dashboard (connections, invitations, followers)
│   │   ├── Notifications.jsx   # Live notifications history page
│   │   ├── Profile.jsx         # Public/private professional profile page
│   │   ├── ProjectCreate.jsx   # 5-step multi-step project showcase creation wizard
│   │   ├── ProjectDetails.jsx  # Full project details showcase and social comment view
│   │   ├── ProjectEdit.jsx     # 5-step project showcase text editor page
│   │   ├── Signup.jsx          # Register account form page
│   │   ├── VerifyEmail.jsx     # OTP input page
│   │   └── Work.jsx            # Job discovery and search board
│   ├── services/
│   │   ├── api.js              # Axios instance configured with JWT authorization interceptors
│   │   └── projectApi.js       # Project showcase CRUD endpoint methods
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

| Dependency     | Technology                                         | Version |
| -------------- | -------------------------------------------------- | ------- |
| Runtime        | Browser-compatible SPA                             | —       |
| Core Framework | React (Strict Mode)                                | ^19.2.0 |
| Build Tool     | Vite                                               | ^7.2.4  |
| Routing        | React Router DOM                                   | ^7.11.0 |
| Styling        | Tailwind CSS (v4) + Vanilla CSS                    | ^4.1.18 |
| HTTP Client    | Axios                                              | ^1.13.2 |
| Animations     | GSAP (GreenSock)                                   | ^3.14.2 |
| Image Cropper  | react-easy-crop                                    | ^5.5.6  |
| Icons          | react-icons                                        | ^5.5.0  |
| Compiler       | React Compiler (via `babel-plugin-react-compiler`) | ^1.0.0  |
| Linting        | ESLint (v9)                                        | ^9.39.1 |

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

| Variable        | Description                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_URL`  | Base URL of the backend API (e.g., `http://localhost:3001` or production host). **Note:** This is the official variable name (do not use VITE_API_BASE_URL). |
| `VITE_CHAT_URL` | Base URL of the RealTimeChat messaging server (e.g., `http://localhost:8000` or production chat host).                                                       |

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
  - `CompletionRoute`: Restricts onboarding/completion routes to authenticated users with _incomplete_ profiles of the correct role. Completed users are redirected to their dashboard; unauthenticated users are redirected to `/`.
- **Personal Routes:** Located under `/home`, `/profile`, `/work`, `/mynetwork`, `/notifications`, `/courses`. Wrapped in `ProtectedRoute` (allowedRoles: `["personal"]`).
- **Organization Routes:** Nested under `/organization/` (e.g., `/organization/feed`, `/organization/profile`). Wrapped in `ProtectedRoute` (allowedRoles: `["consultant"]`).
- **Conditional Layout:** The main `Navbar` is conditionally hidden on public landing pages (`/`), auth screens (`/login`, `/signup`, `/forgot-password`, `/verify-email`), onboarding flows (`/account-completion`, `/org-account-completion`), and any route prefixed with `/organization`.
- **Organization Portal Isolation:** Org portal pages are nested under `src/organization/pages/` and render inside the `OrganizationLayout.jsx` wrapper.

---

## State Management & Context

Global state is managed via React Context providers in `src/context/`:

1. `AuthContext.jsx` — Stores user authentication status, holds the JWT token in `localStorage` under `connectimi_token`, stores public user metadata under `connectimi_user`, and exposes helper routines (`login`, `logout`, `updateUser`).
2. `ChatContext.jsx` — Manages real-time Socket.io chat server connections, incoming/outgoing messaging events, typing indicator states, and user online/offline status tracking.
3. `ThemeContext.jsx` — Exposes the current visual theme (`light` or `dark`), toggles themes, and updates classes on the HTML `document` element.
4. `ProfileContext.jsx` — Caches user profile information for editing, completing profile details, and syncing across screens.
5. `FeedContext.jsx` — Manages the home feed posts per user. Exposes `feedPosts`, `feedLoading`, `feedError`, `hasFetchedFeed`, `fetchFeed`, `prependFeedPost`, `removeFeedPost`, `patchFeedPost`, `replaceFeedPosts`, and `clearFeed`. Feed is cached per-user-ID to avoid refetching on navigation. While `feedLoading` is `true` or `hasFetchedFeed` is `false`, the Feed component displays skeleton loader cards (no mock/demo data is shown). All entity/profile identification across `MyNetwork.jsx`, `Feed.jsx`, `Notifications.jsx`, and `Profile.jsx` supports both `id` and `_id` (`item.id || item._id`), preventing `/profile/undefined` navigation errors post-migration. Profile views display a deterministic random placeholder (5–20), and connections use actual backend connection counts. In `MyNetwork.jsx`, the sidebar count displays the real-time `connectionsCount` fetched from `/network/connections` instead of a hardcoded value.

---

## Services & API Integration

- All API communications must flow through the central Axios instance in `src/services/api.js`.
- All chat-related HTTP API communications (conversations lists, message history, fallback HTTP message sends) must flow through the chat-specific Axios instance in `src/services/chatApi.js`.
- The API client automatically configures `baseURL` utilizing `VITE_API_URL` (appending `/api/v1`).
- **Request Interceptor:** Automatically reads `connectimi_token` from `localStorage` and attaches it to the `Authorization` header as `Bearer <token>`.
- **Response Interceptor:** If the backend returns a `401 Unauthorized` status (e.g., token expired), the interceptor automatically logs the user out by purging credentials from `localStorage`.
- **Data Adaptation:** Because the frontend uses `camelCase` properties and the backend MongoDB models use `snake_case`, always use the helper transformations in `src/utils/adapters.js`:
  - `transformProfileToBackend(data)` — Map camelCase state payloads to snake_case.
  - `transformProfileToFrontend(user)` — Map snake_case response fields to camelCase.
  - `parseApiError(err)` — Centralized parser for backend validation errors (handling both standard `{ error }` and array `{ errors }` structures).

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

---

## Recent Changes

### Global API Error Handling & Button Spinners

- Added `parseApiError` utility in `src/utils/adapters.js` to extract detailed validation arrays and standard error messages from API payloads.
- Standardized submit buttons in auth and onboarding forms with dynamic `.auth-btn-spinner` white rotating loaders and fixed layout sizes (`height: 50px`, `font-size: 17px`, `padding: 12px`, `box-sizing: border-box`).
- Replaced browser `alert()` popups with inline red error alerts on onboarding pages.

### Dynamic Profile Connection Status & Navigation

- Added state tracking for `connectionStatus` and `connectionId` in `Profile.jsx`.
- Dynamically rendered profile actions button ("Connect", "Pending", "Accept Request", "Message") based on connection status.
- Added `handleAcceptConnection` to respond to incoming requests using the connection ID.
- Updated invitations mapping and navigation in `MyNetwork.jsx` to navigate using the sender's actual `userId` instead of the connection document ID.

### Frontend Bugs & UI Responsiveness Fixes

- **Profile Comment Box Navigation**: Added inline comments drawer toggle in `Profile.jsx` alongside `handleCreateComment` and `handleDeleteComment` API handlers, replacing the broken page navigation bug.
- **Cropping & Banner Previews**: Created object URLs for cropped logo and banner image previews in `OrgEditForm.jsx` to fix `[object Blob]` rendering issues. Included file input reference resets to fix re-selection behavior.
- **Like Action Page Reload Prevention**: Appended `type="button"` and event stop-propagation / prevent-default to all post and detail modal action buttons (like, comment, delete) across `Feed.jsx` and `Profile.jsx`.
- **Takeaway truncation**: Conditionalized the "See More..." link in `Feed.jsx` based on takeaway character length, and removed line-clamping CSS rules from `.insight-card--text-only` in `Home.css` so that the "See More..." button is visible on mobile viewports.
- **General Mobile Responsiveness**: Fixed mobile bottom navbar rendering issues across the app by correcting the class name mismatch to `mobile-bottom-nav` in both `Navbar.jsx` and `OrganizationNavbar.jsx`, and fetched the real organization logo from authenticated user context. Added media query padding to job and notification container layouts to clear the bottom navbar.
- **Edit Profile Fixes**: Corrected invalid `updateAuthUser` function call in `Profile.jsx` to `updateUser`.
- **Comment Styling Distinction**: Styled comment items to make author name, user headline, and comment text visually distinct in sizes and weights.
- **Consultant UI Scaling**: Scaled down hero banner and large logos on screens below `768px` in `OrgPages.css` to fix consultant profile layout.
- **Chat Context Safe Map**: Checked `Array.isArray` on fetched conversations and chat history in `ChatContext.jsx` to prevent `TypeError: ie.map is not a function` when backend responses are not arrays (e.g., gateway timeout or service unavailable error pages).

### Edit Profile Persistence & Mobile Layout Fixes

- **Website Field Adapter**: Added `website` field mapping in both `transformProfileToBackend` and `transformProfileToFrontend` in `src/utils/adapters.js`. Previously, the `website` field was silently dropped from API payloads, so edits were never persisted.
- **Profile Save Data Refresh**: Updated `handleSave` in `Profile.jsx` to call `fetchProfileData()` after a successful `updateUser()` call, ensuring the profile page immediately displays fresh data from the API. Switched error handling to use `parseApiError` for consistent error messaging.
- **Mobile-Responsive Edit Modal CSS**: Replaced the single `640px` media query in `editProfile.css` with comprehensive breakpoints at `768px` (tablet) and `480px` (mobile). Reduces overlay/content padding, shrinks banner/avatar sizing, stacks form fields in single columns, and provides full-width action buttons on small screens.
- **Inline Grid Style Removal**: Replaced all inline `gridTemplateColumns: "1fr 1fr"` styles in `editProfile.jsx` with a new `.form-row-2col` CSS class that can be properly overridden by responsive media queries. Inline styles were the root cause of the two-column layout being forced on all screen sizes.

### Post Card Re-render on Like & Mobile Insight Grid Layout Fixes

- **Post Card Re-render Prevention**: Extracted post card rendering into a memoized `InsightCard` sub-component (`React.memo`) in `Feed.jsx` with local optimistic state (`localLiked`, `localLikesCount`). Clicking Like updates the button and count instantly in local state without triggering re-renders of the full card component or sibling cards.
- **GSAP Animation Control**: Added `hasAnimatedRef` in `Feed.jsx` so the entrance animation runs only once when posts load into the DOM, preventing cards from jumping/re-animating when post state changes.
- **Mobile Insight Grid Responsive Layout**: Reordered media queries in `Home.css` so mobile/tablet rules (`@media (max-width: 900px)`) override base multi-column styles, setting `.insights-grid` to `columns: 1; column-gap: 0; width: 100%`. Removed invalid `grid-template-columns` declaration on CSS multi-column elements and updated `.insight-image-wrapper` to use responsive height (`height: auto; max-height: 320px;`) on mobile screens.
- **Full Share Button Functionality**: Added glassmorphic `ShareModal` component and floating `.share-toast` notification in `Feed.jsx` and `Home.css`. Supports instant link copying (`navigator.clipboard.writeText`), native OS device sharing (`navigator.share`), direct social sharing to LinkedIn, Twitter/X, WhatsApp, and Email, as well as a "Repost on Connectimi" option that pre-populates post creation modal.

### Profile Picture and Banner Image Update Fixes

- **Backend Controller & Validation Fix**: Updated `updateProfile` in `profile.controller.js` and `updateProfileSchema` in `profile.validation.js` to process and persist `profile_picture` and `banner_image` in MongoDB during profile updates. Added optional `logo` and `banner` fields to `updateConsultantProfileSchema` and `completeConsultantProfileSchema` in `consultant.validation.js`.
- **Frontend Payload Mapping & Blob Handling**: Updated `transformProfileToBackend` in `src/utils/adapters.js` to emit both `profile_picture`/`logo` and `banner_image`/`banner` fields. Enhanced `updateUser` in `AuthContext.jsx` with robust Blob detection (`isBlobOrFile`), ensuring Cloudinary URLs returned from upload endpoints are attached to update payloads and that the returned user object updates React state and `localStorage`.
- **Preview & UI Sync**: Fixed `editProfile.jsx` and `OrgEditForm.jsx` preview handlers to prevent `[object Blob]` string conversions in inline CSS background images. Updated `handleSave` in `Profile.jsx` and `OrgProfile.jsx` to immediately sync local `profileData` state with the returned user object from `updateUser()`.
- **Enabled Edit Options**: Enabled `email` and `website` field persistence in `transformProfileToBackend` (`adapters.js`), backend validation (`profile.validation.js`), and controller updates (`profile.controller.js`). Relaxed phone regex validation to accept optional empty strings. Un-commented and enabled "Present" job position checkboxes for Experience items in `editProfile.jsx`.
- **API URL Fallback Fix**: Updated default fallback URL in `src/services/api.js` from `http://localhost:3000` to `https://backend.connectimi.in` to ensure local frontend connects seamlessly to the active backend service without throwing Network Errors.

### Post Details Modal Crash Fix

- **Declared Missing `likeRefs`**: Added `const likeRefs = useRef({});` declaration in `src/components/home/Feed.jsx` to resolve a React runtime crash. Previously, clicking on any post to open the details modal/see more about that post threw a `TypeError: Cannot read properties of undefined (reading 'current')` because the like button in the details modal attempted to store a reference in `likeRefs.current` which was not defined.

### Profile Projects Section & Edit Form Unification

- **Populated Project Card Rendering**: Updated `renderProjects()` in `src/pages/Profile.jsx` to render full `<ProjectCard>` instances for projects in `profileData.projects`. Enhanced property resolution to extract titles and descriptions from `fullProject` or fallback to `proj.title` / `proj.description` when `projectRef` is an unpopulated string ID. Cards link directly to `/projects/${targetProjectId}`.
- **Filtered Latest Posts**: Updated `renderPosts()` in `src/pages/Profile.jsx` to filter out project-type posts so they are exclusively displayed in the "Projects" section.
- **Data Adapter Preservation**: Updated `transformProfileToFrontend` in `src/utils/adapters.js` to preserve the `projectRef` object on project entries.
- **Simplified Edit Profile Form**: Replaced the manual text project creation inputs in `src/components/editProfile.jsx` with a notice directing users to the "Showcase Project" wizard button on their profile.
- **Navbar Clearance Fix**: Updated `.project-details-container` in `ProjectDetails.css` and `.project-create-container` in `ProjectCreate.css` with `padding-top: 100px` to clear the fixed top navigation bar and prevent header element overlap.
- **Automated Frontend Tests**: Added `testsprite_tests/TC016_Project_Showcase_Create_and_Profile_Sync.py` (Playwright/TestSprite) and `testsprite_tests/TC016_Project_Showcase_Selenium.py` (Selenium WebDriver) for testing authentication, project creation, profile panel rendering, feed filtering, and edit modal state.

### Organization Account Type Frontend Compatibility
- **Account Type Mapping**: Updated `transformProfileToFrontend` in `src/utils/adapters.js` to map the backend `'organization'` account type to `'consultant'` on the frontend. This resolves the routing guard mismatch in `App.jsx` which expects `'consultant'` or `'personal'`, preventing infinite redirect loops and enabling the feed API to be correctly triggered for organization users.

### Consultant UI Temporarily Commented Out
- **`src/pages/Signup.jsx`**: Commented out the "Consultant" toggle button in the account-type toggle group. Only the "Personal" option is now visible.
- **`src/pages/Login.jsx`**: Commented out the "Consultant" toggle button and the `accountType === "consultant"` placeholder condition (email placeholder is now always "Email or Phone").
- **`src/pages/MyNetwork.jsx`**: Commented out `'experts'` from `ACTIVE_TABS`, removed the "Expert Consultations" sidebar item from the navigation list, and removed the full `activeTab === 'experts'` render block. All consultant-specific UI is preserved in comments for future re-enablement when the Consultant/Organization feature is restored.

### Project Posts Cover Photo & Multi-Photo Support Fix

- **`cover_image_url` Property Resolution**: Fixed property lookup across `Feed.jsx`, `ProjectCard.jsx`, `ProjectModal.jsx`, and `ProjectDetails.jsx` to parse `cover_image_url` (the primary image string returned by backend Prisma API) alongside legacy object keys (`cover_image.url`, `coverImage.url`). Project cover photos now render reliably on feed cards, modal popups, and detail pages.
- **Multi-Photo Support (up to 3 photos)**: Added multi-photo normalization for projects with up to 3 photos (cover photo + gallery screenshots). Implemented interactive photo navigation (dot indicators, counter badge, thumbnail switcher) on feed cards and in the `ProjectModal` popup.
- **Instant Author Header Sync**: Updated `ProjectCard.jsx` and `Feed.jsx` to pass `initialInsight` into `ProjectModal`. Author name, avatar, and headline are populated immediately upon modal mount, preventing fallback text ("Anonymous Developer") while fetching.
- **Shimmer Skeleton Loading UI**: Implemented `@keyframes skeleton-shimmer` in `ProjectModal.css` and skeleton placeholders (cover banner, status badges, title bar, tech chips, description lines) in `ProjectModal.jsx` to provide a polished loading experience while project details fetch asynchronously.
- **Preserved Direct Navigation**: The `/projects/:id` route and `ProjectDetails.jsx` page remain fully functional for direct deep links, sharing, and project editing.
### Profile Navigation from Feed Posts

- **`Feed.jsx` (InsightCard & Post Modal Header)**: Added click navigation to `/profile/${authorId}` on author avatar and name in both `InsightCard` footer and post details popup modal header.
- **`ProjectCard.jsx` (Author Footer)**: Added `onClick` handler on author avatar and name in `ProjectCard` footer to navigate to `/profile/${authorId}` without triggering the project modal popup.
- **`ProjectModal.jsx` (Author Header)**: Updated `.project-modal-author-info` header to be clickable, closing the modal and navigating to `/profile/${authorId}`.

