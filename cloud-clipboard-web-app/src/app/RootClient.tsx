"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

/**
 ** Root-level client component that initializes the Supabase auth session.
 *
 * - Runs `initSession()` once on mount to sync the user's auth state.
 * - Ensures that all child components have access to the correct session data.
 *
 * @param {{ children: React.ReactNode }} props - React children to render after session init.
 * @returns {JSX.Element} Wrapped children with initialized auth context.
 */
export default function RootClient({children}: { children: React.ReactNode}) {
    const initSession = useAuthStore((s) => s.initSession);

    useEffect(() => {
        // Initialize Supabase session on first client render
        initSession();
    }, [initSession]);

    return <>{children}</>;
}