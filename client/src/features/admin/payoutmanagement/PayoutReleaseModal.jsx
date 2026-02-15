import React from 'react';
import { X, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useReleasePayout } from './payoutMutations';

export default function PayoutReleaseModal({ contract, isOpen, onClose }) {
  const { mutate: release, isPending } = useReleasePayout();

  if (!isOpen) return null;

  const handleConfirm = () => {
    release(contract.id, { 
      onSuccess: () => onClose() 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold text-gray-900">Confirm Payment Release</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              <DollarSign size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">
              ${contract.total_amount?.toLocaleString()}
            </h4>
            <p className="text-sm text-gray-500">Total amount to be distributed</p>
          </div>

          <div className="space-y-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-slate-600 leading-relaxed">
                By confirming, the funds will be split between the freelancer's registered PayPal and your platform's master PayPal account as configured in settings.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-400 transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <DollarSign size={18} />
                  Release Funds
                </>
              )}
            </button>
          </div>
          
          <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
            This action cannot be undone
          </p>
        </div>
      </div>
    </div>
  );
}