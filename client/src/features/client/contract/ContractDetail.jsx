import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useContractDetail } from "../../freelancer/contracts/contractsQueries";
import { 
  FileText, Package, Clock, Calendar, Briefcase, Tag, 
  Download, MessageSquare, ShieldAlert, CheckCircle2, IndianRupee, User, ExternalLink
} from "lucide-react";

export default function ClientContractDetail() {
  const { id } = useParams();
  const { data: contract, isLoading, isError } = useContractDetail(id);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, percentage: 0 });

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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading contract details.</div>;

  const dueDate = new Date(new Date(contract.freelancer_signed_at).getTime() + (contract.delivery_days * 24 * 60 * 60 * 1000));

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

        {/* PROJECT DESCRIPTION */}
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

        {/* DELIVERY STATUS / SUBMISSION VIEW */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Delivery Status</h2>
          </div>
          <div className="p-8">
            {contract.status === 'submitted' || contract.status === 'completed' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Final Submission</p>
                      <p className="text-xs text-gray-500">2.4 MB • Submitted on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700">
                    Approve & Mark Completed
                  </button>
                  <button className="px-6 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50">
                    Request Revision
                  </button>
                </div>
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

        {/* PAYMENT SUMMARY */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">Payment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal ({contract.package_name || 'Package'})</span>
              <span className="text-gray-900 font-bold">₹{Number(contract.total_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Platform Service Fee</span>
              <span className="text-gray-900 font-bold">₹{(contract.total_amount * 0.05).toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-md font-bold text-gray-900">Total Paid</span>
              <span className="text-2xl font-black text-gray-900">₹{(contract.total_amount * 1.05).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
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
    </div>
  );
}