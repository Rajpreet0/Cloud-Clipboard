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
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

/**
 * POST /api/devices/validate
 * Body: { authToken: string }
 * 
 * Prüft, ob ein Device mit dem Token existiert.
 * Wenn ja → gültig, sonst ungültig.
 */
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

    const device = await prisma.device.findFirst({
      where: { authToken },
      select: {
        id: true,
        deviceId: true,
        userId: true,
        isOnline: true,
        lastSeenAt: true,
      },
    });

    if (!device) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

  
    await prisma.device.update({
      where: { id: device.id },
      data: { lastSeenAt: new Date(), isOnline: true },
    });

    return new NextResponse(JSON.stringify({
      valid: true,
      deviceId: device.deviceId,
      userId: device.userId,
    }), {status: 200, headers: resHeaders});
  } catch (err) {
    console.error("[DEVICE_VALIDATE_ERROR]", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
