# ☀️ F-Solar Workspace

A production-ready **Next.js + Firebase + Google Drive PWA** collaborative workspace starter kit — inspired by AppFlowy/Notion.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Firebase Firestore (real-time)
- **Auth**: Firebase Authentication (Email/Password + Google OAuth)
- **Storage**: Google Drive API integration
- **PWA**: Service Worker, Web App Manifest, Offline support
- **State**: React hooks + Firebase real-time listeners

## Features

- 🔐 **Authentication** — Email/password & Google OAuth login
- 📄 **Document Editor** — Real-time collaborative document editing
- 📁 **Project Management** — Organize documents into projects
- ☁️ **Google Drive Sync** — Automatic backup to Google Drive
- 📱 **PWA Ready** — Installable, offline-capable web app
- 🌙 **Dark Mode** — Full dark/light/system theme support
- 🔄 **Real-time Sync** — Firestore real-time listeners for live updates

## Quick Start

### Prerequisites

- Node.js 18+
- Firebase project ([console.firebase.google.com](https://console.firebase.google.com))
- Google Cloud project with Drive API enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/sbrkn/f_solar.git
cd f_solar

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Firebase (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Project Structure

```
f_solar/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, signup, forgot-password
│   ├── (dashboard)/       # Main app pages
│   └── api/               # Backend API routes
├── components/
│   ├── auth/              # Authentication forms
│   ├── editor/            # Document editor
│   ├── ui/                # Shadcn UI components
│   ├── workspace/         # Dashboard, sidebar, etc.
│   └── common/            # Shared components
├── lib/
│   ├── firebase/          # Firebase config & helpers
│   ├── google-drive/      # Drive API client
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Utility functions
├── services/              # Business logic services
├── public/
│   ├── manifest.json      # PWA manifest
│   └── service-worker.js  # Offline support
└── styles/
    └── globals.css        # Global styles + CSS variables
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run format    # Format with Prettier
```

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel deploy
```

Add environment variables in the Vercel dashboard.

### Firebase Hosting

```bash
npm run build
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

## License

Apache License 2.0 — see [LICENSE](./LICENSE) for details.
