import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


type AuthInfo = {
    authToken: string;
    deviceId: string
} | null;

const AuthContext = createContext<{
    auth: AuthInfo;
    loading: boolean;
    setAuth: (v: AuthInfo) => void;
    logout: () => Promise<void>;
}>({ auth: null, loading: true, setAuth: () => {} ,logout: async () => {} });


export const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const navigate = useNavigate();
    const [auth, setAuth] = useState<AuthInfo>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initAuth() {
            try {
                const tokenObj = await window.secureStore.loadAuth();

                if (!tokenObj) {
                    return;
                }

                setAuth(tokenObj);

                const res = await fetch("http://localhost:3000/api/devices/validate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ authToken: tokenObj.authToken }),
                });

                const data = await res.json();

                if (!data.valid) {
                    await window.secureStore.clearAuth();
                    setAuth(null);
                }
                
            } catch (err) {
                console.log(err);
                setAuth(null);
            } finally {
                setLoading(false);
            }

        }

        initAuth();
    }, []); 

    async function logout() {
        await window.secureStore.clearAuth();
        setAuth(null);
        navigate("/");
    }

    return (
        <AuthContext.Provider value={{auth, loading, setAuth, logout}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = () => useContext(AuthContext);