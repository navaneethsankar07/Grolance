import { z } from "zod";

export const projectCreateSchema = z
  .object({
    title: z
      .string()
      .min(5,'Title must be greater than 5 characters')
      .max(255,'Title must be less than 255 characters')
      .regex(/^[^0-9]*.$/, "Title cannot contain numbers")
      .regex(/^[a-zA-Z0-9\s\./:]*$/, "Full name can only contain letters and spaces"),
    description: z.string().min(50,'Description must be greater than 50 characters').max(600,'Description must be less than 600 characters'),
    requirements: z.string().min(20,'Requirements must be greater than 20 characters').max(600,'Requirements must be less than 600 characters'),
    expected_deliverables: z.string().min(20,'Must be greater than 20 characters').max(600,'Must be less than 600 characters'),
    category: z.preprocess((val) => Number(val), z.number().min(1)),
    skills: z
      .array(z.string().regex(/^[^0-9]*$/, "Title cannot contain numbers")
      .regex(/^[a-zA-Z\s\.]*$/, "Skill can only contain letters and spaces"))
      .min(3)
      
      ,
    pricing_type: z.enum(["fixed", "range"]),

    fixed_price: z.number().positive().nullish().optional(),
    min_budget: z.number().positive().nullish().optional(),
    max_budget: z.number().positive().nullish().optional(),

    delivery_days: z.number().int().positive().max(99),
  })
  .superRefine((data, ctx) => {
    if (data.pricing_type === "fixed") {
      if (data.fixed_price == null) {
        ctx.addIssue({
          path: ["fixed_price"],
          message: "Fixed price is required",
        });
      }
    }

    if (data.pricing_type === "range") {
      if (data.min_budget == null || data.max_budget == null) {
        ctx.addIssue({
          path: ["min_budget"],
          message: "Budget range is required",
        });
        return;
      }

      if (data.min_budget >= data.max_budget) {
        ctx.addIssue({
          path: ["max_budget"],
          message: "Max budget must be greater than min budget",
        });
      }
    }
  });
