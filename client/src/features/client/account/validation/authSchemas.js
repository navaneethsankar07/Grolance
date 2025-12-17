import {z} from 'zod'


// Signup Schema
export const signupSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters long"),

    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),

  

  password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),

    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",

})


// signin schema 
export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

