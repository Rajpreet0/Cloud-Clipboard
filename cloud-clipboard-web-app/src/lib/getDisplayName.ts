export const getDisplayName = (user: any) => {
    return (
        user?.user_metadata?.username ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "Guest"    
    );
};