import React, { useState, useEffect } from 'react';
import ModalWrapper from './components/ModelWrapper';
import { useModal } from '../../../hooks/modal/useModalStore';
import { verifyOtp } from '../../../api/auth/authApi';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './auth/authslice';
import { resendOtp } from "../../../api/auth/authApi";
import { toast } from 'react-toastify';

export default function VerifyOtp({ email }) {
  const dispatch = useDispatch();
  const { closeModal, openModal } = useModal();
  const navigate = useNavigate();
  const [error,setError] = useState('')
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();


  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleBack = () => openModal("signup");

  const handleVerify = async ({ otp }) => {
    try {
      const res = await verifyOtp({ email, otp_code: otp });

      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.access,
        })
      );

      closeModal();
      navigate("/");
      toast.success("Welcome To Grolance")
    } catch (err) {
       const message =
    err.response?.data?.error ||
    err.response?.data?.message ||
    "Invalid or expired OTP";

  setError(message);
  toast.error(message)
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await resendOtp({ email });
      setTimer(60);
      setCanResend(false);
      toast.success('Otp sent! check your email')
    } catch (err) {
      toast.error("Resend OTP Error:", err.response?.data || err.message);
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
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        {error && (
  <p className="text-red-500 text-sm my-2 text-center">{ error}</p>
)}

        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit code"
          {...register("otp", {
            required: "OTP is required",
            minLength: { value: 6, message: "OTP must be 6 digits" },
            maxLength: { value: 6, message: "OTP must be 6 digits" },
          })}
          className="w-full max-w-xs h-14 text-xl text-center font-medium border-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150"
        />

        {errors.otp && (
          <p className="text-red-500 text-xs mb-4">{errors.otp.message}</p>
        )}

        <button
          type="submit"
          className="w-full max-w-xs h-12 rounded-lg font-semibold text-white text-lg bg-[#3B82F6] hover:bg-[#3B82F6]/50 transition mt-4"
        >
          Verify OTP
        </button>

        <div className="mt-6 text-sm text-gray-600">
          Didn't receive the code?

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`ml-2 font-semibold transition-colors  ${
              canResend
                ? "text-blue-600 hover:text-blue-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {canResend ? "Resend Code" : `Resend in ${timer}s`}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
