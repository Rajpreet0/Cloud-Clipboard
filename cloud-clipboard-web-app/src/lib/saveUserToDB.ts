import { User } from "@supabase/supabase-js";
import { getDisplayName } from "./getDisplayName";

export const saveUserToDB = async (supabaseUser: User | null) => {
      if (!supabaseUser) return;

      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: supabaseUser.id,
            email: supabaseUser.email,
            fullName: getDisplayName(supabaseUser),
            avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: "Unkown error" }));
          throw new Error(`Failed to save user: ${error.error || response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        console.error("Error saving user: ", err);
        throw err;
      }
}
