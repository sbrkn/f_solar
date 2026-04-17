import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// During build, environment variables may not be set.
// Placeholder values are used so the build succeeds without credentials.
// At runtime, these must be replaced with real values in .env.local.
const isConfigured =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'build-placeholder';

if (typeof window !== 'undefined' && !isConfigured) {
  console.warn(
    '[Firebase] No API key detected. Please configure your .env.local file. ' +
      'See SETUP_GUIDE.md for instructions.'
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'build-placeholder',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'build-placeholder.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'build-placeholder',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'build-placeholder.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:build-placeholder',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function initApp(): FirebaseApp {
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

const app = initApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
