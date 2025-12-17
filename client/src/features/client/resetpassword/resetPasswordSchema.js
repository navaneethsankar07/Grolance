import { z } from "zod";

//Reset Password schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Minimum 8 characters"),

    confirmPassword: z
      .string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
