import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null); 
  const [modalProps, setModalProps] = useState({});
  const [signupData, setSignupData] = useState(null);

  const openModal = (name, props = {}) => {
    setModal(name);
    setModalProps(props);
  };

  const closeModal = () => {
    setModal(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ modal, modalProps, openModal, closeModal, signupData, setSignupData}}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
