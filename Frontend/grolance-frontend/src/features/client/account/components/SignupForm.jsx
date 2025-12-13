import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "./InputBox";
import {zodResolver} from '@hookform/resolvers/zod'
import { signupSchema } from "../validation/authSchemas";
import { sendOtp } from "../../../../api/auth/authApi";
import { useModal } from "../../../../hooks/modal/useModalStore";
export default function SignupForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {openModal, setSignupData, signupData} = useModal()
  const [backendError, setBackendError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const handleSignup = async (formData)=> {
    try {
    setSignupData(formData);
    const res = await sendOtp(formData);

    console.log("User registered:", res);

    openModal("otp",{email:formData.email})
  } catch (err) {
  if (err.response?.data) {
    const backendData = err.response.data;
    const firstField = Object.keys(backendData)[0];
    const firstMessage = backendData[firstField][0];
    setBackendError(firstMessage);
    console.log("Error Message:", backendData);
  }else {
    setBackendError("Something went wrong. Please try again.");
  }
}
};

  useEffect(() => {
    if (signupData) {
      reset(signupData);
    }
  }, [signupData, reset]);


  const password = watch("password");
  return (
    <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col flex-1">
      {backendError && (
  <p className="text-red-500 text-sm my-2 text-center">{backendError}</p>
)}

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

      <button onClick={() => handleSignup}
        type="submit"
        className="w-full h-[47px] rounded-[40px] bg-[#3B82F6] hover:bg-[#3B82F6]/90 font-poppins font-medium text-xl text-white mt-4"
      >
        Create an account
      </button>
      <div className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <button onClick={()=>openModal('signin')} className="text-blue-500 font-semibold hover:underline">
                Login
              </button>
            </div>
    </form>
  );
}