import { getDeviceInfo } from "./getDeviceInfo";


export async function registerDevice(userId: string) {
    try {
        const info = await getDeviceInfo();
        if (!info) return;

        await fetch("/api/devices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userId, ...info})
        });

    } catch (err) {
        console.log("Device registration failed: ", err);
    }
}