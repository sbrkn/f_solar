# F Solar — Collaborative Workspace PWA

> **Status: Early-stage / pre-production.** Core authentication and document flows work, but security hardening, tests, and operational maturity are still in progress. Not recommended for production use without addressing the [known limitations](#known-limitations) below.

A Next.js + Firebase + Google Drive Progressive Web App for collaborative document editing.

## ✨ Features

- **Next.js 15** with App Router & TypeScript strict mode
- **Firebase Authentication** — Email/password sign-in
- **Firestore** — Document and project CRUD via a service layer
- **Google Drive Integration** — OAuth 2.0 connect flow; file backup (partial)
- **PWA** — Service Worker, offline support, installable
- **Shadcn UI** component library with dark/light mode
- **ESLint + Prettier** code standards

## 🔢 Technology Stack

Versions sourced from `package.json`.

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.5.15 | React framework with App Router |
| React | ^18 | UI runtime |
| Firebase JS SDK | ^10.12.0 | Authentication & Firestore client |
| firebase-admin | ^12.1.0 | Server-side token verification |
| Tailwind CSS | ^3.4.1 | Utility-first styling |
| TypeScript | ^5 | Static typing |
| Zod | ^3.23.8 | Runtime schema validation |
| React Hook Form | ^7.51.4 | Performant form management |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Firebase and Google OAuth credentials
```

### 3. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

```
f_solar/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, signup, forgot-password
│   ├── (dashboard)/        # Dashboard, documents, projects, settings
│   └── api/                # REST API routes
├── components/
│   ├── auth/               # LoginForm, SignupForm, OAuthButton
│   ├── workspace/          # Sidebar, DocumentList, ProjectList, CreateModal
│   ├── editor/             # DocumentEditor, EditorToolbar
│   ├── ui/                 # Shadcn UI components
│   └── common/             # ErrorBoundary, LoadingSpinner, Header
├── lib/
│   ├── firebase/           # Firebase client & admin config
│   ├── google-drive/       # Drive OAuth client
│   ├── hooks/              # useAuth, useDocument, useFirestore, useGoogleDrive
│   ├── utils/              # date, validation, constants
│   └── types/              # TypeScript type definitions
├── services/               # auth, firestore, google-drive, sync, api-client
├── public/
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Offline support
└── styles/                 # globals.css, theme.css
```

## 📖 API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Email/password login |
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/refresh` | POST | Refresh JWT token |
| `/api/documents` | GET, POST | List / create documents |
| `/api/documents/[id]` | GET, PUT, DELETE | Document CRUD |
| `/api/projects` | GET, POST | List / create projects |
| `/api/sync` | GET, POST | Autosave sync endpoint |
| `/api/google-drive/auth` | GET | Initiate Drive OAuth flow |
| `/api/google-drive/callback` | GET | OAuth2 callback |
| `/api/google-drive/files` | GET | List Drive files |
| `/api/google-drive/sync` | POST | Backup document to Drive |

## ✅ Implementation Status

| Area | Status | Notes |
|---|---|---|
| Email/password auth (Firebase) | Implemented | react-hook-form + zod on forms |
| Google Drive OAuth connect | Partial | Connect link works; state validation, status UI, and revoke flow are pending |
| Multi-workspace / RBAC | Planned | Currently uses a fixed `DEMO_WORKSPACE = 'default'` |
| Document CRUD via Firestore service layer | Implemented | Service layer in `services/` |
| Real-time collaboration | Partial | Debounced autosave with last-write-wins; no OT/CRDT, no presence, no revision history |
| Editor | Partial | Uses deprecated `document.execCommand` |
| API authorization (workspace/role checks) | Planned | Tracked in P0 security issue |
| Middleware token verification | Planned | Currently only checks cookie presence, not token validity |
| PWA basics | Implemented | Manifest + service worker |
| Tests / CI | Missing | No test script or CI workflow exists yet |
| Security headers (HSTS, X-Frame-Options, etc.) | Implemented | Defined globally in `next.config.js` |

## 🗺️ Roadmap

### P0 — Security (address before any public exposure)
- Resource-level API authorization: workspace membership and role checks in `/api/documents` and `/api/documents/[id]`
- OAuth `state` parameter validation in the Google Drive callback (CSRF protection)
- Middleware token verification (validate JWT, not just cookie presence)
- Auth architecture unification (consolidate admin-SDK and client-SDK usage patterns)

### P1 — Core Completeness
- Real workspace model: remove `DEMO_WORKSPACE = 'default'`, implement per-user workspace selection with role-based access control (RBAC)
- Revision history and basic conflict resolution UI for collaborative editing
- Tests + CI (unit/integration tests, GitHub Actions lint/typecheck workflow)
- Systematic Zod validation across all API routes

### P2 — Quality & Collaboration
- Editor modernization: replace deprecated `document.execCommand` with a maintained library
- Deeper collaboration: presence indicators, cursor sharing, OT/CRDT
- Operational monitoring and error tracking

## ⚠️ Known Limitations

- **No workspace isolation:** all data uses a hardcoded `DEMO_WORKSPACE = 'default'`; multi-tenancy is not implemented.
- **No API-level authorization:** API routes verify identity (JWT) but do not check workspace membership or roles.
- **Middleware does not verify tokens:** only the presence of a session cookie is checked.
- **Google Drive OAuth is incomplete:** no CSRF state validation, no revoke flow, no connection-status UI.
- **Collaboration is last-write-wins autosave:** no operational transform, CRDT, presence, or revision history.
- **No tests or CI:** there is no test script in `package.json` and no CI workflow.

## 🔒 Security

- Firebase Admin SDK used for server-side JWT verification on API routes
- HTTP-only cookies for session tokens
- Security headers (X-Frame-Options, HSTS, etc.) configured globally in `next.config.js`
- All secrets managed via environment variables

## 📄 License

Apache 2.0 — see [LICENSE](./LICENSE)