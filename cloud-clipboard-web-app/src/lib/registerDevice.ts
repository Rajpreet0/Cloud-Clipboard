import { getDeviceInfo } from "./getDeviceInfo";

/**
 ** Register the current device for a given user by sending
 ** device information to the `/api/devices` endpoint.
 * 
 * - Gather browser/device details via `getDeviceInfo()`
 * - Fails silently if no device info is available or the request fails
 * 
 * @param {string} userId  - The Supabase or applicaiton user ID.
 * @returns {Promise<void>} Resolves when registration completes.
 */
export async function registerDevice(userId: string) {
    try {
        // Helper Function to get basic Device Infos.
        const info = await getDeviceInfo();
        if (!info) return;

        // Persist device details on the backend
        await fetch("/api/devices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userId, ...info})
        });

    } catch (err) {
        console.log("Device registration failed: ", err);
    }
}