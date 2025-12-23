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
import ConfirmProjectModal from "../features/client/projectManagement/ConfirmProjectModal";
import DeleteUserModal from "../features/admin/usermanagement/components/DeleteUserModal";
import SuspendUserModal from "../features/admin/usermanagement/components/SuspendUserModal";
import { EditCategoryModal } from "../features/admin/categorymanagement/components/EditCategoryModal";
import { AddCategoryModal } from "../features/admin/categorymanagement/components/AddCategoryModal";
import { DeleteCategoryModal } from "../features/admin/categorymanagement/components/DeleteCategoryModal";
export default function RootLayout() {
  const { modal, modalProps, closeModal } = useModal();
  const { loading, initialized } = useSelector((s) => s.auth)
  const dispatch = useDispatch();
useEffect(() => {
   dispatch(fetchUser());
  }, []);

  if (!initialized) { 
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
      {modal === "confirm-project" && <ConfirmProjectModal isPending={false} onConfirm={modalProps.onConfirm}/>}
      {modal === 'edit-category' && <EditCategoryModal open onOpenChange={closeModal} category={modalProps} />  }
      {modal === 'add-category' && <AddCategoryModal open onOpenChange={closeModal} />}
      {modal === 'delete-category' && <DeleteCategoryModal open onOpenChange={closeModal} category={modalProps}/> }
      {modal === "delete-user" && ( <DeleteUserModal isOpen onClose={closeModal} modalProps={modalProps} />)}
      {modal === "suspend-user" && (<SuspendUserModal isOpen onClose={closeModal} modalProps={modalProps} />)}
    </>
  );
}

