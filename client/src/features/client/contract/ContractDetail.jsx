import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useContractDetail } from "../../freelancer/contracts/contractsQueries";
import { useRequestRevision, useUpdateContractStatus } from "./contractMutations";
import { useChatActions } from "../../../components/chat/chatMutations";
import { 
  FileText, Clock, Download, MessageSquare, ShieldAlert, 
  ExternalLink, X, AlertCircle, CheckCircle2, ShieldCheck,
  Scale, Info, History, Landmark
} from "lucide-react";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/modal/useModalStore";

export default function ClientContractDetail() {
  const { id } = useParams();
  const { data: contract, isLoading, isError } = useContractDetail(id);
  const requestRevisionMutation = useRequestRevision();
  const updateStatusMutation = useUpdateContractStatus();
  const { getRoomMutation } = useChatActions();
  const { openModal } = useModal();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, percentage: 0 });
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");

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

  const handleMessageFreelancer = async () => {
    try {
      const room = await getRoomMutation.mutateAsync(contract.freelancer_id);
      openModal("messages", { initialRoomId: room.id });
    } catch (error) {
      toast.error("Could not open chat. Please try again.");
    }
  };

  const handleRevisionSubmit = () => {
    if (revisionReason.length < 10) {
      toast.error("Please provide a more detailed reason.");
      return;
    }
    requestRevisionMutation.mutate(
      { contractId: id, reason: revisionReason },
      {
        onSuccess: () => {
          setIsRevisionModalOpen(false);
          setRevisionReason("");
          toast.success('Request submitted.');
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-medium text-slate-500">Loading Contract Interface...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Error loading contract details.</div>;

  const dueDate = new Date(new Date(contract.freelancer_signed_at).getTime() + (contract.delivery_days * 24 * 60 * 60 * 1000));
  const pendingRevision = contract.revisions?.find(r => r.status === 'pending');
  const acceptedRevision = contract.revisions?.find(r => r.status === 'accepted');
  const dispute = contract.dispute_details;

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20">
      {/* Container width increased to 1400px */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
        
        {/* Header section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Landmark className="w-6 h-6 text-blue-600" />
              <span className="text-[12px] font-black text-blue-600 uppercase tracking-[0.25em]">Escrow Protected</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Contract Management</h1>
            <p className="text-xl text-gray-500 mt-2 font-medium">Project scope and delivery oversight for #ORD-{contract.id + 8000}</p>
          </div>
          <Link to={`/my-projects/${contract.project_id}`} className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white border border-gray-200 rounded-2xl text-base font-bold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
            View Project Brief <ExternalLink className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Resolution Center Audit Section */}
        {dispute && (
          <div className="mb-10 overflow-hidden bg-white border border-amber-200 rounded-[2.5rem] shadow-sm">
            <div className="bg-amber-50/50 px-8 py-6 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Scale className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Resolution Center Audit</h3>
                  <p className="text-xs text-amber-700 font-bold uppercase tracking-widest">Case Reference: #{dispute.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                  dispute.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  Status: {dispute.status}
                </span>
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Dispute Origin</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Info className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">{dispute.reason}</p>
                      <p className="text-sm text-gray-500 mt-1 uppercase font-semibold">Opened on {new Date(dispute.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Landmark className="w-5 h-5 text-slate-400" />
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Administrator Determination</h4>
                </div>
                <p className="text-base text-slate-700 leading-relaxed font-medium italic">
                  "{dispute.admin_notes || "Determination pending administrative review."}"
                </p>
                {dispute.resolved_at && (
                  <p className="mt-6 text-xs font-bold text-slate-400 uppercase">Resolved: {new Date(dispute.resolved_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Grid - Expanded Height */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-50">
            <div className="p-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Order ID</p>
              <p className="text-2xl font-black text-gray-900">#ORD-{contract.id + 8000}</p>
            </div>
            <div className="p-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Freelancer</p>
              <p className="text-2xl font-black text-gray-900">{contract.freelancer_name}</p>
            </div>
            <div className="p-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Package Level</p>
              <p className="text-2xl font-black text-blue-600">{contract.package_name || "Enterprise"}</p>
            </div>
            <div className="p-10 bg-gray-50/50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Current Lifecycle</p>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <p className="text-2xl font-black text-green-600 uppercase tracking-tighter">{contract.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-5 mb-10">
          {contract.revisions?.some(r => r.status === 'rejected') && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-[1.5rem] flex gap-5 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-8 h-8 text-red-600 shrink-0" />
              <div>
                <p className="text-base font-black text-red-900">Revision Requirements Rejected</p>
                <p className="text-sm text-red-700 mt-1 font-medium leading-relaxed">
                  {contract.revisions.find(r => r.status === 'rejected')?.rejection_message}
                </p>
              </div>
            </div>
          )}
          {acceptedRevision && (
            <div className="p-6 bg-green-50 border border-green-100 rounded-[1.5rem] flex gap-5 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
              <div>
                <p className="text-base font-black text-green-900">Revision Protocol Accepted</p>
                <p className="text-sm text-green-700 mt-1 font-medium">The freelancer has validated your request and is processing the updates.</p>
              </div>
            </div>
          )}
        </div>

        {/* Project Content Section - Grid Adjusted for wider view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">
                  <FileText className="w-8 h-8 text-gray-300" />
                  Scope of Work
                </h2>
                <div className="h-px flex-1 mx-8 bg-gray-50" />
              </div>
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-800">{contract.project_title}</h3>
                <div className="p-8 bg-gray-50 rounded-[2rem] text-base text-gray-600 leading-[2] whitespace-pre-line border border-gray-100/50 shadow-inner">
                  {contract.project_description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-10 border-t border-gray-50">
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Contract Start</p>
                  <p className="text-lg font-bold text-gray-700">{new Date(contract.freelancer_signed_at).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Maturity Date</p>
                  <p className="text-lg font-bold text-gray-700">{dueDate.toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Time Remaining</p>
                  <p className={`text-lg font-black ${timeLeft.days < 2 ? 'text-red-500' : 'text-blue-600'}`}>
                    {contract.status === 'completed' ? 'Delivered' : `${timeLeft.days}D ${timeLeft.hours}H`}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Status */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Deliverable History</h2>
                {contract.status === 'active' && (
                  <span className="flex items-center gap-2 text-xs bg-blue-50 text-blue-600 px-6 py-2.5 rounded-full font-black border border-blue-100 uppercase tracking-[0.2em]">
                    <Clock className="w-4 h-4" /> In Production
                  </span>
                )}
              </div>
              <div className="p-10">
                {contract.deliverables && contract.deliverables.length > 0 ? (
                  <div className="space-y-6">
                    {contract.deliverables.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white rounded-[1.5rem] border border-gray-100 hover:border-blue-100 transition-all group shadow-sm">
                        <div className="flex items-center gap-6">
                          <div className="p-5 bg-blue-50 text-blue-600 rounded-[1.2rem] group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title || `Asset Submission #${index + 1}`}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.15em] mt-1">{item.deliverable_type} • {new Date(item.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <a 
                          href={item.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                        >
                          <Download className="w-5 h-5" /> Download
                        </a>
                      </div>
                    ))}
                    
                    {contract.status === 'submitted' && (
                      <div className="flex flex-wrap gap-6 pt-10">
                        <button 
                          onClick={handleApproveOrder}
                          disabled={updateStatusMutation.isPending}
                          className="px-10 py-5 bg-green-600 text-white text-base font-black rounded-[1.5rem] hover:bg-green-700 transition-all flex items-center gap-3 shadow-xl shadow-green-100"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                          Approve Deliverables
                        </button>
                        
                        {pendingRevision ? (
                          <div className="flex items-center gap-3 px-8 py-5 bg-amber-50 text-amber-700 border border-amber-200 rounded-[1.5rem] text-xs font-black uppercase tracking-widest">
                            <Clock className="w-5 h-5" />
                            Revision Pending
                          </div>
                        ) : (
                          <button 
                            onClick={() => setIsRevisionModalOpen(true)}
                            className="px-10 py-5 bg-white border border-red-100 text-red-600 text-base font-black rounded-[1.5rem] hover:bg-red-50 transition-colors"
                          >
                            Request Modification
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <History className="w-10 h-10 text-gray-200" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">Awaiting Submissions</p>
                    <p className="text-sm text-gray-400 mt-3 max-w-[320px] mx-auto leading-relaxed">The production pipeline is currently active. Files will appear here upon freelancer submission.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Spanning 4 columns */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-10">Financial Summary</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Gross Subtotal</span>
                  <span className="text-gray-900">${Number(contract.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Processing Fee</span>
                  <span className="text-gray-900">$0.00</span>
                </div>
                <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Net Paid</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">${(contract.total_amount).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-10 flex items-start gap-4 p-5 bg-blue-50/50 rounded-[1.5rem] border border-blue-50">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                <p className="text-xs text-blue-800 leading-relaxed font-bold">
                  Funds are secured in our neutral holding account until project completion.
                </p>
              </div>
            </div>

            {contract.legal_document_url && (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Service Agreement</h3>
                    <p className="text-[10px] text-gray-400 font-bold">LEGALLY BINDING PDF</p>
                  </div>
                </div>
                <a 
                  href={contract.legal_document_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gray-50 text-gray-700 text-xs font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest shadow-inner border border-gray-100"
                >
                  <Download className="w-4 h-4" /> Download Agreement
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleMessageFreelancer}
                disabled={getRoomMutation.isPending}
                className="w-full flex items-center justify-center gap-4 py-6 bg-white border border-gray-200 text-gray-900 text-sm font-black rounded-[1.5rem] hover:bg-gray-50 shadow-sm transition-all uppercase tracking-[0.15em]"
              >
                <MessageSquare className="w-5 h-5" />
                {getRoomMutation.isPending ? "Connecting..." : "Open Channel"}
              </button>
              
              {contract.status === 'disputed' || contract.status === 'dispute' ? (
                <div className="w-full flex items-center justify-center gap-4 py-6 bg-gray-50 border border-gray-200 text-gray-400 text-xs font-black rounded-[1.5rem] uppercase tracking-[0.15em]">
                  <ShieldAlert className="w-5 h-5" />
                  Dispute Active
                </div>
              ) : (
                <button 
                  onClick={() => openModal("client-raise-dispute", { contractId: contract.id })}
                  className="w-full flex items-center justify-center gap-4 py-6 bg-white border border-red-50 text-red-500 text-xs font-black rounded-[1.5rem] hover:bg-red-50 shadow-sm transition-all uppercase tracking-[0.15em]"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Raise Dispute
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
            {isRevisionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-gray-50 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Request Modification</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Refine Production Deliverables</p>
              </div>
              <button onClick={() => setIsRevisionModalOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10">
              <div className="mb-6 p-5 bg-blue-50/50 rounded-2xl flex gap-4 border border-blue-100">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 font-medium leading-relaxed italic">
                  Clearly articulate the required changes. Specific instructions accelerate the revision turnaround.
                </p>
              </div>
              <textarea 
                className="w-full h-40 p-6 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:ring-4 focus:ring-blue-100 focus:bg-white focus:outline-none transition-all resize-none font-medium placeholder:text-gray-300 shadow-inner"
                placeholder="Detail the necessary adjustments..."
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
              />
            </div>
            <div className="p-10 bg-gray-50/50 flex gap-4">
              <button 
                onClick={() => setIsRevisionModalOpen(false)}
                className="flex-1 px-6 py-5 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-2xl uppercase tracking-widest hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleRevisionSubmit}
                disabled={requestRevisionMutation.isPending || revisionReason.length < 10}
                className="flex-1 px-6 py-5 bg-red-600 text-white text-xs font-black rounded-2xl uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
              >
                {requestRevisionMutation.isPending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}