import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, logOut } from '@/lib/firebase/auth';
import { db, Collections, setDoc, getDoc, serverTimestamp } from '@/lib/firebase/firestore';
import { doc } from 'firebase/firestore';
import { User, UserRole } from '@/lib/types';

export class AuthService {
  async loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async signupWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    await this.createUserDocument(credential.user);
    return credential.user;
  }

  async loginWithGoogle(): Promise<FirebaseUser> {
    const credential = await signInWithPopup(auth, googleProvider);
    await this.ensureUserDocument(credential.user);
    return credential.user;
  }

  async logout(): Promise<void> {
    await logOut();
  }

  async createUserDocument(user: FirebaseUser): Promise<void> {
    const userRef = doc(db, Collections.USERS, user.uid);
    const userDoc: Partial<User> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'member' as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: true,
      },
    };
    await setDoc(userRef, { ...userDoc, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  async ensureUserDocument(user: FirebaseUser): Promise<void> {
    const userRef = doc(db, Collections.USERS, user.uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      await this.createUserDocument(user);
    }
  }

  async getUserProfile(uid: string): Promise<User | null> {
    const userRef = doc(db, Collections.USERS, uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return { uid, ...snapshot.data() } as User;
  }
}

export const authService = new AuthService();
