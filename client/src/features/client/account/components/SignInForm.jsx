import { useForm } from "react-hook-form";
import InputBox from "../../account/components/InputBox";
import { useDispatch } from "react-redux";
import { loginThunk } from "../auth/authThunks";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { initGoogleButton } from "../helper/googleSignupHelper";
import { googleAuth } from "../../../../api/auth/authApi";
import { setCredentials } from "../auth/authslice";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../validation/authSchemas";

export default function SignInForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signinSchema)
  });
  const { closeModal, openModal } = useModal();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const onSubmit = async ({ email, password }) => {
    try {
      setLoginError(null);
      const result = await dispatch(loginThunk({ email, password })).unwrap();
      closeModal();
      toast.success('Login Successful');
      navigate(result.user.current_role === 'freelancer' ? "/freelancer" : "/");
    } catch (err) {
      setLoginError(err?.error || "Invalid email or password");
      toast.error('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    initGoogleButton("google-signup-btn", async (response) => {
      try {
        const data = await googleAuth(response.credential);
        dispatch(setCredentials({ user: data.user, accessToken: data.access }));
        closeModal();
        navigate(data.user.current_role === 'freelancer' ? "/freelancer" : "/");
        toast.success('Login Successful');
      } catch (err) {
        toast.error(err?.response?.data?.error || "Login Failed try again");
      }
    });
  }, [dispatch, navigate, closeModal]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {loginError && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
          <p className="text-red-500 text-center text-xs sm:text-sm font-medium">{loginError}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <InputBox
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
        />

        <InputBox
          label="Password"
          name="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password}
          passwordToggle
        />
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => {
            closeModal();
            openModal("forgot-password");
          }}
          className="text-xs sm:text-sm text-primary hover:underline font-medium"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-primary hover:bg-blue-600 active:scale-[0.98] text-white rounded-full
        font-poppins text-lg sm:text-xl font-medium transition-all shadow-lg shadow-blue-100"
      >
        Sign in
      </button>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="font-poppins text-sm sm:text-lg font-medium text-gray-400 uppercase tracking-wider">
          Or
        </span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <div className="w-full flex justify-center py-2">
        <div id="google-signup-btn" className="w-full flex justify-center" />
      </div>
    </form>
  );
}