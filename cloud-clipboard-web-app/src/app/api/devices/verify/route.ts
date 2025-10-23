import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";
import crypto from "crypto";

const allowedOrigins = [
  "http://localhost:5123", 
  "app://.",
  "http://localhost:3000"
];

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}


export async function POST(req: Request) {
    try {

        const origin = req.headers.get("origin");
        const resHeaders = new Headers();

        if (origin && allowedOrigins.includes(origin)) {
            resHeaders.set("Access-Control-Allow-Origin", origin);
        }

        const { code, deviceInfo } = await req.json();

        if (!code)
            return NextResponse.json({ error: "Missing code" }, { status: 400 });

        const device = await prisma.device.findFirst({
            where: { 
                verificationCode: code,
                codeExpiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!device) 
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })

        // Gnerates a Token
        const authToken = crypto.randomBytes(48).toString("hex");

        // Update Device
        const updatedDevice = await prisma.device.update({
            where: { id: device.id },
            data: {
                authToken,
                verificationCode: null,
                codeExpiresAt: null,
                isOnline: true,
                browser: deviceInfo?.browser ?? "Desktop",
                os: deviceInfo?.os ?? "Unknown",
                deviceType: deviceInfo?.deviceType ?? "Desktop",
                ip: deviceInfo?.ip ?? "Unknown",
                fingerprint: deviceInfo?.fingerprint || crypto.randomUUID(),
            },
        });

        return new NextResponse(
        JSON.stringify({
            success: true,
            authToken,
            deviceId: updatedDevice.deviceId,
        }),
        { status: 200, headers: resHeaders }
        );
    } catch (err) {
        console.error("[DEVICE_VERIFY_ERROR]", err);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
        });
    }
}