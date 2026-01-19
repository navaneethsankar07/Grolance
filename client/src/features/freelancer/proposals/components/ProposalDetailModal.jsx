import React from "react";
import { X, Calendar, Clock, Banknote } from "lucide-react";

export default function ProposalDetailModal({ isOpen, onClose, proposal }) {
  if (!isOpen || !proposal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">Proposal Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Project</h4>
            <p className="text-lg font-semibold text-gray-900">{proposal.project_title}</p>
            <p className="text-sm text-gray-500">Client: {proposal.client_name}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Banknote className="w-4 h-4" />
                <span className="text-xs font-medium">Bid Amount</span>
              </div>
              <p className="font-bold text-gray-900">₹{Number(proposal.bid_amount).toLocaleString()}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Delivery</span>
              </div>
              <p className="font-bold text-gray-900">{proposal.delivery_days} Days</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Submitted</span>
              </div>
              <p className="font-bold text-gray-900">{new Date(proposal.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Cover Letter</h4>
            <div className="bg-white border border-gray-100 rounded-lg p-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {proposal.cover_letter}
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}