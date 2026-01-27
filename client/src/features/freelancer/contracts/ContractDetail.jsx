import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContractDetail } from "./contractsQueries";
import { 
  FileText, Package, Clock, Calendar, Briefcase, Tag, 
  Upload, MessageSquare, ShieldAlert, CheckCircle2, IndianRupee,
  X, Link2, ExternalLink, Download, AlertCircle, History
} from "lucide-react";
import { useSubmitWork, useRevisionAction } from "./contractMutation";
import { formatDateDMY } from "../../../utils/date";

export default function ContractDetail() {
  const { id } = useParams();
  const { data: contract, isLoading, isError } = useContractDetail(id);
  const submitWorkMutation = useSubmitWork();
  const revisionActionMutation = useRevisionAction();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, percentage: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [subType, setSubType] = useState('file');
  const [formData, setFormData] = useState({ title: '', file: null, link_url: '', notes: '' });
  
  const [activeRevisionId, setActiveRevisionId] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");
  
  useEffect(() => {
    if (contract?.status === 'completed') {
      setTimeLeft({ days: 0, hours: 0, percentage: 100 });
      return;
    }

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

  const handleRevisionDecision = (revisionId, action) => {
    if (action === 'reject') {
      setActiveRevisionId(revisionId);
      setIsRejectModalOpen(true);
      return;
    }

    revisionActionMutation.mutate({ revisionId, action }, {
      onSuccess: () => alert("Revision accepted. Status updated to Active."),
      onError: (err) => alert(err.response?.data?.error || "Error updating revision")
    });
  };

  const confirmRejection = () => {
    if (!rejectionNote.trim()) return alert("Please provide a reason for rejection");

    revisionActionMutation.mutate({ 
      revisionId: activeRevisionId, 
      action: 'reject', 
      message: rejectionNote 
    }, {
      onSuccess: () => {
        setIsRejectModalOpen(false);
        setRejectionNote("");
        setActiveRevisionId(null);
      }
    });
  };

  const handleWorkSubmission = async () => {
    const data = new FormData();
    data.append('deliverable_type', subType); 
    data.append('title', formData.title);
    data.append('notes', formData.notes || ""); 

    if (subType === 'file') {
      if (!formData.file) return alert("Please select a file");
      data.append('file', formData.file);
    } else {
      if (!formData.link_url) return alert("Please enter a URL");
      data.append('link_url', formData.link_url);
    }

    submitWorkMutation.mutate({ id, formData: data }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', file: null, link_url: '', notes: '' });
      }
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError || !contract) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading contract details.</div>;

  const dueDate = contract?.freelancer_signed_at ? new Date(new Date(contract.freelancer_signed_at).getTime() + (contract.delivery_days * 24 * 60 * 60 * 1000)) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[1085px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-gray-900 leading-9 mb-2">Order Details</h1>
          <p className="text-sm text-gray-500 leading-6">Manage your ongoing freelance order and submit your work here.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold text-[#111827]">Order Summary</h2>
            <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border uppercase ${
              contract.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
            }`}>
              {contract.status === 'active' ? 'In Progress' : contract.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Order ID</p>
                <p className="text-lg font-bold text-gray-900">#ORD-{contract.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                {contract.profile_photo ? (
                  <img src={contract.profile_photo} alt="Client" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">{contract.client_name?.charAt(0)}</div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Client Name</p>
                <p className="text-lg font-bold text-gray-900">{contract.client_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Package Selected</p>
                <p className="text-lg font-bold text-gray-900">{contract.package_name || "Pro"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <IndianRupee className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Budget</p>
                <p className="text-lg font-bold text-gray-900">${Number(contract.total_amount).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Delivery Days</p>
                <p className="text-lg font-bold text-gray-900">{contract.delivery_days || "14"} Days</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Due Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {dueDate ? formatDateDMY(dueDate) : '---'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-[17px] font-bold text-gray-900">
                {contract.status === 'completed' ? 'Order Completed' : 'Delivery Countdown'}
              </h2>
            </div>
          </div>
          {contract.status !== 'completed' ? (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-gray-900">{timeLeft.days}</span>
              <span className="text-sm font-semibold text-gray-500 mr-2">days</span>
              <span className="text-3xl font-bold text-gray-900">{timeLeft.hours}</span>
              <span className="text-sm font-semibold text-gray-500">hours remaining</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-xl font-bold">The work has been successfully delivered and approved.</span>
            </div>
          )}
          <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-linear rounded-full ${contract.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'}`} 
              style={{ width: `${timeLeft.percentage}%` }} 
            />
          </div>
        </div>

        {contract.revisions?.length > 0 && (
          <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden mb-6">
            <div className="bg-red-50/50 p-6 border-b border-red-50 flex items-center gap-2">
              <History className="w-5 h-5 text-red-600" />
              <h2 className="text-[15px] font-bold text-gray-900">Revision Requests</h2>
            </div>
            <div className="p-6 space-y-4">
              {contract.revisions.map((rev, index) => (
                <div key={rev.id} className="p-5 rounded-xl bg-white border border-red-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-[10px]">
                        {index + 1}
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        rev.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        rev.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatDateDMY(rev.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">"{rev.reason}"</p>
                  </div>
                  {rev.status === 'pending' && contract.status !== 'completed' && (
                    <div className="flex gap-3 pt-2">
                      <button 
                        disabled={revisionActionMutation.isPending}
                        onClick={() => handleRevisionDecision(rev.id, 'accept')}
                        className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Accept Revision
                      </button>
                      <button 
                        disabled={revisionActionMutation.isPending}
                        onClick={() => handleRevisionDecision(rev.id, 'reject')}
                        className="flex-1 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {rev.status === 'rejected' && rev.rejection_message && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-[10px] font-bold text-red-700 uppercase mb-1">Rejection Reason:</p>
                      <p className="text-xs text-red-600 italic">"{rev.rejection_message}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-6">
          <h2 className="text-[17px] font-semibold text-gray-900 mb-6">Project Description</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">{contract.project_title}</h3>
              <div className="text-sm text-gray-700 leading-[26px]">
                <p>{contract.project_description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-50 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Deliverables</h2>
              <p className="text-xs text-gray-500">Files and links submitted to the client.</p>
            </div>
            {contract.status === 'active' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Deliverable
              </button>
            )}
          </div>
          <div className="p-6 space-y-3">
            {contract.deliverables?.length > 0 ? (
              contract.deliverables.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    {item.deliverable_type === 'link' ? <Link2 className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-gray-500" />}
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.title}</p>
                      <p className="text-[10px] text-gray-400">{formatDateDMY(item.created_at)}</p>
                    </div>
                  </div>
                  <a href={item.file_url} target="_blank" rel="noreferrer" className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-xs text-gray-400">No work submitted yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-5 h-5" strokeWidth={2.5}/>
            Message Client
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
            <ShieldAlert className="w-5 h-5" strokeWidth={2.5}/>
            Raise Dispute
          </button>
        </div>
      </div>

      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Reject Revision Request</h3>
              <X className="w-5 h-5 cursor-pointer text-gray-400" onClick={() => setIsRejectModalOpen(false)} />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Reason for Rejection</label>
                <textarea 
                  rows="4"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 ring-red-500/20 resize-none"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRejection}
                  disabled={revisionActionMutation.isPending}
                  className="flex-1 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {revisionActionMutation.isPending ? "Submitting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Submit Deliverable</h3>
              <X className="w-5 h-5 cursor-pointer text-gray-400" onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="p-6 space-y-5">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${subType === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setSubType('file')}>File Upload</button>
                <button className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${subType === 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`} onClick={() => setSubType('link')}>Paste Link</button>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Display Title</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              {subType === 'file' ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-blue-300 transition-colors">
                  <input type="file" id="dropzone-file" className="hidden" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} />
                  <label htmlFor="dropzone-file" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <p className="text-xs font-bold text-gray-700">{formData.file ? formData.file.name : "Select your file"}</p>
                    <p className="text-[10px] text-gray-400 mt-1">ZIP, PDF, PNG or JPG (Max 50MB)</p>
                  </label>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">URL</label>
                  <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20" value={formData.link_url} onChange={(e) => setFormData({...formData, link_url: e.target.value})} />
                </div>
              )}
              <button onClick={handleWorkSubmission} disabled={submitWorkMutation.isPending} className="w-full py-4 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                {submitWorkMutation.isPending ? "Uploading..." : "Submit Deliverable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}