import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});