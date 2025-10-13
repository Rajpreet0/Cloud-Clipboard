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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        👋 Welcome to your Dashboard
      </h1>

      <p className="text-gray-600 mb-6 text-center max-w-md">
        Your device is successfully paired and authenticated.  
        You can now use the Cloud Clipboard Desktop App to sync and manage your clips.
      </p>

      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Open Clipboard
        </button>

        <button
          onClick={async () => {
            await window.secureStore.clearAuth();
            navigate("/");
          }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Dashboard