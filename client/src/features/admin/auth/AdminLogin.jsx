import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "./adminLoginSchema";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { loginThunk, logoutThunk } from "../../client/account/auth/authThunks";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../../client/account/auth/authslice";
import { logoutUser } from "../../../api/auth/authApi";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate()
  const user = useSelector(state=>state.auth.user)
  if(user){
    navigate('/admin',{replace:true})
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const res = await dispatch(loginThunk(data)).unwrap();

      if (!res.user?.is_admin) {
        setServerError("Access denied. You are not an administrator.");
        await logoutUser()
        dispatch(logout())
        return;
      }
      navigate('/admin', {replace:true})

    } catch (err) {
      setServerError(
        err?.message || "Invalid admin credentials"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <div className="w-full max-w-[440px]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Grolance <span className="text-primary">Admin</span>
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {serverError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                {serverError}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl"
                  placeholder="admin@grolance.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 border rounded-xl"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Login as Admin
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
