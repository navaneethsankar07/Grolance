import { z } from "zod";

export const stepSixSchema = z.object({
  bankDetails: z.object({
    fullName: z
      .string()
      .min(5, "Full name is required")
      .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
    accountNumber: z
      .string()
      .min(9, "Account number is too short")
      .max(18, "Account number is too long")
      .regex(/^\d+$/, "Account number must contain only digits"),
    confirmAccountNumber: z.string().min(1, "Please confirm your account number"),
    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format (e.g., SBIN0001234)"),
    bankName: z.string().min(2, "Bank name is required"),
    isConfirmed: z.literal(true, {
      errorMap: () => ({ message: "You must confirm your details" }),
    }),
  }).refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Account numbers do not match",
    path: ["confirmAccountNumber"],
  }),
});