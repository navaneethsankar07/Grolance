import { z } from "zod";

export const projectCreateSchema = z
  .object({
    title: z.string().min(5),
    description: z.string().min(50),
    requirements: z.string().min(20),
    expected_deliverables: z.string().min(10),

    category: z.string().min(1),
    skills: z.array(z.string()).min(1),

    pricing_type: z.enum(["fixed", "range"]),

    fixed_price: z.number().positive().optional(),
    min_budget: z.number().positive().optional(),
    max_budget: z.number().positive().optional(),

    delivery_days: z
      .number()
      .int()
      .positive()
      .max(99),
  }).superRefine((data, ctx) => {
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
