'use client';

import { useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, logout as firebaseLogout } from '@/lib/firebase/auth';
import { getDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/firestore';
import { User } from '@/lib/types';

interface AuthState {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getDocument<User>(
            COLLECTIONS.USERS,
            firebaseUser.uid
          );
          setState({
            user: firebaseUser,
            userProfile: profile,
            loading: false,
            error: null,
          });
        } catch {
          setState({
            user: firebaseUser,
            userProfile: null,
            loading: false,
            error: 'Failed to load user profile',
          });
        }
      } else {
        setState({
          user: null,
          userProfile: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseLogout();
    } catch {
      setState((prev) => ({ ...prev, error: 'Failed to logout' }));
    }
  }, []);

  return {
    ...state,
    isAuthenticated: !!state.user,
    logout,
  };
}
