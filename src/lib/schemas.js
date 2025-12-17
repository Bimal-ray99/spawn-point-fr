import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  gamerTag: z
    .string()
    .min(3, "Gamer tag must be at least 3 characters")
    .max(50)
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,10}$/, "Phone number must be 10 digits"),
  dateOfBirth: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});
