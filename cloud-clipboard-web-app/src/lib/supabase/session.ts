import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./client";

/**
 * Custom Hook to manage Supbase authentication session
 */
export function useSupabaseSession() {
    // State to store the current session (null if not logged in)
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current session from supabse
        const getSession = async () => {
            const {data} = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        }

        // Fetch session immediately on mount
        getSession();

        // Subscribe to Supabase auth state change 
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);    // Update session whenever auth changes
            setLoading(false);
        });

        // Cleanup: unsubscribe from listener when component unmounts
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return {session, loading};
}