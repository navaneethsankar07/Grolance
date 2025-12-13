import { Outlet } from "react-router-dom";
import { useModal } from "../hooks/modal/useModalStore";
import SignupModal from "../features/client/account/SignupModal";
import OtpModal from "../features/client/account/OtpModal";
import SignInModal from "../features/client/account/SignInModal";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUser } from "../features/client/account/auth/authThunks";

export default function RootLayout() {
  const { modal, modalProps, closeModal } = useModal();

  return (
    <>
      <Outlet />   

      {modal === "signup" && <SignupModal isOpen onClose={closeModal} />}
      {modal === "otp" && <OtpModal isOpen email={modalProps.email} />}
      {modal === "signin" && <SignInModal isOpen onClose={closeModal} />}
    </>
  );
}

