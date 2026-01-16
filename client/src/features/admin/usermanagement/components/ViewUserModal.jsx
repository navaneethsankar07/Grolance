import { X, Mail, Calendar, Shield, CheckCircle, AlertCircle, Ban, Unlock, Trash2 } from "lucide-react";
import { formatDateDMY } from "../../../../utils/date";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { useSoftDeleteUser, useToggleUserActive } from "../usersMutations";

export default function ViewUserModal({ isOpen, onClose, user }) {
  const { openModal } = useModal();
  const toggleMutation = useToggleUserActive();
  const deleteMutation = useSoftDeleteUser();

  if (!isOpen || !user) return null;

  const handleSuspendClick = () => {
    openModal("suspend-user", {
      userName: user.full_name,
      userEmail: user.email,
      isActive: user.is_active,
      onConfirm: () => {
        toggleMutation.mutate(user.id);
        onClose(); 
      }
    });
  };

  const handleDeleteClick = () => {
    openModal("delete-user", {
      userName: user.full_name,
      userEmail: user.email,
      onConfirm: () => {
        deleteMutation.mutate(user.id);
        onClose(); 
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
        <div className="relative h-24 bg-primary">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-sm">
              {user.profile_photo ? (
                <img src={user.profile_photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
                  {user.full_name?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{user.full_name}</h3>
            <p className="text-blue-600 text-sm font-semibold flex items-center gap-1 uppercase tracking-wider">
              <Shield size={14} />
              {user.is_freelancer ? "Both (Client & Freelancer)" : user.current_role || "Client"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="text-gray-400" size={18} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Email</p>
                <p className="text-sm font-medium text-gray-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="text-gray-400" size={18} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Member Since</p>
                <p className="text-sm font-medium text-gray-700">{formatDateDMY(user.created_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-gray-100 rounded-xl flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</p>
                {user.is_deleted ? (
                  <span className="text-xs font-bold text-red-600">DELETED</span>
                ) : user.is_active ? (
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle size={12} /> ACTIVE
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <AlertCircle size={12} /> BLOCKED
                  </span>
                )}
              </div>

              <div className="p-1 border border-gray-100 rounded-xl flex gap-1">
                {!user.is_deleted ? (
                  <>
                    <button
                      onClick={handleSuspendClick}
                      className={`flex-1 flex flex-col items-center justify-center rounded-lg transition-all ${
                        user.is_active 
                        ? "text-amber-600 bg-amber-50 hover:bg-amber-100" 
                        : "text-green-600 bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      {user.is_active ? <Ban size={16} /> : <Unlock size={16} />}
                      <span className="text-[9px] font-bold mt-1 uppercase">
                        {user.is_active ? "Block" : "Unblock"}
                      </span>
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex-1 flex flex-col items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                      <span className="text-[9px] font-bold mt-1 uppercase">Delete</span>
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-[10px] font-bold uppercase italic">
                    No Actions
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}