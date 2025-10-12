"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { saveUserToDB } from "@/lib/saveUserToDB";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

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

    const [syncing, setSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);

    useEffect(() => {
      // Sync user to DB once the session is available
      if (!session?.user) return;

      const syncUser = async () => {
        setSyncing(true);
        setSyncError(null);
        try {
         await saveUserToDB(session.user);
        } catch (err) { 
          console.error("Failed to sync user:", err);
          setSyncError("Failed to sync user data. Please refresh the page.");
        } finally {
          setSyncing(false);
        }
      };
      syncUser();
    }, [session?.user?.id]);

    // Loading or syncing state
    if (loading || syncing) {
        return (
        <div className="flex items-center justify-center min-h-screen gap-4 bg-gray-50">
            <Spinner/> 
            <p className="text-gray-600 text-lg">
              {loading ? "Loading your dashboard..." : "Syncing user data..."}
            </p>
        </div>
        );
    }

    // Display error if user sync fails
    if (syncError) {
      return (
        <div className="flex items-center justify-center min-h-screen gap-4 bg-red-50">
          <p className="text-red-600 text-lg">{syncError}</p>
        </div>
      )
    }

 
  return (
    <div>

    </div>
  )
}

export default DashboardView