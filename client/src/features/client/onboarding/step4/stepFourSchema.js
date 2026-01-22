import { z } from "zod";

export const stepFourSchema = z.object({
  portfolios: z
    .array(
      z.object({
        title: z.string().min(10, "Title is too short").max(50, "Title is too long"),
        description: z.string().min(10, "Description is too short").max(300),
        image_url: z.string().url().optional(),
        files: z.array(z.any()).optional(), 
      }).refine(data => data.image_url || (data.files && data.files.length > 0), {
        message: "Image is required",
        path: ["files"],
      })
    )
    .min(1, "Please add at least one portfolio item")
    .max(3, "Maximum 3 items allowed"),
});