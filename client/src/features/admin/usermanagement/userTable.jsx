import { useModal } from "../../../hooks/modal/useModalStore";
import { formatDateDMY } from "../../../utils/date";
import { useSoftDeleteUser, useToggleUserActive } from "./usersMutations";
import { MoreVertical, Ban, Unlock, Trash2, ExternalLink } from "lucide-react";

export default function UserTable({ users, page, setPage, hasNext, hasPrev }) {
  const toggleMutation = useToggleUserActive();
  const deleteMutation = useSoftDeleteUser();
  const { openModal } = useModal();

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "freelancer": return "bg-purple-50 text-purple-700 border-purple-100";
      case "client": return "bg-blue-50 text-blue-700 border-blue-100";
      case "both": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const handleViewProfile = (u) => {
    openModal("view-user", { user: u });
  };

  const handleDelete = (u) => {
    openModal("delete-user", {
      userName: u.full_name,
      userEmail: u.email,
      onConfirm: () => deleteMutation.mutate(u.id)
    });
  };

  const handleSuspendClick = (u) => {
    openModal("suspend-user", {
      userName: u.full_name,
      userEmail: u.email,
      isActive: u.is_active,
      onConfirm: () => toggleMutation.mutate(u.id)
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-gray-900">User</th>
            <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-900">Role</th>
            <th className="px-4 py-4 font-semibold text-gray-900">Joined Date</th>
            <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer group/item"
                  onClick={() => handleViewProfile(u)}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-transparent group-hover/item:ring-blue-100 transition-all">
                    {u.profile_photo ? (
                      <img className="w-full h-full object-cover" src={u.profile_photo} alt="" referrerPolicy="no-referrer" />
                    ) : (
                      u.full_name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-none mb-1 group-hover/item:text-blue-600 transition-colors flex items-center gap-1">
                      {u.full_name}
                      <ExternalLink size={12} className="opacity-0 group-hover/item:opacity-100" />
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-3 py-4">
                {u.is_deleted ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                    Deleted
                  </span>
                ) : u.is_active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                    Blocked
                  </span>
                )}
              </td>

              <td className="px-3 py-4">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getRoleStyle(u.is_freelancer ? 'both' : 'client')}`}>
                  {u.is_freelancer ? "Both" : u.current_role || "Client"}
                </span>
              </td>

              <td className="px-4 py-4 text-gray-600">
                {formatDateDMY(u.created_at)}
              </td>

              <td className="px-6 py-4">
                {!u.is_deleted ? (
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSuspendClick(u)}
                      className={`p-2 rounded-lg border transition-all ${
                        u.is_active 
                        ? "text-amber-600 hover:bg-amber-50 border-gray-200" 
                        : "text-green-600 hover:bg-green-50 border-gray-200"
                      }`}
                    >
                      {u.is_active ? <Ban size={16} /> : <Unlock size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="p-2 text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                   <div className="text-right">
                     <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-1 rounded">Archived</span>
                   </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="text-gray-900">{users.length}</span> results
        </p>
        <div className="flex gap-2">
          <button
            disabled={!hasPrev}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
          >
            Previous
          </button>
          <div className="flex items-center px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-blue-600 shadow-sm">
            {page}
          </div>
          <button
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}