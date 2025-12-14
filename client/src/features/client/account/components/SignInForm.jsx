import { useForm } from "react-hook-form";
import InputBox from "../../account/components/InputBox";
import { useDispatch } from "react-redux";
import { loginThunk } from "../auth/authThunks";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignInForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const onSubmit = async ({ email, password }) => {
    try {
      setLoginError(null);
      await dispatch(loginThunk({ email, password })).unwrap();
      navigate("/");
      closeModal();
    } catch (err) {
      setLoginError(err?.error || "Invalid email or password");
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loginError && (
        <p className="text-red-500 text-center text-sm">{loginError}</p>
      )}
      <InputBox
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        register={register}
        validation={{ required: "Email is required" }}
        error={errors.email}
      />

      <InputBox
        label="Password"
        name="password"
        placeholder="Enter your password"
        register={register}
        validation={{ required: "Password is required" }}
        error={errors.password}
        passwordToggle
      />

    

      <button
        type="submit"
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full
        font-poppins text-xl font-medium transition-colors"
      >
        Sign in
      </button>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-300 opacity-80"></div>
        <span className="font-poppins text-lg font-medium text-gray-500">
          Or
        </span>
        <div className="flex-1 h-px bg-gray-300 opacity-80"></div>
      </div>

      <button
        type="button"
        className="w-full h-[52px] flex items-center justify-center gap-1 px-4 rounded-[10px] border border-[#CBCAD7] bg-white hover:bg-gray-50 transition-colors mb-6"
      >
        <img
          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
          className="w-9 h-9"
          alt="Google"
        />
        <span className="font-poppins font-medium text-base text-[#19181F]">
          Create account with Google
        </span>
      </button>

    </form>
  );
}
