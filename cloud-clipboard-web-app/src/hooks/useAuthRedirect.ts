import { useSupabaseSession } from "@/lib/supabase/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


interface UseAuthRedirectOptions{
    requireAuth?: boolean;
    redirectTo?: string;
}

export function useAuthRedirect({ requireAuth = false, redirectTo = "/dashboard" }: UseAuthRedirectOptions) {
   
    const router = useRouter();
    const { session, loading } = useSupabaseSession();

    useEffect(() => {
        if (loading) return;

        if (requireAuth && !session) {
            router.replace("/auth/sign-in");
        } else if (!requireAuth && session) {
            router.replace(redirectTo);
        }
    }, [loading, session, router, requireAuth, redirectTo]);

}