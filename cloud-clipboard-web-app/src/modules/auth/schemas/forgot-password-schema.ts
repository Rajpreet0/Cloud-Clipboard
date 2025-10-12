import {z} from "zod";

/**
 * Zod validation schema for the "Forgot Password" form.
 *
 * - Ensures that an email address is provided.
 * - Validates proper email formatting before sending the reset link.
 *
 * @example
 * forgotPasswordSchema.parse({
 *   email: "user@example.com"
 * });
 */
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, {message: "Email is required"})
        .email({message: "Please enter a valid email address"})
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;