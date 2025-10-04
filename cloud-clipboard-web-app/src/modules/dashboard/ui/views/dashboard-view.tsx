"use client";

import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { supabase } from "@/lib/supabase/client";
import { useSupabaseSession } from "@/lib/supabase/session";
import { useRouter } from "next/navigation";


const DashboardView = () => {

    const router = useRouter();
    const {session, loading} = useSupabaseSession();
    useAuthRedirect({ requireAuth: true });

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    const user = session.user;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">👋 Welcome, {user.user_metadata?.username || "User"}!</h1>
        <p className="text-gray-600">
          You are logged in with <span className="font-semibold">{user.email}</span>
        </p>

        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-semibold text-gray-800">User ID:</span>{" "}
            {user.id}
          </p>
          <p>
              <span className="font-semibold text-gray-800">Username:</span>{" "}
              {user.user_metadata?.username ? user.user_metadata.username : user.user_metadata?.full_name || user.email?.split("@")[0] || "No Username"}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Created:</span>{" "}
            {new Date(user.created_at).toLocaleString()}
          </p>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full bg-gray-900 text-white hover:bg-gray-800 transition mt-6"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

export default DashboardView