import ModalWrapper from './components/ModelWrapper'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useModal } from '../../../hooks/modal/useModalStore';
import { forgotPassword } from '../../../api/auth/authApi';

function ForgotPasswordModal() {
  const { openModal, closeModal } = useModal();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const onSubmit = async({email})=>{
    try{
      setBackendError("");
      setLoading(true);

      await forgotPassword({ email });
      setSuccessMessage(
  "If an account exists, a reset link has been sent to your email."
);
      
    }catch(err){
        setBackendError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
    }
    const toSignin = ()=>{
      closeModal()
      openModal('signin')
    }
  
  return (
    
    <ModalWrapper>
      {successMessage ? (
  <div className="text-center p-10 space-y-4">
    <h2 className="text-3xl font-extrabold text-[#3B82F6]">
      Check your email
    </h2>
    <p className="text-gray-600">{successMessage}</p>

    <button
      onClick={toSignin}
      className="text-blue-500 mt-5 underline"
    >
      Back to Login
    </button>
  </div>
) : (
  
  
  <div className="w-[538px] max-w-[90vw] rounded-[20px] p-0 border-0 bg-white">
        <div className="flex justify-center items-center px-[45px] py-[58px]">
          <div className="w-full max-w-md flex flex-col gap-8">
            
            <div className="flex flex-col items-center">
              <h1 className="text-[#1F2937] text-center  font-black text-[36px] leading-[45px] tracking-[-1.8px]">
                Forgot Your Password?
              </h1>
              <p className="text-[#6B7280] text-center text-[16px] font-normal leading-6">
                Enter your registered email to receive a reset link.
              </p>
            </div>
            {backendError && (
              <p className="text-red-500 text-center text-sm">
                {backendError}
              </p>
            )}

            <div className="rounded-xl border border-[#E5E7EB] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[#1F2937] text-[16px] font-medium leading-6"
                    >
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., yourname@example.com"
                    className="h-14 rounded-lg border px-4 focus:ring-2 focus:ring-blue-500"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Enter a valid email address",
                      },
                    })}
                    />

                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                 <button
                  type="submit"
                  disabled={loading}
                  className="h-12 bg-[#3B82F6] hover:bg-[#1d4ed8] rounded-2xl text-white font-bold disabled:opacity-60"
                  >
                  {loading ? "Sending link..." : "Send Link"}
                </button>
              </form>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={toSignin}
                type="button"
                className="text-[#6B7280] text-[14px] underline hover:text-[#1F2937] transition-colors"
                >
                Back to Login
              </button>
            </div>

          </div>
        </div>
      </div>
  
)}
                  </ModalWrapper>
  )
}

export default ForgotPasswordModal