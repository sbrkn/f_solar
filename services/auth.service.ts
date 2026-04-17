import { db } from '@/lib/firebase/config';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  logout,
  resetPassword,
  getIdToken,
} from '@/lib/firebase/auth';
import {
  COLLECTIONS,
  setDocument,
  getDocument,
  updateDocument,
} from '@/lib/firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { User, UserPreferences, UserRole } from '@/lib/types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: true,
  autoSave: true,
};

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const firebaseUser = await signUpWithEmail(email, password, displayName);

  const user: Omit<User, 'id'> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName,
    photoURL: firebaseUser.photoURL,
    createdAt: new Date(),
    updatedAt: new Date(),
    preferences: DEFAULT_PREFERENCES,
    role: 'member' as UserRole,
  };

  await setDocument(COLLECTIONS.USERS, firebaseUser.uid, user);

  return { ...user } as User;
}

export async function loginUser(email: string, password: string) {
  const firebaseUser = await signInWithEmail(email, password);
  const profile = await getDocument<User>(COLLECTIONS.USERS, firebaseUser.uid);
  return { user: firebaseUser, profile };
}

export async function loginWithGoogle() {
  const { user, accessToken } = await signInWithGoogle();

  const existingProfile = await getDocument<User>(COLLECTIONS.USERS, user.uid);

  if (!existingProfile) {
    const newUser: Omit<User, 'id'> = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: DEFAULT_PREFERENCES,
      role: 'member' as UserRole,
    };
    await setDocument(COLLECTIONS.USERS, user.uid, newUser);
  }

  return { user, accessToken, profile: existingProfile };
}

export async function getUserProfile(uid: string): Promise<User | null> {
  return getDocument<User>(COLLECTIONS.USERS, uid);
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<User>
): Promise<void> {
  await updateDocument(COLLECTIONS.USERS, uid, updates);
}

export async function updateUserPreferences(
  uid: string,
  preferences: Partial<UserPreferences>
): Promise<void> {
  await updateDocument(COLLECTIONS.USERS, uid, {
    'preferences': preferences,
    updatedAt: serverTimestamp(),
  });
}

export { logout, resetPassword, getIdToken };
