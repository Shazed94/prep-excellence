import { z } from "zod";

export const ZRegister = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["Student", "Referral", "Affiliate"]),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const ZLogin = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type TRegister = z.infer<typeof ZRegister>;
export type TLogin = z.infer<typeof ZLogin>;
