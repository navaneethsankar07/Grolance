import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount } from "../auth/authThunks";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteAccountModal({ onClose }) {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    setLocalError(null);

    const result = await dispatch(deleteAccount(password));
    
    if (deleteAccount.fulfilled.match(result)) {
      onClose();
      window.location.href = "/"; 
    } else {
      setLocalError(result.payload?.password || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-6 mx-auto">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Account</h2>
          <p className="text-gray-500 text-center mb-8">
            This action is permanent. All your projects, profile data, and history will be removed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!user?.is_google_account && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Password to Confirm
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                {localError && <p className="text-red-500 text-xs mt-2 font-medium">{localError}</p>}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={isDeleting}
                className="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete My Account"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}