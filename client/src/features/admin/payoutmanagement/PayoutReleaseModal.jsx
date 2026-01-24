import React, { useState } from 'react';
import { X, DollarSign, Loader2 } from 'lucide-react';
import { useReleasePayout } from './payoutMutations';

export default function PayoutReleaseModal({ contract, isOpen, onClose }) {
  const [platformEmail, setPlatformEmail] = useState('');
  const { mutate: release, isLoading } = useReleasePayout();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    release(
    { 
      contractId: contract.id, 
      platformEmail: platformEmail 
    }, 
    { onSuccess: () => onClose() }
  );
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold text-gray-900">Release Payout</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total Contract:</span>
              <span className="font-bold">${contract.total_amount}</span>
            </div>
            <p className="text-xs text-blue-600 italic">
              Note: This will split the payment between the freelancer and your platform email.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Platform PayPal Email
              </label>
              <input
                required
                type="email"
                placeholder="admin@grolance.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={platformEmail}
                onChange={(e) => setPlatformEmail(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Your platform fee will be sent to this PayPal account.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !platformEmail}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <DollarSign size={18} />}
              Confirm Release
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}