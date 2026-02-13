import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, requestDeleteOTP } from "../auth/authThunks";
import { AlertTriangle, Loader2, ShieldAlert, X, Mail } from "lucide-react";
import { toast } from "react-toastify";

export default function DeleteAccountModal({ onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleSendOTP = async () => {
    setIsSendingOTP(true);
    const result = await dispatch(requestDeleteOTP());
    setIsSendingOTP(false);
    
    if (requestDeleteOTP.fulfilled.match(result)) {
      setOtpSent(true);
      toast.info("Verification code sent to your email");
    } else {
      toast.error(result.payload?.error || "Failed to send code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    setLocalError(null);

    const payload = user?.is_google_account 
      ? { otp: inputValue } 
      : { password: inputValue };

    const result = await dispatch(deleteAccount(payload));
    
    if (deleteAccount.fulfilled.match(result)) {
      onClose();
      window.location.href = "/";
      toast.success("Account Deleted Successfully");
    } else {
      const errorMsg = result.payload?.password || result.payload?.otp || "Action failed";
      setLocalError(errorMsg);
      setIsDeleting(false);
      toast.error("Deletion Failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative p-8 md:p-10">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center w-20 h-20 bg-red-50 rounded-3xl mb-8 mx-auto rotate-3">
            <ShieldAlert className="w-10 h-10 text-red-600 -rotate-3" />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Delete Account?</h2>
            <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
              This action is <span className="text-red-600 font-bold underline decoration-2 underline-offset-4">permanent</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!user?.is_google_account ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 px-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl border ${localError ? 'border-red-500 bg-red-50/30' : 'border-gray-200 bg-gray-50'} focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium`}
                  placeholder="••••••••••••"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isSendingOTP}
                    className="w-full py-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all"
                  >
                    {isSendingOTP ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                    Send Verification Code
                  </button>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 px-1">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl font-black tracking-[0.5em] focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
                      placeholder="000000"
                    />
                    <button 
                      type="button" 
                      onClick={handleSendOTP} 
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Resend Code?
                    </button>
                  </div>
                )}
              </div>
            )}

            {localError && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-1.5 px-1">
                <AlertTriangle className="w-3 h-3" />
                {localError}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isDeleting || (user?.is_google_account && !otpSent)}
                className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-700 active:scale-[0.97] transition-all disabled:opacity-50 shadow-xl shadow-red-200 flex items-center justify-center gap-3"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Finalize Deletion"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 text-gray-500 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-50 transition-all"
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