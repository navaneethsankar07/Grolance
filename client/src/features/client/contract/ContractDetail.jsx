import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useContractDetail } from "../../freelancer/contracts/contractsQueries";
import { useRequestRevision, useUpdateContractStatus } from "./contractMutations";
import { useChatActions } from "../../../components/chat/chatMutations";
import { 
  FileText, Clock, Download, MessageSquare, ShieldAlert, 
  ExternalLink, X, AlertCircle, CheckCircle2, ShieldCheck,
  Scale, Info, History, Landmark, User, Tag, ListChecks, Target, Layers
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
  
  const isFreelancerDisputed = dispute && dispute?.raised_by_id === contract.freelancer_id;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Escrow Protected</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contract Management</h1>
            <p className="text-lg text-slate-500 mt-1">Order #ORD-{contract.id + 8000} • {contract.project_title}</p>
          </div>
          <Link to={`/my-projects/${contract.project_id}`} className="group inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            View Project Brief <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {dispute && (
          <div className="mb-10 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-100 rounded-lg text-amber-700">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Resolution Center Audit</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${isFreelancerDisputed ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {isFreelancerDisputed ? "Raised by Freelancer" : "Raised by You"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Case ID: #{dispute.id}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                dispute.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {dispute.status}
              </span>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Dispute Statement</h4>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">{dispute.reason}</p>
                  <p className="text-[11px] text-slate-400 mt-3 font-bold uppercase italic">Log Date: {new Date(dispute.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4 border-l border-slate-100 pl-10">
                <div className="flex items-center gap-2 text-slate-400">
                  <Landmark className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Arbitration Notes</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {dispute.admin_notes || "Determination pending administrative review. Both parties will be notified upon a final decision."}
                </p>
                {dispute.resolved_at && (
                  <div className="flex items-center gap-2 mt-4 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Resolved on {new Date(dispute.resolved_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-slate-100">
            <div className="p-8">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reference</p>
              <p className="text-xl font-bold text-slate-900">#ORD-{contract.id + 8000}</p>
            </div>
            <div className="p-8">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vendor</p>
              <p className="text-xl font-bold text-slate-900">{contract.freelancer_name}</p>
            </div>
            <div className="p-8">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service Tier</p>
              <p className="text-xl font-bold text-blue-600">{contract.package_name || "Enterprise"}</p>
            </div>
            <div className="p-8 bg-slate-50/50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contract Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xl font-bold text-green-700 uppercase">{contract.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          {contract.revisions?.some(r => r.status === 'rejected') && (
            <div className="p-5 bg-red-50 border border-red-200 rounded-lg flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-900">Modification Request Declined</p>
                <p className="text-xs text-red-700 mt-1 font-medium">{contract.revisions.find(r => r.status === 'rejected')?.rejection_message}</p>
              </div>
            </div>
          )}
          {acceptedRevision && (
            <div className="p-5 bg-green-50 border border-green-200 rounded-lg flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-900">Revision Request Accepted</p>
                <p className="text-xs text-green-700 mt-1 font-medium">The vendor has accepted the modifications and is processing the update.</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                  <FileText className="w-6 h-6 text-slate-300" />
                  Service Specifications
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">{contract.project_category}</span>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-slate-800">{contract.project_title}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Info className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Description</h4>
                  </div>
                  <div className="p-8 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 leading-relaxed whitespace-pre-line text-base">
                    {contract.project_description}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <ListChecks className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Requirements</h4>
                      </div>
                      <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-lg text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {contract.requirements || "No specific requirements provided."}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Target className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Expected Deliverables</h4>
                      </div>
                      <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-lg text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {contract.expected_deliverables || "No specific deliverables stated."}
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Layers className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Required Technologies</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contract.skills?.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-100">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Effective Date</p>
                  <p className="text-base font-bold text-slate-700 mt-1">{new Date(contract.freelancer_signed_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Target Completion</p>
                  <p className="text-base font-bold text-slate-700 mt-1">{dueDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Countdown</p>
                  <p className={`text-base font-bold mt-1 ${timeLeft.days < 2 ? 'text-red-600' : 'text-blue-600'}`}>
                    {contract.status === 'completed' ? 'Delivered' : `${timeLeft.days}D : ${timeLeft.hours}H`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Project Deliverables</h2>
                {contract.status === 'active' && (
                  <span className="flex items-center gap-2 text-[10px] bg-blue-50 text-blue-700 px-4 py-1.5 rounded-md font-bold border border-blue-100 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" /> Work in Progress
                  </span>
                )}
              </div>
              <div className="p-10">
                {contract.deliverables?.length > 0 ? (
                  <div className="space-y-4">
                    {contract.deliverables.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="p-4 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-900">{item.title || `Asset Submission #${index + 1}`}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{item.deliverable_type} • {new Date(item.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition-colors">
                          <Download className="w-4 h-4" /> Download
                        </a>
                      </div>
                    ))}
                    
                    {contract.status === 'submitted' && (
                      <div className="flex gap-4 pt-10">
                        <button onClick={handleApproveOrder} disabled={updateStatusMutation.isPending} className="px-10 py-4 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100">
                          <CheckCircle2 className="w-5 h-5" /> Approve Submissions
                        </button>
                        {pendingRevision ? (
                          <div className="px-8 py-4 bg-slate-50 text-slate-500 border border-slate-200 rounded-md text-xs font-bold uppercase tracking-widest">Revision Pending</div>
                        ) : (
                          <button onClick={() => setIsRevisionModalOpen(true)} className="px-10 py-4 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-md hover:bg-slate-50 transition-colors">
                            Request Modification
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50/30 rounded-lg border border-dashed border-slate-200">
                    <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-base font-bold text-slate-900">No deliverables found</p>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">Assets will appear here once submitted by the vendor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Financial Overview</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-sm font-semibold text-slate-500">
                  <span>Agreement Subtotal</span>
                  <span className="text-slate-900">${Number(contract.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-500">
                  <span>Transaction Fees</span>
                  <span className="text-slate-900">$0.00</span>
                </div>
                <div className="pt-8 border-t border-slate-100 flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Total Paid</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">${(contract.total_amount).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-10 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800 font-semibold leading-relaxed">Funds are held securely by our platform and disbursed only upon deliverable approval.</p>
              </div>
            </div>

            {contract.legal_document_url && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 hover:border-blue-200 transition-colors group">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Service Agreement</h3>
                    <p className="text-[10px] text-slate-400 font-bold">LEGALLY BINDING DOCUMENT</p>
                  </div>
                </div>
                <a href={contract.legal_document_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 border border-slate-100 uppercase tracking-widest transition-all">
                  <Download className="w-4 h-4" /> Download Agreement
                </a>
              </div>
            )}
            
            {!dispute?.id && (
              <div className="grid grid-cols-1 gap-4">
                <button onClick={handleMessageFreelancer} disabled={getRoomMutation.isPending} className="w-full flex items-center justify-center gap-4 py-5 bg-white border border-slate-200 text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm uppercase tracking-widest transition-all">
                  <MessageSquare className="w-5 h-5 text-slate-400" /> {getRoomMutation.isPending ? "Connecting..." : "Open Workspace Chat"}
                </button>
                
                {contract.status === 'disputed' || contract.status === 'dispute' ? (
                  <div className="w-full flex items-center justify-center gap-4 py-5 bg-slate-50 border border-slate-200 text-slate-400 text-xs font-bold rounded-lg uppercase tracking-widest">
                    <ShieldAlert className="w-5 h-5" /> Dispute Under Review
                  </div>
                ) : (
                  <button onClick={() => openModal("client-raise-dispute", { contractId: contract.id })} className="w-full flex items-center justify-center gap-4 py-5 bg-white border border-red-50 text-red-600 text-[10px] font-bold rounded-lg hover:bg-red-50 transition-all uppercase tracking-widest">
                    <ShieldAlert className="w-4 h-4" /> Raise Dispute
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Request Modification</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Order #ORD-{contract.id + 8000}</p>
              </div>
              <button onClick={() => setIsRevisionModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10">
              <div className="mb-6 p-5 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-900 font-semibold leading-relaxed">Provide specific feedback regarding the changes required to meet the original brief.</p>
              </div>
              <textarea 
                className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:outline-none transition-all resize-none font-medium"
                placeholder="State the specific deliverables that need adjustment..."
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
              />
            </div>
            <div className="px-10 py-8 bg-slate-50 flex gap-4">
              <button onClick={() => setIsRevisionModalOpen(false)} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={handleRevisionSubmit} disabled={requestRevisionMutation.isPending || revisionReason.length < 10} className="flex-1 px-6 py-4 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                {requestRevisionMutation.isPending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}