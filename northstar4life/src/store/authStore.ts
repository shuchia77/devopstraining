import { create } from 'zustand';
import { User } from '@/types';
import { authService, userService } from '@/services/supabase';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  isSignedIn: boolean;

  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadSession: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  isSignedIn: false,

  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const { user, session } = await authService.signUp(email, password, displayName);
      if (user) {
        await userService.createUserProfile(user.id, email, displayName);
        const profile = await userService.getUserProfile(user.id);
        set({
          session,
          user: {
            id: user.id,
            email: user.email || '',
            displayName: displayName,
            subscription: profile.subscription,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          },
          isSignedIn: !!session,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign up failed',
        loading: false,
      });
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user, session } = await authService.signIn(email, password);
      if (user) {
        const profile = await userService.getUserProfile(user.id);
        set({
          session,
          user: {
            id: user.id,
            email: user.email || '',
            displayName: profile.display_name,
            subscription: profile.subscription,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          },
          isSignedIn: !!session,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign in failed',
        loading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await authService.signOut();
      set({
        user: null,
        session: null,
        isSignedIn: false,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign out failed',
        loading: false,
      });
      throw error;
    }
  },

  loadSession: async () => {
    set({ loading: true });
    try {
      const session = await authService.getCurrentSession();
      const user = await authService.getCurrentUser();

      if (session && user) {
        const profile = await userService.getUserProfile(user.id);
        set({
          session,
          user: {
            id: user.id,
            email: user.email || '',
            displayName: profile.display_name,
            subscription: profile.subscription,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          },
          isSignedIn: true,
          loading: false,
        });
      } else {
        set({
          session: null,
          user: null,
          isSignedIn: false,
          loading: false,
        });
      }
    } catch (error) {
      set({
        session: null,
        user: null,
        isSignedIn: false,
        loading: false,
      });
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Password reset failed',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
