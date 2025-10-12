import {z} from "zod";

/**
 * Zod validation schema for user sign-in form.
 *
 * - Ensures that email is provided and valid.
 * - Validates that password meets minimum length requirements.
 *
 * @example
 * signInSchema.parse({
 *   email: "user@example.com",
 *   password: "MyStrongPass1"
 * });
 */
export const signInSchema = z.object({
    email: z
        .string()
        .min(1, {message: "Email is required"})
        .email({message: "Please enter a valid email address"}),
    password: z
        .string()
        .min(8, {message: "Password must be at least 8 characters long."})
})

export type SignInFormValues = z.infer<typeof signInSchema>;