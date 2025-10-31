import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";
import crypto from "crypto";

/**
 ** Generates a short, human-readable verification code.
 *
 * - Uses cryptographically secure random bytes.
 * - Removes special characters and converts to uppercase.
 * - Result: 8-character alphanumeric string.
 *
 * @returns {string} A unique verification code.
 */
function generateCode() {
    return crypto.randomBytes(6).toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, 8)
        .toUpperCase();
}

/**
 ** Handles POST requests for device pairing initiation.
 *
 * - Generates a temporary verification code valid for 2 minutes.
 * - If a "PENDING" device already exists for the user → updates it with a new code.
 * - Otherwise, creates a new placeholder device entry with default metadata.
 * - Returns the verification code, its expiry, and device ID for client display.
 *
 * @param {Request} req - HTTP request containing `userId` and optional `type` (e.g. "desktop" or "mobile").
 * @returns {Promise<NextResponse>} JSON response with pairing code details.
 */
export async function POST(req: Request) {
    try {
        const { userId, type } = await req.json();
        if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

        const code = generateCode();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 Minuten gültig

        // Check for existing pending device entry
        const existingPending = await prisma.device.findFirst({
           where: { userId, fingerprint: "PENDING" },
        });

        let device;
        // Update existing pending device with new code
        if (existingPending) {
            device = await prisma.device.update({
                where: { id: existingPending.id },
                data: {
                    verificationCode: code,
                    codeExpiresAt: expiresAt,
                    deviceType: type ?? "desktop",
                },
            });
        } else {
            // Create new pending device record
            device = await prisma.device.create({
                data: {
                userId,
                verificationCode: code,
                codeExpiresAt: expiresAt,
                fingerprint: "PENDING",
                browser: "unknown",
                os: "unknown",
                deviceType: type ?? "desktop",
                ip: "unknown",
                },
            }); 
        }

        return NextResponse.json({
            verificationCode: code,
            expiresAt,
            deviceId: device.deviceId,
        })

    } catch (err) {
        console.error("[DEVICE_PAIR_ERROR]", err);
        return NextResponse.json({ error: "Failed to create pairing code"}, { status: 500 });
    }
}