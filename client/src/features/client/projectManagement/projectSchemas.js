import { z } from "zod";

export const projectCreateSchema = z.object({
  title: z
    .string()
    .min(5, "Project title must be at least 5 characters"),

  description: z
    .string()
    .min(50, "Project description must be at least 50 characters"),

  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),

  deliverables: z
    .string()
    .min(10, "Deliverables must be at least 10 characters"),

  category: z
    .string()
    .min(1, "Category is required"),

  skills: z
    .array(z.string().min(1))
    .min(1, "At least one skill is required"),

  budget: z
    .number()
    .positive("Budget must be greater than 0"),

  deliveryDays: z
    .number()
    .positive("Delivery days must be greater than 0")
    .max(2,"Delivery days must below 100")
});
