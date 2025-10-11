"use client";

import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthState = {
    session: Session | null;
    loading: boolean;
    setSession: (session: Session | null) => void;
    initSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session }),

  initSession: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, loading: false });

    // Only one global listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });

    // Cleanup if Hot Reload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        listener.subscription.unsubscribe();
      });
    }
  },
}));