import React, { useState } from 'react';
import ModalWrapper from './components/ModelWrapper';
import { useModal } from '../../../hooks/modal/useModalStore';
import { verifyOtp } from '../../../api/auth/authApi';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp({email}) {
    const { closeModal, openModal } = useModal();
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate()
  
 const handleBack = () => {
    openModal("signup"); 
  };

  const handleVerify = async ({otp}) => {
  try {
    const res = await verifyOtp({email, otp_code:otp});
    navigate('/home')
    closeModal("otp")
    console.log("OTP Verified:", res);
  } catch (err) {
    console.error("OTP Error:", err.response?.data);
  }
};

  return (
    <ModalWrapper onClose={closeModal}>

      <form
        onSubmit={handleSubmit(handleVerify)}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 md:p-12 text-center relative"
      >
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Go back to previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enter Verification Code
        </h1>
        <p className="text-gray-600 mb-8">
          We've sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <div className="flex justify-center mb-2">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit code"
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
            })}
            className={`
              w-full max-w-xs h-14 
              text-xl text-center font-medium
              border-2 rounded-lg 
              border-gray-300
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
              transition-all duration-150
            `}
          />
        </div>
        {errors.otp && (
          <p className="text-red-500 text-xs mb-4">{errors.otp.message}</p>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-lg 
            font-semibold text-white text-lg 
            bg-[#3B82F6] hover:bg-[#3B82F6]/90
            transition-colors duration-200"
        >
          Verify OTP
        </button>

        <div className="mt-6 text-sm text-gray-600">
          Didn't receive the code?
          <button
            type="button"
            className="ml-2 font-semibold text-[#3B82F9] hover:text-[#3B82F6]/90 transition-colors"
          >
            Resend Code
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}