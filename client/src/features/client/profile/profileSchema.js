import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name is too short")
    .regex(/^[a-zA-Z\s]*$/, "Only letters allowed"),

  companyName: z.string().optional(),
  location: z.string().optional(),

  profileImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Image must be under 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG, PNG or WEBP allowed"
    ),
});
