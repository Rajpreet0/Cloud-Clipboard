import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { verificationCode, browser, os, deviceType, ip, fingerprint } = await req.json();
        if (!verificationCode)
            return NextResponse.json({ error: "Missing code" }, { status: 400 });

        const device = await prisma.device.findFirst({
            where: { verificationCode }
        });

        if (!device) 
            return NextResponse.json({ error: "Invalid code" }, { status: 404 })

        if (device.codeExpiresAt && device.codeExpiresAt < new Date())
            return NextResponse.json({ error: "Code expired" }, { status: 410 });
        
        const authToken = crypto.randomBytes(48).toString("hex");

        const updated = await prisma.device.update({
            where: { id: device.id },
            data: {
                authToken,
                verificationCode: null,
                codeExpiresAt: null,
                browser: browser ?? "unknown",
                os: os ?? "unknown",
                deviceType: deviceType ?? "unknown",
                ip: ip ?? "unknown",
                fingerprint: fingerprint ?? crypto.randomUUID(),
            },
        });

        return NextResponse.json({
            userId: updated.userId,
            authToken,
            deviceId: updated.deviceId,
        });
    } catch (err) {
        console.error("[DEVICE_VERIFY_ERROR]", err);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}