import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useUpdatePaymentSettings } from "./profileMutation";
import { toast } from "react-toastify";

export default function EditPaymentModal({ isOpen, onClose, currentEmail }) {
  const [email, setEmail] = useState(currentEmail || "");
  const { mutate, isLoading } = useUpdatePaymentSettings();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ paypal_email: email }, {
      onSuccess: onClose()
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">Update PayPal Email</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PayPal Email Address</label>
              <input 
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="yourname@example.com"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 font-medium">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}