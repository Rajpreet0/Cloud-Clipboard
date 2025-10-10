"use client";
import { getDeviceInfo } from "@/lib/getDeviceInfo";
import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase/client";

interface Device {
    id: string;
    browser: string;
    os: string;
    deviceType: string;
    ip: string;
    fingerprint: string;
    lastSeenAt: string;
}

const DeviceView = () => {

    const [devices, setDevices] = useState<Device[]>([]);
    const [currentDevice, setCurrentDevice] = useState<any>(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        
        const loadDevices = async () => {
            try {
                const { data: userData, error: userError } = await supabase.auth.getUser();
                
                if (userError || !userData.user) {
                    console.error("No user found")
                    setLoading(false);
                    return;
                }

                const userId = userData.user.id;

                const res = await fetch(`/api/devices?userId=${userId}`);
                const deviceData = await res.json();

                const info = await getDeviceInfo();

                setDevices(deviceData);
                setCurrentDevice(info);
            } catch (err) {
                console.error("Error loading devices:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDevices();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen gap-4">
            <Spinner/>
            <p className="text-gray-600 text-lg">
                Load Device Data....
            </p>
        </div>
    ) 

    if (!devices || devices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg">No devices found for this account.</p>
            </div>
        )
    }

  return (
    <div className="p-6 space-y-4 flex flex-col items-center justify-center gap-4">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          browser={device.browser}
          os={device.os}
          device={device.deviceType}
          ip={device.ip}
          fingerprint={device.fingerprint}
          lastSeenAt={new Date(device.lastSeenAt).toLocaleString()}
          isOnline={currentDevice?.fingerprint === device.fingerprint}
        />
      ))}
    </div>
  )
}
export default DeviceView