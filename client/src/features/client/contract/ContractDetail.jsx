import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useContractDetail } from "../../freelancer/contracts/contractsQueries";
import { useRequestRevision, useUpdateContractStatus } from "./contractMutations";
import { 
  FileText, Clock, Download, MessageSquare, ShieldAlert, 
  ExternalLink, X, AlertCircle, History, CheckCircle2
} from "lucide-react";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/modal/useModalStore";

export default function ClientContractDetail() {
  const { id } = useParams();
  const { data: contract, isLoading, isError } = useContractDetail(id);
  const requestRevisionMutation = useRequestRevision();
  const updateStatusMutation = useUpdateContractStatus();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, percentage: 0 });
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");
  const {openModal} = useModal()
  useEffect(() => {
    if (contract?.freelancer_signed_at && contract?.delivery_days) {
      const calculateTime = () => {
        const start = new Date(contract.freelancer_signed_at).getTime();
        const durationMs = contract.delivery_days * 24 * 60 * 60 * 1000;
        const end = start + durationMs;
        const now = new Date().getTime();
        const difference = end - now;
        const totalDuration = end - start;
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const elapsed = now - start;
          const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
          setTimeLeft({ days, hours, percentage });
        } else {
          setTimeLeft({ days: 0, hours: 0, percentage: 100 });
        }
      };
      calculateTime();
      const timer = setInterval(calculateTime, 60000);
      return () => clearInterval(timer);
    }
  }, [contract]);

  const handleRevisionSubmit = () => {
    if (revisionReason.length < 10) {
      toast.error("Please provide a more detailed reason (at least 10 characters).");
      return;
    }
    requestRevisionMutation.mutate(
      { contractId: id, reason: revisionReason },
      {
        onSuccess: () => {
          setIsRevisionModalOpen(false);
          setRevisionReason("");
          toast.success('Request submitted.')
        }
      }
    );
  };

const handleApproveOrder = () => {
  openModal("approve-contract", {
    projectName: contract.project_title,
    freelancerName: contract.freelancer_name,
    amount: contract.total_amount,
    onApprove: () => {
      updateStatusMutation.mutate({ 
        contractId: contract.id, 
        status: 'completed' 
      });
    }
  });
};

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading contract details.</div>;

  const dueDate = new Date(new Date(contract.freelancer_signed_at).getTime() + (contract.delivery_days * 24 * 60 * 60 * 1000));
  const pendingRevision = contract.revisions?.find(r => r.status === 'pending');
  const acceptedRevision = contract.revisions?.find(r => r.status === 'accepted');

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-[1085px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Contract Details</h1>
            <p className="text-sm text-gray-500">View and manage your ongoing project with the freelancer.</p>
          </div>
          <Link to={`/my-projects/${contract.project_id}`} className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
            View Original Job <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
              <p className="text-sm font-bold text-gray-900">#ORD-{contract.id + 8000}</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Freelancer</p>
              <p className="text-sm font-bold text-gray-900">{contract.freelancer_name}</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Package</p>
              <p className="text-sm font-bold text-blue-600">{contract.package_name || "Pro Package"}</p>
            </div>
            <div className="p-6 flex items-center justify-between bg-gray-50/50">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                <p className="text-sm font-bold text-green-600 capitalize">{contract.status}</p>
              </div>
            </div>
          </div>
        </div>

        {contract.revisions?.some(r => r.status === 'rejected') && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-900">Revision Rejected by Freelancer</p>
              <p className="text-xs text-red-700 mt-1">
                {contract.revisions.find(r => r.status === 'rejected')?.rejection_message}
              </p>
            </div>
          </div>
        )}

        {acceptedRevision && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-900">Revision Accepted</p>
              <p className="text-xs text-green-700 mt-1">The freelancer has accepted your request and is working on the changes.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Project Description</h2>
          <div className="mb-8">
            <h3 className="text-md font-bold text-gray-800 mb-3">{contract.project_title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {contract.project_description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Created Date</p>
              <p className="text-sm font-semibold text-gray-700">{new Date(contract.freelancer_signed_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Delivery Deadline</p>
              <p className="text-sm font-semibold text-gray-700">{dueDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Time Remaining</p>
              <p className={`text-sm font-bold ${timeLeft.days < 2 ? 'text-red-500' : 'text-blue-600'}`}>
                {contract.status === 'completed' ? 'Delivered' : `${timeLeft.days}d ${timeLeft.hours}h left`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Delivery Status</h2>
            {contract.status === 'active' && (
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">WORK IN PROGRESS</span>
            )}
          </div>
          <div className="p-8">
            {contract.deliverables && contract.deliverables.length > 0 ? (
              <div className="space-y-6">
                {contract.deliverables.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.title || `Submission #${index + 1}`}</p>
                        <p className="text-xs text-gray-500 uppercase">{item.deliverable_type} • Submitted on {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <a 
                      href={item.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                ))}
                
                {contract.status === 'submitted' && (
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button 
                      onClick={handleApproveOrder}
                      disabled={updateStatusMutation.isPending}
                      className="px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Mark Completed
                    </button>
                    
                    {pendingRevision ? (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-bold">
                        <Clock className="w-4 h-4" />
                        Revision Request Pending
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsRevisionModalOpen(true)}
                        className="px-6 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50"
                      >
                        Request Revision
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-500">The freelancer hasn't submitted the work yet.</p>
                <p className="text-xs text-gray-400 mt-1">Files will appear here once the freelancer uploads the deliverables.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">Payment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal ({contract.package_name || 'Package'})</span>
              <span className="text-gray-900 font-bold">${Number(contract.total_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Platform Service Fee</span>
              <span className="text-gray-900 font-bold">$0</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-md font-bold text-gray-900">Total Paid</span>
              <span className="text-2xl font-black text-gray-900">${(contract.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all">
            <MessageSquare className="w-5 h-5" strokeWidth={2.5}/>
            Message Freelancer
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-red-100 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 shadow-sm transition-all">
            <ShieldAlert className="w-5 h-5" strokeWidth={2.5}/>
            Report Issue / Dispute
          </button>
        </div>
      </div>

      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Request a Revision</h3>
              <button onClick={() => setIsRevisionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-amber-50 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Explain clearly what needs to be changed. This will move the project back to <strong>Active</strong>.
                </p>
              </div>
              <textarea 
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="What should the freelancer change?"
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
              />
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsRevisionModalOpen(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleRevisionSubmit}
                disabled={requestRevisionMutation.isPending || revisionReason.length < 10}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {requestRevisionMutation.isPending ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}