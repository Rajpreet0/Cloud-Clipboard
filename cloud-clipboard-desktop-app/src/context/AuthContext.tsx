import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


type AuthInfo = {
    authToken: string;
    deviceId: string;
    user: {
        id: string;
        email: string;
        name?: string | null;
    }
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

    const failureCountRef = useRef(0);

    useEffect(() => {
        async function initAuth() {
            try {
                const tokenObj = await window.secureStore.loadAuth();

                if (!tokenObj) {
                    return;
                }

                const res = await fetch("http://localhost:3000/api/devices/me", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ authToken: tokenObj.authToken }),
                });

                const data = await res.json();

                if (!data.valid) {
                    await window.secureStore.clearAuth();
                    setAuth(null);
                } else {
                    setAuth({
                        authToken: tokenObj.authToken,
                        deviceId: data.device.deviceid,
                        user: data.user,
                    })
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

    useEffect(() => {
        if (!auth?.authToken) return;

        let interval: ReturnType<typeof setInterval>;
        let intervalMs = 5 * 60_000;

        const startHeartbeat = () => {
            interval = setInterval(async () => {
                try {
                    const res = await fetch("http://localhost:3000/api/devices/ping", {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${auth.authToken}`
                        },
                    });

                    if (res.status === 401) {
                        failureCountRef.current++;

                        intervalMs = 15_000;

                        if (failureCountRef.current >= 3) {
                            await window.secureStore.clearAuth();
                            setAuth(null);
                            navigate("/");
                            console.log("Auth permanently invalid — logged out");
                            return clearInterval(interval);
                        }
                    } else {
                        failureCountRef.current = 0;
                        intervalMs = 5 * 60_000;
                    }

                } catch (err) {
                    console.warn("[PING FAILED- NETWORK]", err);
                }

                clearInterval(interval);
                startHeartbeat();

            }, intervalMs);
        }

        startHeartbeat();
        return () => clearInterval(interval);
    }, [auth?.authToken]);

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