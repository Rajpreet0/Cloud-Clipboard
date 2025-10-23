import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";

const allowedOrigins = [
  "http://localhost:5123",  // Electron
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

        const { authToken } = await req.json();

        if (!authToken) {
            return NextResponse.json({ valid: false, error: "Missing authToken" }, { status: 400 });
        }

        // Device + User 
        const device = await prisma?.device.findFirst({
            where: { authToken },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            }
        });

        if (!device || !device.user) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        // Last Seen Update
        await prisma.device.update({
            where: {
                id: device.id
            },
            data: {
                lastSeenAt: new Date(),
                isOnline: true
            },
        });

        return new NextResponse(JSON.stringify({
            valid: true,
            user: device.user,
            device: {
                deviceId: device.deviceId,
                lastSeenAt: device.lastSeenAt,
            }
        }), { status: 200, headers: resHeaders });
    } catch (err) {
        console.log("[DEVICE_ME_ERROR]", err);
        return new NextResponse(JSON.stringify({error: "Internal server Error"}), {
            status: 500,
            headers: { "Access-Control-Allow-Origin": "*" }
        })
    }
}