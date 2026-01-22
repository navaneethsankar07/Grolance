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
  const { register, handleSubmit, formState: { errors } } = useForm({resolver:zodResolver(signinSchema)});
  const { closeModal,openModal } = useModal();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const onSubmit = async ({ email, password }) => {
    try {
      setLoginError(null);
      const result = await dispatch(loginThunk({ email, password })).unwrap();
      closeModal();
    toast.success('Login Successful');
    
    if (result.user.current_role === 'freelancer') {
      navigate("/freelancer");
    } else {
      navigate("/");
    }
  } catch (err) {
    setLoginError(err?.error || "Invalid email or password");
    toast.error('Login failed. Please try again.');
  }
};

useEffect(() => {
    initGoogleButton("google-signup-btn", async (response) => {
      try {
        const data = await googleAuth(response.credential);

        dispatch(
          setCredentials({
            user: data.user,
            accessToken: data.access,
          })
        );

        closeModal();
        navigate("/");
        toast.success('Login Successful')
      } catch (err) {
        console.log();
        (
          err?.response?.data?.error || "Google authentication failed"
        );
        toast.error("Login Failed try again")
      }
    });
  }, []);



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

      <div className="text-right">
  <button
    type="button"
    onClick={() => {
      closeModal();
      openModal("forgot-password");
    }}
    className="text-sm text-primary hover:underline"
  >
    Forgot password?
  </button>
</div>


      <button
        type="submit"
        className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-full
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

    <div className="w-full flex justify-center mb-5 mt-5">
  <div id="google-signup-btn" />
</div>



    </form>
  );
}
