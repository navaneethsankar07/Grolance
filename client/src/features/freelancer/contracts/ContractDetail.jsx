import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContractDetail } from "./contractsQueries";
import { 
  FileText, Package, Clock, Calendar, Briefcase, Tag, 
  Upload, MessageSquare, ShieldAlert, CheckCircle2, IndianRupee,
  X, Link2, ExternalLink, Download, AlertCircle, History,
  Scale, Info, User, Landmark, ListChecks, Target, Layers
} from "lucide-react";
import { useSubmitWork, useRevisionAction } from "./contractMutation";
import { formatDateDMY } from "../../../utils/date";
import { toast } from 'react-toastify';
import { useChatActions } from "../../../components/chat/chatMutations";
import { useModal } from "../../../hooks/modal/useModalStore";

export default function ContractDetail() {
  const { id } = useParams();
  const { data: contract, isLoading, isError } = useContractDetail(id);
  const submitWorkMutation = useSubmitWork();
  const revisionActionMutation = useRevisionAction();
  const { getRoomMutation } = useChatActions();
  const { openModal } = useModal();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, percentage: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [subType, setSubType] = useState('file');
  const [formData, setFormData] = useState({ title: '', file: null, link_url: '', notes: '' });
  const [activeRevisionId, setActiveRevisionId] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");

  useEffect(() => {
    if (!contract) return;
    if (contract.status === 'completed') {
      setTimeLeft({ days: 0, hours: 0, percentage: 100 });
      return;
    }
    const signedAt = contract.freelancer_signed_at || contract.created_at;
    const days = Number(contract.delivery_days) || 0;
    if (signedAt && days > 0) {
      const calculateTime = () => {
        const start = new Date(signedAt).getTime();
        const durationMs = days * 24 * 60 * 60 * 1000;
        const end = start + durationMs;
        const now = new Date().getTime();
        const difference = end - now;
        if (difference > 0) {
          const d = Math.floor(difference / (1000 * 60 * 60 * 24));
          const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const totalDuration = end - start;
          const elapsed = now - start;
          const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
          setTimeLeft({ days: d, hours: h, percentage });
        } else {
          setTimeLeft({ days: 0, hours: 0, percentage: 100 });
        }
      };
      calculateTime();
      const timer = setInterval(calculateTime, 60000);
      return () => clearInterval(timer);
    }
  }, [contract?.freelancer_signed_at, contract?.delivery_days, contract?.status]);

  const handleOpenChat = async () => {
    try {
      const targetId = contract.client_id || contract.client; 
      if (!targetId) {
        toast.error("Client information missing.");
        return;
      }
      const room = await getRoomMutation.mutateAsync(targetId);
      openModal("messages", { initialRoomId: room.id });
    } catch (error) {
      toast.error("Could not open chat. Please try again.");
    }
  };

  const handleRevisionDecision = (revisionId, action) => {
    if (action === 'reject') {
      setActiveRevisionId(revisionId);
      setIsRejectModalOpen(true);
      return;
    }
    revisionActionMutation.mutate({ revisionId, action }, {
      onSuccess: () => toast.success("Revision accepted. Status updated to Active."),
      onError: (err) => toast.error(err.response?.data?.error || "Error updating revision")
    });
  };

  const confirmRejection = () => {
    if (!rejectionNote.trim()) return toast.warning("Please provide a reason for rejection");
    revisionActionMutation.mutate({ 
      revisionId: activeRevisionId, 
      action: 'reject', 
      message: rejectionNote 
    }, {
      onSuccess: () => {
        setIsRejectModalOpen(false);
        setRejectionNote("");
        setActiveRevisionId(null);
        toast.success("Revision rejected");
      }
    });
  };

  const handleWorkSubmission = async () => {
    const data = new FormData();
    data.append('deliverable_type', subType); 
    data.append('title', formData.title);
    data.append('notes', formData.notes || ""); 
    if (subType === 'file') {
      if (!formData.file) return toast.warning("Please select a file");
      data.append('file', formData.file);
    } else {
      if (!formData.link_url) return toast.warning("Please enter a URL");
      data.append('link_url', formData.link_url);
    }
    submitWorkMutation.mutate({ id, formData: data }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', file: null, link_url: '', notes: '' });
        toast.success("Work submitted successfully");
      }
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-medium text-slate-500">Loading Order Interface...</div>;
  if (isError || !contract) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Error loading order details.</div>;

  const getDueDateDisplay = () => {
    const signedAt = contract.freelancer_signed_at || contract.created_at;
    if (!signedAt) return '---';
    const date = new Date(signedAt);
    date.setDate(date.getDate() + Number(contract.delivery_days || 0));
    return formatDateDMY(date.toISOString());
  };

  const dispute = contract.dispute_details;
  const isSelfDisputed = dispute && dispute.raised_by_id === contract.freelancer_id;
  const isCurrentlyDisputed = ['disputed', 'dispute'].includes(contract.status);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Workspace Dashboard</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Order Execution</h1>
            <p className="text-lg text-slate-500 mt-1">Order #ORD-{contract.id + 8000} • Vendor Workspace</p>
          </div>
          <div className="flex gap-3">
             <button onClick={handleOpenChat} className="group inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                Open Workspace Chat <MessageSquare className="w-4 h-4" />
             </button>
          </div>
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
                    <h3 className="text-base font-bold text-slate-900">Arbitration Status</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${isSelfDisputed ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
                      {isSelfDisputed ? "Raised by You" : "Raised by Client"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Case Reference: #{dispute.id}</p>
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
                  <Info className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Dispute Foundation</h4>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">{dispute.reason}</p>
                  <p className="text-[11px] text-slate-400 mt-3 font-bold uppercase">Logged: {new Date(dispute.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4 border-l border-slate-100 pl-10">
                <div className="flex items-center gap-2 text-slate-400">
                  <Landmark className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Admin Determination</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                  "{dispute.admin_notes || "Determination pending administrative review. Delivery and payment cycles are temporarily paused."}"
                </p>
                {dispute.resolved_at && (
                  <div className="flex items-center gap-2 mt-4 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Resolved on {new Date(dispute.resolved_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-slate-100">
            <div className="p-8">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Order Reference</p>
              <p className="text-xl font-bold text-slate-900">#ORD-{contract.id + 8000}</p>
            </div>
            <div className="p-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                {contract.profile_photo ? (
                  <img src={contract.profile_photo} alt="Client" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Client</p>
                <p className="text-sm font-bold text-slate-900">{contract.client_name}</p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Project Value</p>
              <p className="text-xl font-bold text-slate-900">${Number(contract.total_amount).toLocaleString()}</p>
            </div>
            <div className="p-8 bg-slate-50/50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Workflow Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${contract.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
                <p className="text-xl font-bold text-slate-900 uppercase">{contract.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                  <FileText className="w-6 h-6 text-slate-300" />
                  Project Brief
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
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Commencement</p>
                  <p className="text-base font-bold text-slate-700 mt-1">{formatDateDMY(contract.freelancer_signed_at || contract.created_at)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Hard Deadline</p>
                  <p className="text-base font-bold text-slate-700 mt-1">{getDueDateDisplay()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Delivery Window</p>
                  <p className="text-base font-bold text-blue-600 mt-1">{contract.delivery_days} Working Days</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Submitted Assets</h2>
                {contract.status === 'active' && (
                  <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-md hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-100">
                    Submit Deliverable
                  </button>
                )}
              </div>
              <div className="p-10">
                {contract.deliverables?.length > 0 ? (
                  <div className="space-y-4">
                    {contract.deliverables.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="p-4 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                            {item.deliverable_type === 'link' ? <Link2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{item.deliverable_type} • {formatDateDMY(item.created_at)}</p>
                          </div>
                        </div>
                        <a href={item.file_url} target="_blank" rel="noreferrer" className="p-3 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-100">
                          <Download className="w-5 h-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50/30 rounded-lg border border-dashed border-slate-200">
                    <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-base font-bold text-slate-900">Queue is empty</p>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">Upload your first deliverable to begin the client review process.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">Production Timeline</h2>
              <div className="mb-8">
                {!isCurrentlyDisputed && contract.status !== 'completed' ? (
                   <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{timeLeft.days}D</span>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{timeLeft.hours}H</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Until Maturity</p>
                   </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 uppercase">Clock Suspended</span>
                  </div>
                )}
              </div>
              <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
                <div 
                  className={`absolute left-0 top-0 h-full transition-all duration-1000 rounded-full ${
                    contract.status === 'completed' || contract.status ==='CANCELLED' ? 'bg-green-500' : 
                    isCurrentlyDisputed ? 'bg-amber-400' : 'bg-blue-600'
                  }`} 
                  style={{ width: `${timeLeft.percentage}%` }} 
                />
              </div>
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800 font-semibold leading-relaxed">Funds are secured in Escrow and will be released upon client approval of final deliverables.</p>
              </div>
            </div>

            {contract.revisions?.length > 0 && (
              <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                <div className="bg-red-50/50 px-8 py-4 border-b border-red-50 flex items-center gap-2">
                  <History className="w-4 h-4 text-red-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Modification Requests</h2>
                </div>
                <div className="p-8 space-y-6">
                  {contract.revisions.map((rev, index) => (
                    <div key={rev.id} className="space-y-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Request #{index + 1}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                          rev.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          rev.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                        }`}>
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">"{rev.reason}"</p>
                      {rev.status === 'pending' && !isCurrentlyDisputed && contract.status !== 'completed' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleRevisionDecision(rev.id, 'accept')} className="flex-1 py-2 bg-primary text-white text-[10px] font-bold rounded-md hover:bg-blue-600 uppercase tracking-widest transition-all">Accept</button>
                          <button onClick={() => handleRevisionDecision(rev.id, 'reject')} className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md hover:bg-slate-50 uppercase tracking-widest transition-all">Decline</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
                 {isCurrentlyDisputed ? (
                  <div className="w-full flex items-center justify-center gap-3 py-5 bg-slate-50 border border-slate-200 text-slate-400 text-[11px] font-bold rounded-lg uppercase tracking-widest shadow-inner">
                    <ShieldAlert className="w-4 h-4" /> Arbitration Review In Progress
                  </div>
                ) : (
                  <button 
                     onClick={() => openModal("raise-dispute", { contractId: id })} 
                     className="w-full flex items-center justify-center gap-3 py-5 bg-white border border-red-50 text-red-600 text-[11px] font-bold rounded-lg hover:bg-red-50 transition-all uppercase tracking-widest"
                  >
                    <ShieldAlert className="w-4 h-4" /> Raise Dispute
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Decline Modification</h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-900 font-semibold leading-relaxed">Declining a revision may lead to a dispute. Clearly state why the request falls outside the original project scope.</p>
              </div>
              <textarea 
                rows="4"
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:outline-none resize-none font-medium"
                placeholder="State your technical or contractual reasoning..."
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-slate-50">Cancel</button>
                <button onClick={confirmRejection} disabled={revisionActionMutation.isPending} className="flex-1 py-4 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-100">
                  {revisionActionMutation.isPending ? "Processing..." : "Confirm Decline"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Submit Deliverable</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Order #ORD-{contract.id + 8000}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex bg-slate-100 p-1.5 rounded-lg">
                <button className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${subType === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`} onClick={() => setSubType('file')}>Direct Upload</button>
                <button className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${subType === 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`} onClick={() => setSubType('link')}>External Link</button>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Asset Label</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium" placeholder="e.g. Final Identity Design - V1" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              {subType === 'file' ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-blue-300 transition-colors bg-slate-50/50">
                  <input type="file" id="dropzone-file" className="hidden" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} />
                  <label htmlFor="dropzone-file" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700">{formData.file ? formData.file.name : "Select Asset File"}</p>
                    <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Standard Formats Up to 50MB</p>
                  </label>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Resource URL</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium" placeholder="https://..." value={formData.link_url} onChange={(e) => setFormData({...formData, link_url: e.target.value})} />
                </div>
              )}
              <button onClick={handleWorkSubmission} disabled={submitWorkMutation.isPending} className="w-full py-5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 uppercase tracking-widest shadow-lg shadow-blue-100 transition-all">
                {submitWorkMutation.isPending ? "Uploading Asset..." : "Confirm Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}