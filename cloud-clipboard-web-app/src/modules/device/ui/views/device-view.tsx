"use client";
import { getDeviceInfo } from "@/lib/getDeviceInfo";
import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard";
import { Spinner } from "@/components/ui/spinner";


const DeviceView = () => {
    const [deviceInfo, setDeviceInfo] = useState<any>(null);

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const info = await getDeviceInfo();
            setDeviceInfo(info);
        };
        
        fetchDeviceInfo();
    }, []);

    if (!deviceInfo) return (
        <div className="flex items-center justify-center min-h-screen gap-4">
            <Spinner/>
            <p className="text-gray-600 text-lg">
                Load Device Data....
            </p>
        </div>
    ) 

  return (
    <div className="p-6 space-y-4 flex flex-col items-center justify-center gap-4">
        <DeviceCard 
            browser={deviceInfo.browser}
            os={deviceInfo.os}
            device={deviceInfo.device}
            ip={deviceInfo.ip}
            fingerprint={deviceInfo.fingerprint}
            isOnline={true}
        />
        
    </div>
  )
}
export default DeviceView