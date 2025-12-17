import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { resetPassword, validateLink } from "../../../api/auth/authApi";
import Footer from "../landingPage/components/Footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "./resetPasswordSchema";


export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({resolver:zodResolver(resetPasswordSchema)});

  useEffect(() => {
    const checkLink = async () => {
      if (!uid || !token) {
        setStatus("invalid");
        return;
      }

      try {
        await validateLink({ uid, token });
        setStatus("valid");
      } catch {
        setStatus("invalid");
      }
    };

    checkLink();
  }, [uid, token]);

  const onSubmit = async ({ newPassword, confirmPassword }) => {
    try {
      await resetPassword({ uid, token, newPassword, confirmPassword });
      setStatus("success");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <>
      <main className="min-h-screen max-[532px]:mx-5 flex items-center justify-center bg-gray-50 pt-32 pb-20">
      

        {status === "loading" && (
          <p className="text-center">Validating reset link…</p>
        )}

        {status === "invalid" && (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Reset link expired</h2>
            <p className="text-gray-500 mt-2">
              Please request a new password reset.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Password updated</h2>
            <p className="text-gray-500 mt-2">Now you can signin with new password</p>
          </div>
        )}

        {status === "valid" && (
            <>
            
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-[20px] border border-gray-200 shadow-sm p-8 w-full max-w-[538px]"
            >
                <div className="flex justify-center">
  <h2 className="text-[30px] mb-5 font-museo font-extrabold leading-7">
    <span className="text-[#1A1A1A]">Gro</span>
    <span className="text-[#3B82F6]">lance</span>
  </h2>
</div>

            <h1 className="text-2xl font-bold text-center mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-500 text-center mb-6">
              Create a new password for your account
            </p>

            {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <div className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                {...register("newPassword", {
                    required: "Password is required",
                })}
                className="w-full h-12 px-4 border rounded-lg"
                />
              {errors.newPassword && (
                  <p className="text-red-500 text-xs">
                  {errors.newPassword.message}
                </p>
              )}

              <input
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="w-full h-12 px-4 border rounded-lg"
                />
              {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
              >
                Update Password
              </button>
            </div>
          </form>
                </>
        )}
      </main>

      <Footer />
    </>
  );
}
