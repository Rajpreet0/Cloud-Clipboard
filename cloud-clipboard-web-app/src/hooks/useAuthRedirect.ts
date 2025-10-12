import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


interface UseAuthRedirectOptions{
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 ** Custom React hook for handling authentication-based route redirects.
 * 
 * - Redirects unauthenticated users to the sign-in page if `requireAuth` is true.
 * - Redirects authenticated users away from auth pages (e.g sign-in) to `redirectTo`.
 * - Waits for auth state to finish loading before performing any navigation
 * 
 * @param {UseAuthRedirectOptions} options - Configuration for auth redirect behavior.
 * @returns {void} 
 */

export function useAuthRedirect({ requireAuth = false, redirectTo = "/dashboard" }: UseAuthRedirectOptions) {
   
    const router = useRouter();

    const session = useAuthStore((s) => s.session);
    const loading = useAuthStore((s) => s.loading);

    useEffect(() => {
        // Avoid redirecting while auth state is still loading
        if (loading) return;

        // If authentication is required but user is not logged in -> redirect to sign-in.
        if (requireAuth && !session) {
            router.replace("/auth/sign-in");
        
        // If page should not be accessible when logged in -> redirect to target page
        } else if (!requireAuth && session) {

            router.replace(redirectTo);
        }
    }, [loading, session, router, requireAuth, redirectTo]);

}