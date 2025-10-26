import ClipItem from "@/components/ClipItem";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { CircleCheck, Laptop, RefreshCcw, SearchIcon } from "lucide-react";
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
      <div className="flex items-center w-full justify-end gap-2">
        <CircleCheck size={16} className="text-green-600" />
        <p className="font-semibold text-dark-gray text-sm">All Devices are synced</p>
        <div className="border border-dark-gray rounded p-[5px] ml-2 cursor-pointer">
          <RefreshCcw size={16} className="text-blue"/>
        </div>
      </div>
      <p className="font-bold text-3xl text-dark-gray mt-2">Clipboard History</p>
      <div className="flex items-center gap-4 mt-4 w-full border-2 border-dark-gray rounded-lg p-2">
        <SearchIcon size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-sm text-dark-gray placeholder-gray-400 outline-none"
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {clips.map((clip, idx) => (
          <ClipItem
            key={idx}
            type={clip.type}
            data={clip.data}
            icon={Laptop}
            deviceType="MacBook Air"
            clipTimeAgo="2 min ago"
          />
        ))}
      </div>
    </Layout>
  )
}

export default Dashboard