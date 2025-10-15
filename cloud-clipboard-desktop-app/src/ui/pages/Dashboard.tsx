import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router"

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        async function verifyAuth() {
            try {
                const tokenObj = await window.secureStore.loadAuth();

                if (!tokenObj?.authToken) {
                    navigate("/");
                    return;
                }

                const res = await fetch("http://localhost:3000/api/devices/validate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ authToken: tokenObj.authToken }),
                });

                const data = await res.json();

                if (data.valid) {
                    setAuthorized(true);
                } else {
                    await window.secureStore.clearAuth();
                    navigate("/");
                }
            } catch (err) {
                console.error("Auth check failed", err);
                navigate("/");
            } finally {
                setLoading(false);
            }
        }

        verifyAuth();
    }, [navigate]); 

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-300">
                Checking authorization...
            </div>
        )
    }

    if (!authorized) return null; 

  return (
    <Layout>
      <p>Desktop</p>
      <button
        onClick={async () => {
          await window.secureStore.clearAuth();
            navigate("/");
          }}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Log Out
      </button>
    </Layout>
  )
}

export default Dashboard