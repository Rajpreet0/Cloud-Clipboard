import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";

const allowedOrigins = [
  "http://localhost:5123", 
  "app://.",
  "http://localhost:3000"
];

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function PATCH(req: Request) {
    try {
        const origin = req.headers.get("origin");
        const resHeaders = new Headers();

        if (origin && allowedOrigins.includes(origin)) {
            resHeaders.set("Access-Control-Allow-Origin", origin);
        } else {
            resHeaders.set("Access-Control-Allow-Origin", "*");
        }

        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token)
            return new NextResponse(JSON.stringify({ error: "Missing token" }), { status: 401, headers: resHeaders });

        const device = await prisma.device.findFirst({
            where: { authToken: token },
        });

        if (!device)
            return new NextResponse(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: resHeaders });

        await prisma.device.update({
            where: { id: device.id },
            data: { lastSeenAt: new Date(), isOnline: true },
        });


        return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers: resHeaders });
    } catch (err) {
        console.error("[DEVICE_PING_ERROR]", err);
        return new NextResponse(JSON.stringify({ error: "Ping failed" }), {
            status: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
        });  
    }
}