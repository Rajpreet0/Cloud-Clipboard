import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, fingerprint, browser, os, device, ip } = body;

        if (!fingerprint) {
            return NextResponse.json({ error: "Missing fingerprint" }, { status: 400 });
        }

        // Update lastSeenAt if device already exists
        const existing = await prisma.device.findFirst({
            where: { fingerprint, userId }
        });

        if (existing) {
            const updated = await prisma.device.update({
                where: { id: existing.id },
                data: { lastSeenAt: new Date(), ip }
            });
            return NextResponse.json(updated, { status: 200 });
        }

        // Otherwise create a new entry
        const newDevice = await prisma.device.create({
            data: {
                userId,
                fingerprint,
                browser,
                os,
                deviceType: device,
                ip
            }
        });

        await prisma.device.deleteMany({
            where: {
                verificationCode: { not: null },
                codeExpiresAt: { lt: new Date() },
            }
        })

        return NextResponse.json(newDevice, { status: 201 });
    } catch (error: any) {
        console.error("Error creating Device Entry: ", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const devices = await prisma.device.findMany({
            where: { userId }, 
            orderBy: { lastSeenAt: 'desc' }
        });

        
        return NextResponse.json(devices, { status: 200 });
    } catch (error) {
        console.error("[DEVICE_GET_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if(!id) {
            return NextResponse.json({error: "Missing device ID"}, { status: 400 });
        }

        await prisma.device.delete({
            where: {id},
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("DEVICE_DELETE_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}