import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X,
  FileText,
  Download,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Scale,
  CheckCircle2,
  Lock,
  User,
  Briefcase
} from "lucide-react";
import { useAdminDisputeDetail } from "./disputeQueries";
import { resolveDispute } from "./disputeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DisputeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [adminNote, setAdminNote] = useState("");

  const { data: dispute, isLoading, isError } = useAdminDisputeDetail(id);

  const mutation = useMutation({
    mutationFn: resolveDispute,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "disputes", id]);
      alert("Arbitration finalized and contract status updated.");
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-4" />
      <p className="text-slate-500 text-sm font-medium">Fetching Audit Evidence...</p>
    </div>
  );

  if (isError || !dispute) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Case Record Unavailable</h2>
        <button onClick={() => navigate("/admin/disputes")} className="mt-4 text-primary font-bold">Return to Dashboard</button>
      </div>
    </div>
  );

  const contract = dispute.contract_details;
  const isPending = dispute.status === 'pending';
  
  // Logic to determine labels and values based on the "Opener"
  const opener = dispute.opened_by; // "Client" or "Freelancer"

  const handleDecision = (action) => {
    if (!adminNote.trim()) return alert("Internal review notes are required for the audit trail.");
    
    let finalDisputeStatus;
    let finalContractStatus;

    if (action === 'APPROVE_OPENER') {
      finalDisputeStatus = 'resolved';
      // If client is right, refund. If freelancer is right, complete/pay.
      finalContractStatus = opener === 'Client' ? 'refunded' : 'completed';
    } else {
      finalDisputeStatus = 'rejected';
      // If client is wrong, complete/pay freelancer. If freelancer is wrong, refund client.
      finalContractStatus = opener === 'Client' ? 'completed' : 'refunded';
    }

    mutation.mutate({ 
      id, 
      status: finalDisputeStatus, 
      admin_notes: adminNote, 
      contract_status: finalContractStatus 
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin/disputes")} className="p-1.5 hover:bg-slate-100 rounded transition-colors border border-transparent hover:border-slate-200">
              <X className="w-4 h-4 text-slate-500" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arbitration Case</span>
                <span className="text-xs font-bold text-slate-900">#DSP-{dispute.id}</span>
              </div>
              <h1 className="text-sm font-semibold text-slate-700">Dispute Review Portal</h1>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${
            isPending ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {dispute.status.replace('_', ' ')}
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-6 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Dispute Origin Indicator */}
          <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              {opener === 'Client' ? <User className="w-5 h-5 text-slate-600" /> : <Briefcase className="w-5 h-5 text-slate-600" />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Dispute Raised By</p>
              <p className="text-sm font-bold text-slate-900">{opener} — <span className="font-medium text-slate-500">{opener === 'Client' ? dispute.client_name : dispute.freelancer_name}</span></p>
            </div>
          </div>

          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-3.5 h-3.5" /> Filed Claim
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">Date: {new Date(dispute.created_at).toLocaleDateString()}</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3 capitalize">{dispute.reason.replace(/_/g, ' ')}</h3>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl mb-8">
                <p className="text-sm text-slate-600 leading-relaxed italic">"{dispute.description}"</p>
              </div>

              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Evidence Gallery</h4>
              <div className="grid grid-cols-2 gap-4">
                {dispute.evidence_files?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-primary transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                      <span className="text-xs font-semibold text-slate-700 truncate">Exhibit_{index + 1}.pdf</span>
                    </div>
                    <a href={file} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Decision Panel */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden border-t-4 border-t-primary/20">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Administrative Determination</h2>
              {!isPending && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </div>
            
            <div className="p-6">
              {isPending ? (
                <>
                  <textarea 
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Provide a detailed rationale for this decision..."
                    className="w-full h-36 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none mb-6 focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all resize-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleDecision('APPROVE_OPENER')}
                      disabled={mutation.isPending}
                      className="bg-primary text-white font-bold text-[11px] py-4 rounded-xl uppercase tracking-widest hover:opacity-90 disabled:bg-slate-200 transition-all shadow-md shadow-primary/10"
                    >
                      {mutation.isPending ? "Updating..." : `Resolve in Favor of ${opener}`}
                    </button>
                    <button 
                      onClick={() => handleDecision('REJECT_OPENER')}
                      disabled={mutation.isPending}
                      className="bg-white border-2 border-slate-900 text-slate-900 font-bold text-[11px] py-4 rounded-xl uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                    >
                      Reject Claim
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 text-center italic">
                    Note: Resolving in favor of {opener} will set contract to <strong>{opener === 'Client' ? 'Refunded' : 'Completed'}</strong>.
                  </p>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Decision Archived</h3>
                  <div className="mt-4 text-left p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Internal Note:</p>
                    <p className="text-sm text-slate-700 leading-relaxed italic">"{dispute.admin_notes || "No notes provided."}"</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <aside className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Contract Registry</h2>
            <div className="p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Escrow Amount</span>
              <div className="text-2xl font-black text-slate-900">${contract?.total_amount}</div>
            </div>
            
            <div className="space-y-4 px-1">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Project Title</span>
                <span className="text-sm font-semibold text-slate-700">{contract?.project_title}</span>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Current Status</span>
                <div className="mt-1">
                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded uppercase">
                        {contract?.status}
                    </span>
                </div>
              </div>
            </div>
          </aside>

          <div className="p-5 bg-slate-50 border-l-4 border-slate-300 rounded-r-xl flex items-start gap-4 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-relaxed">
              <span className="text-slate-900 font-bold block mb-1 uppercase tracking-tighter">Audit Compliance</span>
              Decisions are legally binding and immutable once finalized. All actions are logged with the administrator's ID and IP address.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}