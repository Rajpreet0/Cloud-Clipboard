import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {

    const { auth, loading, logout } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (!auth) return null;

  return (
    <Layout>
      <p>Desktop</p>
      <button onClick={logout} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Log Out
      </button>
    </Layout>
  )
}

export default Dashboard