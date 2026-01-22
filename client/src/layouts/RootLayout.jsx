import { Outlet } from "react-router-dom";
import { useModal } from "../hooks/modal/useModalStore";
import SignupModal from "../features/client/account/SignupModal";
import OtpModal from "../features/client/account/OtpModal";
import SignInModal from "../features/client/account/SignInModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, } from "react";
import { fetchUser, refreshSession } from "../features/client/account/auth/authThunks";
import { Loader2 } from 'lucide-react'
import ForgotPasswordModal from "../features/client/account/ForgotPasswordModal";
import ConfirmProjectModal from "../features/client/projectManagement/components/ConfirmProjectModal";
import DeleteUserModal from "../features/admin/usermanagement/components/DeleteUserModal";
import SuspendUserModal from "../features/admin/usermanagement/components/SuspendUserModal";
import { EditCategoryModal } from "../features/admin/categorymanagement/components/EditCategoryModal";
import { AddCategoryModal } from "../features/admin/categorymanagement/components/AddCategoryModal";
import { DeleteCategoryModal } from "../features/admin/categorymanagement/components/DeleteCategoryModal";
import AddSkillModal from "../features/admin/categorymanagement/components/AddSkillsModal";
import EditSkillModal from "../features/admin/categorymanagement/components/EditSkillsModal";
import DeleteSkillModal from "../features/admin/categorymanagement/components/DeleteSkillModal";
import ProfileModal from "../features/client/homepage/components/ProfileModal";
import DeleteAccountModal from "../features/client/account/components/DeleteModal";
import ProjectDeleteModal from "../features/client/projectManagement/components/ProjectDeleteModal";
import PhoneOtpModal from "../features/client/onboarding/step1/PhoneOtpModal";
import InviteFreelancerModal from "../features/client/findtalent/components/InvitationModal";
import { ProposalModal } from "../features/freelancer/proposals/components/ProposalModal";
import ViewUserModal from "../features/admin/usermanagement/components/ViewUserModal";
export default function RootLayout() {
  const { modal, modalProps, closeModal } = useModal();
const { loading, initialized, accessToken } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
useEffect(() => {
  if(!accessToken){
   dispatch(fetchUser());
  }
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
      {modal === "view-user" && (<ViewUserModal isOpen  onClose={closeModal} user={modalProps.user} />)}
      {modal === "signup" && <SignupModal isOpen onClose={closeModal} />}
      {modal === "otp" && <OtpModal isOpen email={modalProps.email} />}
      {modal === "signin" && <SignInModal isOpen onClose={closeModal} />}
      {modal === "forgot-password" && <ForgotPasswordModal isOpen  />}
      {modal === "confirm-project" && <ConfirmProjectModal isPending={false} onConfirm={modalProps.onConfirm}/>}
      {modal === 'edit-category' && <EditCategoryModal open onOpenChange={closeModal} category={modalProps} />  }
      {modal === 'edit-skill' && <EditSkillModal open onOpenChange={closeModal} skill={modalProps.item} categories={modalProps.categories} />  }
      {modal === 'add-category' && <AddCategoryModal open onOpenChange={closeModal} />}
      {modal === 'add-skill' && <AddSkillModal categories={modalProps.categories} onClose={closeModal} />}
      {modal === 'delete-category' && <DeleteCategoryModal open onOpenChange={closeModal} category={modalProps}/> }
      {modal === 'delete-skill' && <DeleteSkillModal open onOpenChange={closeModal} skill={modalProps}/> }
      {modal === "delete-user" && ( <DeleteUserModal isOpen onClose={closeModal} modalProps={modalProps} />)}
      {modal === "suspend-user" && (<SuspendUserModal isOpen onClose={closeModal} modalProps={modalProps} />)}
      {modal === "profile-menu" && <ProfileModal isOpen onClose={closeModal}/>}
      {modal === "delete-account" && <DeleteAccountModal onClose={closeModal}/>}
      {modal === 'delete-project' && <ProjectDeleteModal projectId={modalProps.projectId} onClose={closeModal} />}
      {modal === 'phone-otp' && <PhoneOtpModal phone={modalProps.phone} />}
      {modal === 'job-invitation' && <InviteFreelancerModal isOpen onClose={closeModal} modalProps={modalProps} />}
      {modal === 'job-proposal' && <ProposalModal onClose={closeModal} projectId={modalProps}/>}
    </>
  );
}

