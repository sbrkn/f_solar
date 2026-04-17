'use client';

import { useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, getIdToken } from '@/lib/firebase/auth';
import { authService } from '@/services/auth.service';
import { User } from '@/lib/types';

interface AuthState {
  user: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await authService.getUserProfile(firebaseUser.uid);
        setState({ user: firebaseUser, profile, loading: false, error: null });
      } else {
        setState({ user: null, profile: null, loading: false, error: null });
      }
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authService.loginWithEmail(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setState((s) => ({ ...s, loading: false, error: msg }));
      throw err;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authService.signupWithEmail(email, password, displayName);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Signup failed';
      setState((s) => ({ ...s, loading: false, error: msg }));
      throw err;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authService.loginWithGoogle();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google login failed';
      setState((s) => ({ ...s, loading: false, error: msg }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  const getToken = useCallback(async () => getIdToken(), []);

  return {
    ...state,
    isAuthenticated: !!state.user,
    login,
    signup,
    loginWithGoogle,
    logout,
    getToken,
  };
}
