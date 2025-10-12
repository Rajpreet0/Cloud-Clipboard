"use client";

import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

/**
 ** Global Zustand store for handling Supabase authentication state.
 * 
 * - Initalizes and keeps Supabase session in sync
 * - Exposes `session`, `loading`, and helper methods for manual updates.
 * 
 * @returns {AuthState} Zustand store for auth state management
 */

type AuthState = {
    session: Session | null;
    loading: boolean;
    setSession: (session: Session | null) => void;
    initSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,

  // Update session manually
  setSession: (session) => set({ session }),

  // Initialize session and subscribe to auth changes
  initSession: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, loading: false });

    // Subscribe once to Supabase auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });

    // Cleanup listener on hot reload or page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        listener.subscription.unsubscribe();
      });
    }
  },
}));