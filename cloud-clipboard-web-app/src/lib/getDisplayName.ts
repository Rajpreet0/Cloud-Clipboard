/**
 ** Extracts the Username based from the Authentication Method
 * 
 * - If user registered using Email Providers it users the username
 * - If user registered using Social Provider use Full Name
 * - If user registered using Social Provider and don't have
 *   a full Name use as Username
 * - If no Information of the User is transmitted the use "Guest" 
 *  
 * 
 * @param {SupabaseUser} user - The Supbase User when authentication 
 * @returns {string} extracted username
 */
export const getDisplayName = (user: any) => {
    return (
        user?.user_metadata?.username ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "Guest"    
    );
};