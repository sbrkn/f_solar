# F Solar — Collaborative Workspace PWA

A production-ready Next.js 14 + Firebase + Google Drive Progressive Web App starter kit.

## ✨ Features

- **Next.js 14** with App Router & TypeScript strict mode
- **Firebase Authentication** (Email/Password + Google OAuth 2.0)
- **Firestore** real-time database with live listeners
- **Google Drive Integration** — OAuth 2.0, file backup, folder sync
- **PWA** — Service Worker, offline support, installable
- **Shadcn UI** component library with dark/light mode
- **Real-time Collaboration** — delta sync, conflict resolution
- **RBAC** — Role-based access control
- **ESLint + Prettier** code standards

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
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

## 🔑 Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework with App Router |
| Firebase Auth | Authentication & session management |
| Firestore | Real-time NoSQL database |
| Firebase Admin SDK | Server-side token verification |
| Google Drive API v3 | File backup & synchronisation |
| Tailwind CSS | Utility-first styling |
| Shadcn UI | Accessible component library |
| Zod | Runtime schema validation |
| React Hook Form | Performant form management |
| Sonner | Toast notifications |

## 📖 API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Email/password login |
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/refresh` | POST | Refresh JWT token |
| `/api/documents` | GET, POST | List / create documents |
| `/api/documents/[id]` | GET, PUT, DELETE | Document CRUD |
| `/api/projects` | GET, POST | List / create projects |
| `/api/sync` | GET, POST | Real-time sync endpoint |
| `/api/google-drive/auth` | GET | Initiate Drive OAuth flow |
| `/api/google-drive/callback` | GET | OAuth2 callback |
| `/api/google-drive/files` | GET | List Drive files |
| `/api/google-drive/sync` | POST | Backup document to Drive |

## 🔒 Security

- JWT verification via Firebase Admin on all API routes
- HTTP-only cookies for session tokens
- Security headers (X-Frame-Options, HSTS, etc.) in `next.config.js`
- All secrets managed via environment variables

## 📄 License

Apache 2.0 — see [LICENSE](./LICENSE)
