import {z} from "zod";

/**
 * Zod validation schema for resetting a user's password.
 *
 * - Enforces strong password policy (uppercase, lowercase, number, special character).
 * - Ensures the confirmation password matches the new password.
 *
 * @example
 * resetPasswordSchema.parse({
 *   password: "SecureP@ss1",
 *   confirmPassword: "SecureP@ss1"
 * });
 */
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, {
            message: "Password must contain at least one special character",
        }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;