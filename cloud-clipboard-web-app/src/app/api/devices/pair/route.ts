import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";
import crypto from "crypto";

// Helper Function
function generateCode() {
    return crypto.randomBytes(6).toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, 8)
        .toUpperCase();
}

export async function POST(req: Request) {
    try {
        const { userId, type } = await req.json();
        if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

        const code = generateCode();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 Minuten gültig

        const existingPending = await prisma.device.findFirst({
           where: { userId, fingerprint: "PENDING" },
        });

        let device;
        if (existingPending) {
        // Wenn vorhanden → updaten
            device = await prisma.device.update({
                where: { id: existingPending.id },
                data: {
                verificationCode: code,
                codeExpiresAt: expiresAt,
                type: type ?? "desktop",
                },
            });
        } else {
        // Neues Gerät anlegen
            device = await prisma.device.create({
                data: {
                userId,
                verificationCode: code,
                codeExpiresAt: expiresAt,
                type: type ?? "desktop",
                fingerprint: "PENDING",
                browser: "unknown",
                os: "unknown",
                deviceType: "unknown",
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