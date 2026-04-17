# 🚀 Setup Guide

Complete setup guide for F-Solar Workspace.

## 1. Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → Enter project name → Create project
3. Go to **Project Settings** → **General** tab
4. Scroll to **Your apps** → Click **</>** (Web) icon
5. Register app → Copy the config values to `.env.local`

### Enable Authentication

1. Firebase Console → **Authentication** → **Get started**
2. **Sign-in method** tab → Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (add your support email)
3. **Authorized domains** → Add your production domain

### Setup Firestore

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode** (or Start in test mode for development)
3. Select your Cloud Firestore location
4. **Rules** tab → Update security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspace members can read/write workspace documents
    match /workspaces/{workspaceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
    
    // Document access based on workspace membership
    match /documents/{documentId} {
      allow read, write: if request.auth != null;
    }
    
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
    
    match /tags/{tagId} {
      allow read, write: if request.auth != null;
    }
    
    match /activityLogs/{logId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    match /syncStatus/{statusId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Create Firestore Indexes

For complex queries, create composite indexes:
1. Firebase Console → **Firestore Database** → **Indexes**
2. Add indexes for:
   - Collection: `documents`, Fields: `workspaceId ASC`, `status ASC`, `updatedAt DESC`
   - Collection: `documents`, Fields: `workspaceId ASC`, `updatedAt DESC`
   - Collection: `activityLogs`, Fields: `workspaceId ASC`, `createdAt DESC`

## 2. Google Drive Setup

### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. **APIs & Services** → **Enable APIs and Services**
4. Search for **Google Drive API** → Enable it

### Create OAuth 2.0 Credentials

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://your-production-domain.com`
5. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://your-production-domain.com/api/auth/google/callback`
6. Copy **Client ID** and **Client Secret** to `.env.local`

### Configure OAuth Consent Screen

1. **APIs & Services** → **OAuth consent screen**
2. User type: **External** (or Internal for G Suite)
3. Fill in required fields:
   - App name: F-Solar Workspace
   - User support email
   - Developer contact email
4. **Scopes**: Add `https://www.googleapis.com/auth/drive.file`
5. **Test users**: Add your email for testing

## 3. Local Development

### Environment Variables

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

Fill in all variables:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000
```

### Install & Run

```bash
npm install
npm run dev
```

## 4. PWA Setup

### Generate App Icons

Create icon files for different sizes. You need PNG icons at:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Place them in `/public/icons/`. You can use tools like:
- [Favicon.io](https://favicon.io/favicon-generator/) - online generator
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) - CLI tool:
  ```bash
  npx pwa-asset-generator logo.png public/icons
  ```

### Register Service Worker

The service worker is loaded automatically. To verify:
1. Open Chrome DevTools → Application → Service Workers
2. You should see the service worker registered
3. Test offline mode by checking the "Offline" checkbox

## 5. Production Deployment

### Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Environment Variables for Production

Make sure to update these for production:
- `NEXT_PUBLIC_APP_URL` → your production URL
- `GOOGLE_REDIRECT_URI` → production callback URL
- `NEXTAUTH_URL` → production URL
- `NEXTAUTH_SECRET` → strong random secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

## 6. Firestore Data Models

### Users Collection
```typescript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  preferences: {
    theme: 'light' | 'dark' | 'system',
    language: string,
    notifications: boolean,
    autoSave: boolean
  },
  role: 'admin' | 'member' | 'viewer'
}
```

### Documents Collection
```typescript
{
  id: string,
  title: string,
  content: string,
  projectId: string | null,
  workspaceId: string,
  authorId: string,
  collaborators: string[],
  tags: string[],
  status: 'draft' | 'published' | 'archived' | 'deleted',
  version: number,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  deletedAt: Timestamp | null,
  metadata: {
    wordCount: number,
    readTime: number,
    lastEditedBy: string,
    isTemplate: boolean
  }
}
```

## 7. Troubleshooting

### Firebase Auth Error: unauthorized-domain
- Add your domain to Firebase Console → Authentication → Authorized domains

### Google Drive OAuth Error
- Ensure redirect URI exactly matches in Google Cloud Console
- Check that the Drive API is enabled

### Firestore Permission Denied
- Update Firestore Security Rules
- Ensure user is authenticated before accessing Firestore

### Service Worker Not Registering
- Must be served over HTTPS in production
- Check browser console for registration errors
- Verify `public/service-worker.js` is accessible at root URL

### Build Errors
- Run `npm run lint` to check for TypeScript/ESLint errors
- Ensure all environment variables are set
- Check `tsconfig.json` paths match your file structure
