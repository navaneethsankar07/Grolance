import { z } from "zod";

const packageTierSchema = z.object({
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .int("Price must be a whole number")
    .min(100, "Minimum price is ₹100")
    .max(500000, "Price is too high"),
  deliveryTime: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(1, "Minimum 1 day")
    .max(100, "Maximum 100 days"),
  description: z
    .string()
    .min(20, "Description is too short")
    .max(400, "Description is too long"),
});

export const stepThreeSchema = z.object({
  packages: z.object({
    starter: packageTierSchema,
    pro: packageTierSchema,
  }),
});
