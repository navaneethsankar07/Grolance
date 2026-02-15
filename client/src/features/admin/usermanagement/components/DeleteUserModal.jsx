import { X } from "lucide-react";

export default function DeleteUserModal({ isOpen, onClose, modalProps }) {
  if (!isOpen) return null;

  // Destructure the data passed through openModal()
  const { userName, userEmail, onConfirm } = modalProps;

  const handleDelete = () => {
    onConfirm(); 
    onClose();   
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[448px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#EF4444] flex-shrink-0 animate-pulse"></div>
              <h2 className="text-[17px] font-semibold text-[#111827] leading-7">
                Delete User Account
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 -mt-1 -mr-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
            </button>
          </div>

          <p className="text-[14px] text-[#4B5563] leading-[26px] mb-6">
            Are you sure you want to permanently delete this user? This action
            cannot be undone and all associated data will be removed.
          </p>

          <div className="bg-[#F9FAFB] rounded-xl p-4 flex items-center gap-3 mb-6 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
               {userName?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[14px] font-medium text-[#111827] leading-6 truncate">
                {userName}
              </p>
              <p className="text-[12px] text-[#6B7280] leading-5 truncate">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4 flex gap-3 mb-8">
            <svg
              className="w-5 h-5 flex-shrink-0 text-[#DC2626] mt-0.5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18.3327C14.6024 18.3327 18.3334 14.6017 18.3334 9.99935C18.3334 5.39698 14.6024 1.66602 10 1.66602C5.39765 1.66602 1.66669 5.39698 1.66669 9.99935C1.66669 14.6017 5.39765 18.3327 10 18.3327Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 6.66602V9.99935"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 13.334H10.0083"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#991B1B] leading-[22px] font-medium">
                All jobs, proposals, orders, and disputes linked to this user
                will also be removed. This action is irreversible.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-[21px] py-[13px] border border-[#D1D5DB] rounded-lg text-[14px] font-medium text-[#374151] leading-6 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-3 bg-[#DC2626] rounded-lg text-[14px] font-medium text-white leading-6 hover:bg-[#B91C1C] transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              Delete User Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}