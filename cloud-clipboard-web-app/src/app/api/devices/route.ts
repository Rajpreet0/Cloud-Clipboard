import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";


/**
 ** Handles POST requests to register or update a user's device in the database.
 *
 * - If a device with the same `fingerprint` and `userId` exists → updates `lastSeenAt` and `ip`.
 * - Otherwise creates a new device record with browser, OS, and device details.
 * - Automatically cleans up expired verification codes after each call.
 *
 * @param {Request} request - Incoming HTTP request with device info in JSON format.
 * @returns {Promise<NextResponse>} JSON response with the created or updated device entry.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, fingerprint, browser, os, device, ip } = body;

        // Validate required fields
        if (!fingerprint) {
            return NextResponse.json({ error: "Missing fingerprint" }, { status: 400 });
        }

        // Check if the device already exists
        const existing = await prisma.device.findFirst({
            where: { fingerprint, userId }
        });

        // Update `lastSeenAt` if device is already registered
        if (existing) {
            const updated = await prisma.device.update({
                where: { id: existing.id },
                data: { lastSeenAt: new Date(), ip }
            });
            return NextResponse.json(updated, { status: 200 });
        }

        // Otherwise, create a new device record
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

        // Cleanup expired verification codes
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

/**
 ** Handles GET requests to retrieve all devices for a given user.
 *
 * - Expects a `userId` query parameter.
 * - Returns devices ordered by their last activity date (`lastSeenAt` descending).
 *
 * @param {Request} req - HTTP request containing `userId` in query params.
 * @returns {Promise<NextResponse>} JSON response with the user's device list.
 */
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

/**
 ** Handles DELETE requests to remove a device by its ID.
 *
 * - Expects an `id` query parameter representing the device ID.
 * - Deletes the device entry from the database.
 *
 * @param {Request} req - HTTP request containing the `id` query param.
 * @returns {Promise<NextResponse>} JSON response confirming deletion.
 */
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