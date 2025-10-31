"use client";
import { getDeviceInfo } from "@/lib/getDeviceInfo";
import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DevicePairingModal from "../components/DevicePairingModal";
import { toast } from "sonner";

interface Device {
    id: string;
    browser: string;
    os: string;
    deviceType: string;
    ip: string;
    fingerprint: string;
    lastSeenAt: string;
    isOnline: boolean;
}

/**
 * DeviceView component
 *
 ** Displays a list of all registered devices for the currently authenticated user.
 *
 * - Fetches user devices from `/api/devices` based on Supabase user ID.
 * - Detects the current device using `getDeviceInfo()`.
 * - Highlights the active device and allows pairing new ones via modal.
 * - Handles loading states and empty lists gracefully.
 *
 * @returns {JSX.Element} The rendered device management view.
 */
const DeviceView = () => {

    const [devices, setDevices] = useState<Device[]>([]);
    const [currentDevice, setCurrentDevice] = useState<any>(null);
    const [loading, setLoading] = useState(true); 
    const session = useAuthStore((s) => s.session);
    const authLoading = useAuthStore((s) => s.loading); 
    const [pairModalOpen, setPairModalOpen] = useState(false);

    useEffect(() => {
        
        const loadDevices = async () => {
            try {

                // Wait until authentication state is resolved
                if (authLoading) {
                    return;
                }

                const userId = session?.user?.id;

                if (!userId) {
                    console.error("No user found")
                    setLoading(false);
                    return;
                }

                // Fetch registered devices for current user
                const res = await fetch(`/api/devices?userId=${userId}`);
                const deviceData = await res.json();

                // Get info about the current browser/device
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
    }, [session]);

    async function handleDeviceLogout(deviceId: string) {
        try {
            const res = await fetch(`/api/devices?id=${deviceId}`, {
                method: "DELETE",
            });

            if (!res.ok)  throw new Error("Failed to delete device.");

            toast.success("Device deleted successfully.");
            setDevices(prev => prev.filter(d => d.id !== deviceId));

        } catch (err) {
            console.log(err);
            toast.error("Device deletion failed.")
        }
    }

    // Show spinner while loading
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen gap-4">
            <Spinner/>
            <p className="text-gray-600 text-lg">
                Load Device Data....
            </p>
        </div>
    ) 

    // Handle case: no devices found
    if (!devices || devices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg">No devices found for this account.</p>
            </div>
        )
    }

  return (
    <div className="p-6 space-y-4 flex flex-col items-center justify-center gap-4 bg-muted">
      
      {/* Device pairing modal trigger */}
      <div className="mb-12">
        <Button 
            onClick={() => setPairModalOpen(true)}
            className="bg-blue cursor-pointer hover:scale-105 transition-all"><Plus/>  Pair a new Device</Button>
      </div>
      
      {/* Pairing modal */}
      <DevicePairingModal open={pairModalOpen} onClose={() => setPairModalOpen(false)}/>
    
      {/* List of registered devices */}
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          browser={device.browser}
          os={device.os}
          device={device.deviceType}
          ip={device.ip}
          fingerprint={device.fingerprint}
          lastSeenAt={new Date(device.lastSeenAt).toLocaleString()}
          isOnline={device.isOnline}
          onLogout={() => handleDeviceLogout(device.id)}
        />
      ))}
    </div>
  )
}
export default DeviceView