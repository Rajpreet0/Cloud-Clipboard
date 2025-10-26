import type { LucideIcon } from "lucide-react";

interface ClipItemProps {
    type: "text" | "image";
    data: string;
    icon: LucideIcon;
    deviceType: string;
    clipTimeAgo: string;
}

const ClipItem: React.FC<ClipItemProps> = ({type, data, icon: Icon, deviceType, clipTimeAgo }) => {
  return (
    <div className="p-4 bg-[#275DAD]/20 rounded-lg flex gap-6 ">
        <div className="bg-dark-gray rounded h-fit p-[5px]">
            <Icon className="text-white" size={24}/>
        </div>
        <div className="w-full">
            {type === "text" && 
                <p className="font-semibold text-dark-gray max-w-xl">{data}</p>
            }

            {type === "image" && (
                <img
                    src={`data:image/png;base64,${data}`}
                    className="max-w-xs rounded"
                />
            )}
            <div className="mt-8 flex w-full items-center justify-between">
                <p className="text-sm text-gray-500">{deviceType}</p>
                <p className="text-sm text-gray-500">{clipTimeAgo}</p>
            </div>
        </div>
    </div>
  )
}

export default ClipItem