"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

interface DevicePairingModalProps {
    open: boolean;
    onClose: () => void;
}

const DevicePairingModal: React.FC<DevicePairingModalProps> = ({ open, onClose }) => {

  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  // Generate new pairing code
  const generatePairCode = async () => {
    if (!session?.user) return toast.error("Not authenticated");

    try {
        setLoading(true);

        const res = await fetch("/api/devices/pair", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id, type: "desktop" }),
        });

        if (!res.ok) throw new Error("Failed to create code");
        const data = await res.json();

        setPairCode(data.verificationCode);
        setExpiresAt(new Date(data.expiresAt));
        setCountdown(Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000));

    } catch (err) { 
        console.error(err);
        toast.error("Failed to create pairing code.");
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
        const remaining = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
        setCountdown(remaining > 0 ? remaining : 0);
        if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (!open) {
        setPairCode(null);
        setExpiresAt(null);
        setCountdown(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6 space-y-6">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-center">Pair a new Device</DialogTitle>
            </DialogHeader>

            {!pairCode ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Spinner/>
                            <p className="text-gray-500">Generating code...</p>
                        </div>
                    ) : (
                        <Button onClick={generatePairCode} className="bg-blue hover:bg-blue-700">
                            Generate Pairing code
                        </Button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center">
                        <p className="text-gray-500 mb-2">Enter this code in your Desktop or Mobile App</p>
                        <p className="text-3xl font-mono tracking-widest">{pairCode}</p>
                    </div>

                    <div className="border rounded-lg p-4 bg-white">
                        <QRCode value={pairCode} size={128}/>
                    </div>

                    <p className="text-gray-600 text-sm">
                        Expires in{" "}
                        <span className={countdown <= 10 ? "text-red-500 font-bold" : "text-blue-600 font-semibold"}>
                            {countdown}s
                        </span>
                    </p>

                    {countdown <= 0 && (
                        <Button variant="outline" onClick={generatePairCode}>
                            Refresh Code
                        </Button>
                    )}
                </div>
            )}
        </DialogContent>
    </Dialog>
  )
}

export default DevicePairingModal