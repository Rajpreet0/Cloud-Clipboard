import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";


export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const { auth, loading } = useAuth();

    if (loading) return <p>Loading...</p>
    if (!auth) return <Navigate to="/" replace />

    return children;
}