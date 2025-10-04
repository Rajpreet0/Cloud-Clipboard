"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useSupabaseSession } from "@/lib/supabase/session";


const DashboardView = () => {
    const { loading} = useSupabaseSession();
    useAuthRedirect({ requireAuth: true });

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen gap-4 bg-gray-50">
            <Spinner/> 
            <p className="text-gray-600 text-lg"> Loading your dashboard...</p>
        </div>
        );
    }

 
  return (
    <div>

    </div>
  )
}

export default DashboardView