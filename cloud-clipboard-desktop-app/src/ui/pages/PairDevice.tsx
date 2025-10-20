import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PairDevice = () => {

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  async function handlePair() {
    try {
      setStatus("loading");
      setMessage("");

      const res = await fetch("http://localhost:3000/api/devices/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          deviceInfo: {
            browser: "Desktop App",
            os: window.navigator.platform,
            deviceType: "Desktop",
            fingerprint: crypto.randomUUID(),
            ip: "Unkown" //TODO: OPTIONAL FETCH 
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pairing failed.");

      // Save securly in Electron Save
      await window.secureStore.saveAuth({
        authToken: data.authToken,
        deviceId: data.deviceId,
      });

      setAuth({ authToken: data.authToken, deviceId: data.deviceId });

      setStatus("success");
      setMessage("Device paired successfully!");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to pair device.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Pair your Device</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Enter the pairing code displayed in your web dashboard to connect this device
        with your Cloud Clipboard account.
      </p>

      <Input
        type="text"
        placeholder="Enter pairing code"
        maxLength={8}
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="mt-12 rounded-lg px-4 py-2 w-[300px] h-[40px] font-bold !text-lg text-center text-blue border-2 border-gray-300 focus:border-blue uppercase 
        tracking-widest placeholder:tracking-normal placeholder:normal-case placeholder:font-normal placeholder:!text-sm"
      />

      {/* Pair Device Button */}
      <Button
        onClick={handlePair}
        disabled={status === "loading" || !code}
        className="w-[150px] h-[35px] mt-12 rounded-lg text-lg bg-blue text-white hover:scale-105 hover:shadow-lg transition-all cursor-pointer"
      >
        {status === "loading" ? "Pairing..." : "Pair Device"} 
      </Button>

      {message && (
        <p className={`mt-4 text-sm ${
          status === "error" ? "text-red-600" : "text-green-500"
        }`}>
          {message}
        </p>
      )}

      <Link to="/" className="mt-12 !text-blue hover:underline">
        ← Back to Home
      </Link>
    </div>
  )
}

export default PairDevice