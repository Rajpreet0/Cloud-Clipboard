import { getDisplayName } from "./getDisplayName";

export const saveUserToDB = async (supabaseUser: any) => {
      if (!supabaseUser) return;

      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: supabaseUser.id,
            email: supabaseUser.email,
            fullName: getDisplayName(supabaseUser),
            avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
          }),
        });
      } catch (err) {
        console.error("Error saving user: ", err);
      }
}
