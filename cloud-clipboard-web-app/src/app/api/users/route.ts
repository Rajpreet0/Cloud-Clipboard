import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, email, fullName, avatarUrl } = body;

        if (!id || !email) {
            return NextResponse.json({ error: "Missing fields" }, {status: 400});
        }

        // Check if the User existed
        const existingUser = await prisma.user.findUnique({
            where: {id},
        });

        if (existingUser) {
            return NextResponse.json({
                user: existingUser
            }, {
                status: 200
            });
        }

        // If User not existed then create a new User
        const newUser = await prisma.user.create({
            data: {
                id,
                email,
                fullName,
                avatarUrl,
            },
        });


        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}