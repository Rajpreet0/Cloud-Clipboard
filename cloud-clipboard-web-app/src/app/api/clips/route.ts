import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";

const allowedOrigins = [
  "http://localhost:5123", // Electron Dev
  "app://.",
  "http://localhost:3000", // Web
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

        const headers = new Headers();
        headers.set(
            "Access-Control-Allow-Origin",
            allowedOrigins.includes(origin ?? "") ? origin! : "*"
        );

        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) {
            return new NextResponse(JSON.stringify({ error: "Missing token" }), {
                status: 401,
                headers
            });
        }

        const device = await prisma.device.findFirst({
            where: { authToken: token },
            include: { user: true }
        });

        if (!device || !device.user) {
            return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
                status: 401,
                headers,
            });
        }

        const body = await req.json();
        const { type, data } = body;

        if (!type || !data) 
            return new NextResponse(JSON.stringify({error: "Missing fields"}), {
                status: 400,
                headers,
            });
    
        const clip = await prisma.clip.create({
            data: {
                userId: device.user.id,
                deviceId: device.id,
                content: data,
                type: type.toUpperCase(),
            },
        });

        return new NextResponse(JSON.stringify(clip), { status: 201, headers });
    } catch (err) {
        console.error("[CLIP_CREATE_ERROR]", err);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({error: "Missing userId"}, { status: 400 });
        }

        const clips = await prisma.clip.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(clips, {status: 200});

    } catch (err) {
        console.error("[CLIP_GET_ERROR]", err);
        return NextResponse.json({error: "Internal server error."}, { status: 500 });
    }
}