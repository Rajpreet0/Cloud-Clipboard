"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { saveUserToDB } from "@/lib/saveUserToDB";
import { useSupabaseSession } from "@/lib/supabase/session";
import { useEffect, useState } from "react";


const DashboardView = () => {
    const {session, loading} = useSupabaseSession();
    useAuthRedirect({ requireAuth: true });
    const [syncing, setSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);

    useEffect(() => {
      // Only sync if we have a session and haven't synced yet
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