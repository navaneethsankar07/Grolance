import { z } from "zod";

export const stepSixSchema = z.object({
  paymentDetails: z.object({
    paypalEmail: z
      .string()
      .email("Invalid PayPal email address")
      .min(5, "Email is required"),
    isConfirmed: z.literal(true, {
      errorMap: () => ({ message: "You must confirm your details" }),
    }),
  }),
});