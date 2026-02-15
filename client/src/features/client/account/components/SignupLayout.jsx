import { useEffect, useRef, useState } from "react";
import AuthLayout from "./AuthLayout";
import SignupForm from "./SignupForm";
import { initGoogleButton } from "../helper/googleSignupHelper";
import { googleAuth } from "../../../../api/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../auth/authslice";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/modal/useModalStore";

export default function SignupLayout({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [error, setError] = useState("");

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
      } catch (err) {
        setError(
          err?.response?.data?.error || "Google authentication failed"
        );
      }
    });
  }, []);

  return (
   <AuthLayout title="Create an account" onClose={onClose}>
      
      <div className="w-full flex justify-center mb-5 mt-5">
  <div id="google-signup-btn" />
</div>


      <SignupForm />
    </AuthLayout>
  );
}
