import { UAParser } from "ua-parser-js";
import FingerprintJs from "@fingerprintjs/fingerprintjs";

/**
 ** Collects detailed client device information for session tracking.
 * 
 * - Uses `ua-parser-js` to detect browser, OS, and device type.
 * - Fetches public IP address via `api.ipfy.org`.
 * - Generates a unique browser fingerprint using `@fingerprintjs/fingerprintjs`.
 * - Returns `null` when executed on the server (SSR-safe).
 * 
 * @returns {Promise<{
 *  browser: string;
 *  os: string;
 *  device: string;
 *  ip: string;
 *  fingerprint: string;
 * } | null>} Object containing device information, or null if unavailable.
 */
export async function getDeviceInfo() {
    // Prevent SSR execution
    if (typeof window === "undefined") return null;

    const parser = new UAParser();
    const result = parser.getResult();

    // Get public IP
    let ip = "Unknown";
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ip = data.ip;
    } catch (err) {
        console.error("Fehler beim Abrufen der IP-Adressen:", err);
    }

    // Generate browser fingerprint
    let fingerprint = "Unavailable";
    try {
        const fp = await FingerprintJs.load();
        const result = await fp.get();
        fingerprint = result.visitorId;
    } catch (err) {
        console.error("Error generating fingerprint: ", err);
    }

    return {
        browser: result.browser.name  || "Unknown",
        os: result.os.name || "Unknown",
        device: result.device.type || "Desktop",
        ip,
        fingerprint
    };
}