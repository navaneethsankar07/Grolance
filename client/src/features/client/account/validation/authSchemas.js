import {z} from 'zod'


// Signup Schema
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters long")
      .regex(/^[^0-9]*$/, "Full name cannot contain numbers")
      .regex(/^[a-zA-Z\s]*$/, "Full name can only contain letters and spaces"),

    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@, #, $, etc.)",
      }),

    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });