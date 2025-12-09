import { useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "./InputBox";
import {zodResolver} from '@hookform/resolvers/zod'
import { signupSchema } from "../validation/authSchemas";
export default function SignupForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  function handleSignup(data) {
  console.log("VALID DATA:", data);
}

  const password = watch("password");
  return (
    <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col flex-1">

      <InputBox
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        register={register}
        validation={{
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Enter a valid email",
          },
        }}
        error={errors.email}
      />

      <InputBox
        label="Full Name"
        name="fullName"
        placeholder="Enter your full name"
        register={register}
        validation={{ required: "Full name is required" }}
        error={errors.fullName}
      />

      <InputBox
        label="Password"
        name="password"
        placeholder="Create your password"
        register={register}
        validation={{
          required: "Password is required",
          minLength: { value: 6, message: "At least 6 characters" },
        }}
        error={errors.password}
        passwordToggle
      />

      <InputBox
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Re-enter your password"
        register={register}
        validation={{
          required: "Confirm password is required",
          validate: (value) =>
            value === watch("password") || "Passwords do not match",
        }}
        error={errors.confirmPassword}
        passwordToggle
      />

      <button
        type="submit"
        className="w-full h-[47px] rounded-[40px] bg-[#3B82F6] hover:bg-[#3B82F6]/90 font-poppins font-medium text-xl text-white mt-4"
      >
        Create an account
      </button>
    </form>
  );
}