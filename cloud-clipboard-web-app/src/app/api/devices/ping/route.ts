import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";


export async function PATCH(req: Request) {
    try {
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token)
            return NextResponse.json({ error: "Missing token" }, { status: 401 });

        const device = await prisma.device.findFirst({
            where: { authToken: token },
        });

        if (!device)
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        await prisma.device.update({
            where: { id: device.id },
            data: { lastSeenAt: new Date(), isOnline: true },
        });


        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[DEVICE_PING_ERROR]", err);
        return NextResponse.json({ error: "Ping failed" }, { status: 500 });       
    }
}