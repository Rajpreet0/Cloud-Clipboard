"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { saveUserToDB } from "@/lib/saveUserToDB";
import { supabase } from "@/lib/supabase/client";
import { useSupabaseSession } from "@/lib/supabase/session";
import { useEffect } from "react";


const DashboardView = () => {
    const {loading} = useSupabaseSession();
    useAuthRedirect({ requireAuth: true });

    useEffect(() => {
      const syncUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (data?.user) await saveUserToDB(data.user);
      };
      syncUser();
    }, []);

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