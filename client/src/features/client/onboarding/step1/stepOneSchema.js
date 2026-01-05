import z from "zod";

export const stepOneSchema = z.object({
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(100, "Tagline is too long"),
  bio: z
    .string()
    .min(50, "Bio should be at least 50 characters to attract clients")
    .max(500, "Bio cannot exceed 500 characters"),
  phone: z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms to continue"),
});
