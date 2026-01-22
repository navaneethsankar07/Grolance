import { z } from "zod";

export const stepFourSchema = z.object({
  portfolios: z
    .array(
      z.object({
        title: z.string().min(10, "Title is too short").max(50, "Title is too long"),
        description: z.string().min(10, "Description is too short").max(300),
        files: z.array(z.any()).length(1, "Exactly one image is required per item"),
      })
    )
    .min(1, "Please add at least one portfolio item")
    .max(3, "Maximum 3 items allowed"),
});


