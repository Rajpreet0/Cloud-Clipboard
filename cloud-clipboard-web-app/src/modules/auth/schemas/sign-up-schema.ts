import {z} from "zod";

/**
 ** Zod validation schema for user sign-up form.
 *
 * - Validates username (length, allowed characters).
 * - Ensures email format correctness.
 * - Enforces strong password rules (uppercase, lowercase, number, special character).
 * - Confirms that password and confirmPassword fields match.
 *
 * @example
 * signUpSchema.parse({
 *   username: "John_Doe",
 *   email: "john@example.com",
 *   password: "StrongP@ss1",
 *   confirmPassword: "StrongP@ss1"
 * });
 */
export const signUpSchema = z.object({
  username: z
    .string()
    .min(2, {message: "Username must be at least 2 characters",})
    .max(32, {message: "Username must be at most 32 characters long"})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers and underscores",
    }),
  email: z
    .string()
    .min(1, {message: "Email is required"})
    .email({ message: "Please enter a valid email address"}),
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

export type SignUpFormValues = z.infer<typeof signUpSchema>;