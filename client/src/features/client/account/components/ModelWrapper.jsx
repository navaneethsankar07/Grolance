import React from "react";

export default function ModalWrapper({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] shadow-xl relative"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>
    </div>
  );
}
