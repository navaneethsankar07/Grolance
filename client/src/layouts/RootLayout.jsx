import { Outlet } from "react-router-dom";
import { useModal } from "../hooks/modal/useModalStore";
import SignupModal from "../features/client/account/SignupModal";
import OtpModal from "../features/client/account/OtpModal";
import SignInModal from "../features/client/account/SignInModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, } from "react";
import { fetchUser } from "../features/client/account/auth/authThunks";
import { Loader2 } from 'lucide-react'
import ForgotPasswordModal from "../features/client/account/ForgotPasswordModal";
import ProjectDeleteModal from "../features/client/projectManagement/components/ProjectDeleteModal";
export default function RootLayout() {
  const { modal, modalProps, closeModal } = useModal();
  const { loading } = useSelector((s) => s.auth)
  const dispatch = useDispatch();
useEffect(() => {
   dispatch(fetchUser());
  }, []);

  if (loading) { 
    return (
      <div className="h-screen flex items-center justify-center">
         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <Outlet />   

      {modal === "signup" && <SignupModal isOpen onClose={closeModal} />}
      {modal === "otp" && <OtpModal isOpen email={modalProps.email} />}
      {modal === "signin" && <SignInModal isOpen onClose={closeModal} />}
      {modal === "forgot-password" && <ForgotPasswordModal isOpen  />}
      {modal === 'delete-project' && <ProjectDeleteModal projectId={modalProps.projectId} onClose={closeModal} />}
    </>
  );
}

