import { NextResponse } from "next/server";
import { prisma } from "@/lib/supabase/prisma";

/**
 ** Handles POST request to create or fetch a user in the database
 * 
 * - Validates the incoming request body for required fields (`id`, `email`).
 * - Checks if a user already exists in the database
 * - If the user exists → returns it with status 200
 * - If not → creates a new user record and returns it with satus  201
 * - Handles unexpected errors with a 500 response.
 * 
 * @param {Request} request - Incoming HTTP request containing user data in JSON format.
 * @returns {Promise<NextResponse>} JSON response with existing or newly created user.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, email, fullName, avatarUrl } = body;

        // Validate required fields
        if (!id || !email) {
            return NextResponse.json({ error: "Missing fields" }, {status: 400});
        }

        // Check if the user already exists in the database
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

        // Create new user if not found
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