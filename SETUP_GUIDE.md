# F Solar — Setup Guide

## Prerequisites

- Node.js 18+
- A Firebase project
- A Google Cloud project (for Drive API)

---

## 1. Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → enter a project name → Continue
3. Enable Google Analytics (optional) → Create project

### 1.2 Enable Authentication

1. In Firebase Console → **Authentication** → Get started
2. Sign-in method → Enable **Email/Password** and **Google**
3. Under **Google** provider, set your **Project support email**

### 1.3 Create Firestore Database

1. Firebase Console → **Firestore Database** → Create database
2. Choose **Production mode** → Select a region → Enable
3. In the **Rules** tab, apply these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null;
    }
    match /documents/{docId} {
      allow read, write: if request.auth != null;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
    match /activity_logs/{logId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 1.4 Get Firebase Config (Client)

1. Firebase Console → Project Settings → **Your apps** → Web app → Add app
2. Register app → Copy the `firebaseConfig` object
3. Add to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 1.5 Generate Firebase Admin SDK Key (Server)

1. Firebase Console → Project Settings → **Service accounts**
2. Click **Generate new private key** → Download JSON
3. Add to `.env.local`:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> **Note:** When copying the private key, ensure newlines are represented as `\n` (escaped).

---

## 2. Google Drive API Setup

### 2.1 Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select or create a project
3. **APIs & Services** → Library → Search **Google Drive API** → Enable

### 2.2 Create OAuth 2.0 Credentials

1. **APIs & Services** → **Credentials** → Create Credentials → **OAuth client ID**
2. Application type: **Web application**
3. Authorised redirect URIs: `http://localhost:3000/api/google-drive/callback`
4. Add your production URL too: `https://your-domain.com/api/google-drive/callback`
5. Copy **Client ID** and **Client Secret** to `.env.local`:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-drive/callback
```

### 2.3 Configure OAuth Consent Screen

1. **APIs & Services** → **OAuth consent screen**
2. User Type: **External** (or Internal for Google Workspace)
3. Fill in app name, support email, developer email
4. Scopes: Add `https://www.googleapis.com/auth/drive` and `https://www.googleapis.com/auth/drive.file`
5. Add test users if in External/Testing mode

---

## 3. Environment Variables Summary

Create `.env.local` in the root directory:

```bash
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin (Server)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Google OAuth / Drive
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-drive/callback

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-min-32-chars
```

---

## 4. Running the Application

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build
npm run start

# Lint & Format
npm run lint
npm run format
```

---

## 5. Deployment (Vercel)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add all environment variables from `.env.local`
4. Deploy

### Update Google OAuth Redirect URI

In Google Cloud Console → Credentials, add your production URL:
```
https://your-app.vercel.app/api/google-drive/callback
```

### Update Firebase Auth Domain

In Firebase Console → Authentication → Settings → Authorized domains, add:
```
your-app.vercel.app
```

---

## 6. PWA Installation

On Chrome/Edge desktop:
- Click the install icon in the address bar

On iOS Safari:
- Tap Share → Add to Home Screen

On Android Chrome:
- Tap the three-dot menu → Add to Home Screen

---

## 7. Firestore Indexes (Optional)

For optimal query performance, create composite indexes in Firebase Console → Firestore → Indexes:

| Collection | Fields | Order |
|---|---|---|
| documents | workspaceId ASC, updatedAt DESC | |
| documents | workspaceId ASC, isTrashed ASC, updatedAt DESC | |
| projects | workspaceId ASC, createdAt DESC | |
| activity_logs | workspaceId ASC, timestamp DESC | |
