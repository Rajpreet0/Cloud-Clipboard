import { UAParser } from "ua-parser-js";
import FingerprintJs from "@fingerprintjs/fingerprintjs";

export async function getDeviceInfo() {
    if (typeof window === "undefined") return null;

    const parser = new UAParser();
    const result = parser.getResult();

    let ip = "Unknown";
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ip = data.ip;
    } catch (err) {
        console.error("Fehler beim Abrufen der IP-Adressen:", err);
    }

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