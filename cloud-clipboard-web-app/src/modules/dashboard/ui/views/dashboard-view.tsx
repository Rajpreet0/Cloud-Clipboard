"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuthStore } from "@/store/useAuthStore";

/**
 ** DashboardView component
 *
 * - Protects the dashboard route using `useAuthRedirect(requireAuth: true)`.
 * - Automatically syncs the authenticated user with the database via `saveUserToDB()`.
 * - Displays a loading spinner while syncing or fetching auth state.
 * - Handles and displays any sync errors gracefully.
 *
 * @returns {JSX.Element} The main dashboard view with user sync logic and loading states.
 */
const DashboardView = () => {
    const session = useAuthStore((s) => s.session);
    const loading = useAuthStore((s) => s.loading);
    
    // Redirect unauthenticated users to sign-in
    useAuthRedirect({ requireAuth: true });

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen gap-4 bg-gray-50">
            <Spinner/> 
            <p className="text-gray-600 text-lg">
              Loading your dashboard
            </p>
        </div>
        );
    }

 
  return (
    <div className="p-4">
      Logged in as: {session?.user?.email}
    </div>
  )
}

export default DashboardView