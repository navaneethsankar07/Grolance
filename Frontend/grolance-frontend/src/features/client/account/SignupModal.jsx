import { createPortal } from "react-dom";
import ModalWrapper from "./components/ModelWrapper";
import SignupLayout from "./components/SignupLayout";

export default function SignupModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <ModalWrapper onClose={onClose}>
      <SignupLayout onClose={onClose} />
    </ModalWrapper>,
    document.getElementById("modal-root")
  );
}









