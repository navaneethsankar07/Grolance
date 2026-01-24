import React, { useState } from "react";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useModal } from "../../../../hooks/modal/useModalStore";

export default function ApproveContractModal() {
  const { closeModal, modalProps } = useModal();
  const [isAgreed, setIsAgreed] = useState(false);
  
  const { onApprove, projectName, freelancerName, amount } = modalProps;

  const handleFinalApproval = () => {
    if (isAgreed) {
      onApprove();
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Approve Deliverables</h3>
          <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="w-10 h-10 flex-shrink-0 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Important Notice</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Approving this project signals that all work is completed to your satisfaction.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion Instructions</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-slate-600 leading-5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>The payment of <strong>${amount}</strong> will be moved from Escrow to the "Ready for Payout" stage.</span>
              </li>
              <li className="flex gap-3 text-xs text-slate-600 leading-5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>You have **24 hours** from this moment to report any technical issues or missing source files.</span>
              </li>
              <li className="flex gap-3 text-xs text-slate-600 leading-5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Once the 24-hour window expires, the platform admin will release the funds to {freelancerName}'s PayPal account.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="flex gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700 leading-5 group-hover:text-slate-900 transition-colors">
                I have reviewed all deliverables for <strong>{projectName}</strong> and I accept the terms of completion.
              </span>
            </label>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={closeModal}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Go Back
          </button>
          <button 
            onClick={handleFinalApproval}
            disabled={!isAgreed}
            className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-blue-200 transition-all ${
              isAgreed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
}