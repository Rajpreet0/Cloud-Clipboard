import { User } from "@supabase/supabase-js";
import { getDisplayName } from "./getDisplayName";

/**
 ** Save the authenticated Supabase user to the local database via API route.
 * 
 * - Sends a POST request to `/api/users` with basic user info.
 * - Extracts display name and avatar from Supabase metadata.
 * - Throws an error if the request failes.
 *  
 * @param {User | null} supabaseUser - The Supabase user object or null if unauthenticated. 
 * @returns {Promise<any>} The JSON response from the API if successful.
 * @throws {Error} When the API request fails.
 */

export const saveUserToDB = async (supabaseUser: User | null) => {
      if (!supabaseUser) return;

      try {
        // POST request to save user to DB
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: supabaseUser.id,
            email: supabaseUser.email,
            // Helper Function to extract the Displayname from metadata
            fullName: getDisplayName(supabaseUser),
            avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
          }),
        });

        // Handle non-Ok responses and parse potential error message
        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(`Failed to save user: ${error.error || response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        console.error("Error saving user: ", err);
        throw err;
      }
}
