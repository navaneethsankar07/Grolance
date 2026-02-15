import { X, AlertTriangle } from "lucide-react";

export default function SuspendUserModal({ isOpen, onClose, modalProps }) {
  if (!isOpen) return null;

  const { userName, userEmail, onConfirm, isActive } = modalProps;

  const handleAction = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[448px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-6 border-b border-[#F3F4F6]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[17px] font-semibold text-[#111827] leading-7 mb-1">
                {isActive ? "Suspend User" : "Activate User"}
              </h2>
              <p className="text-[12px] text-[#4B5563] leading-5">
                {isActive 
                  ? "Are you sure you want to suspend this user? They will not be able to log in until reactivated."
                  : "Are you sure you want to reactivate this user? They will regain full access immediately."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 -mt-1 -mr-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-[17px] flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-inner">
              <span className="text-[14px] font-bold text-white uppercase">
                {userName?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[14px] font-medium text-[#111827] leading-6 truncate">
                {userName}
              </p>
              <p className="text-[12px] text-[#4B5563] leading-5 truncate">
                {userEmail}
              </p>
            </div>
          </div>

          <div className={`rounded-xl p-[17px] flex gap-3 border ${isActive ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-red-600' : 'text-green-600'}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-[12px] leading-5 font-medium ${isActive ? 'text-red-800' : 'text-green-800'}`}>
                {isActive 
                  ? "This action can be reversed anytime using the 'Activate User' option." 
                  : "The user will be notified that their account access has been restored."}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-[17px] border-t border-[#F3F4F6] bg-[#F9FAFB] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-[9px] text-[12px] font-medium text-[#374151] hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className={`px-5 py-[9px] rounded-lg text-[12px] font-medium text-white transition-all shadow-sm active:scale-95 ${
              isActive ? 'bg-[#DC2626] hover:bg-[#B91C1C]' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isActive ? "Suspend User" : "Activate User"}
          </button>
        </div>
      </div>
    </div>
  );
}