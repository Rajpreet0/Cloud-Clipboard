import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

type ClipItem = {
  type:"text"|"image";
  data:string;
};

const Dashboard = () => {

    const { auth, loading } = useAuth();
    const [clips, setClips] = useState<ClipItem[]>([]);

    useEffect(() => {
      const listener = window.clips.onNew((payload: ClipItem) => {
        setClips(prev => [payload, ...prev]);
      });
      return () => window.clips.offNew(listener);
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!auth) return null;


  return (
    <Layout>
      <p>Clipboard History</p>
      <div className="mt-4 flex flex-col gap-2">
        {clips.map((clip, idx) => (
          <div key={idx} className="p-2 bg-gray-200 rounded">
            {clip.type === "text" && <p>{clip.data}</p>}
            {clip.type === "image" && (
              <img src={`data:image/png;base64,${clip.data}`} className="max-w-xs rounded" />
            )}
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Dashboard