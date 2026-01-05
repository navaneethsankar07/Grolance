import { z } from "zod";

export const stepTwoSchema = z.object({
  primaryCategory: z.string().min(1, "Please select a primary category"),
  skills: z
    .array(
      z.string()
        .min(2, "Skill name is too short")
        .refine((val) => !/^\d+$/.test(val), {
          message: "Skill cannot be only numbers",
        })
    )
    .min(3, "Please select at least 3 skills")
    .max(15, "You can add up to 15 skills"),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"], {
    errorMap: () => ({ message: "Please select your experience level" }),
  }),
});