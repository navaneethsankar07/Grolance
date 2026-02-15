import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTicketDetails } from "./supportQueries";
import { useReplyMutation } from "./supportMutations";
import { 
  Loader2, 
  ChevronLeft, 
  Send, 
  CheckCircle, 
  User, 
  Mail, 
  Calendar, 
  BadgeCheck,
  MessageSquare, 
} from "lucide-react";

export default function SupportTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");

  const { data: ticket, isLoading } = useTicketDetails(id);
  const mutation = useReplyMutation();

  const isResolved = ticket?.status === 'resolved';
  const formatTicketId = (id) => `TKT-${String(id).padStart(3, "0")}`;

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    mutation.mutate({ id, admin_reply: replyText }, {
      onSuccess: () => setReplyText("")
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans antialiased">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to list
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400">Status:</span>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
              isResolved 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              {ticket.status}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-10">
          
          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Header Section */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                {ticket.sender_role} Request • {formatTicketId(ticket.id)}
              </p>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {ticket.subject}
              </h1>
            </div>

            {/* Original Message Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">Inquiry Details</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(ticket.created_at).toLocaleString()}
                </span>
              </div>
              <div className="p-8">
                <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {ticket.message}
                </p>
              </div>
            </div>

            {/* Response Section */}
            {isResolved ? (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">This conversation is closed</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  A resolution was sent on {new Date(ticket.resolved_at).toLocaleDateString()}. 
                  The ticket is now archived for internal record keeping.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Your Response</h3>
                  <span className="text-xs text-gray-400 italic">This will be sent via official email</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Provide a detailed solution..."
                    className="w-full h-56 p-6 bg-transparent outline-none text-[15px] text-gray-700 resize-none"
                  />
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <p className="text-xs text-gray-400 font-medium">
                      Submitting will mark this ticket as <span className="text-gray-600 font-bold">Resolved</span>
                    </p>
                    <button
                      onClick={handleSendReply}
                      disabled={mutation.isPending || !replyText.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-all disabled:opacity-20 shadow-sm shadow-gray-200"
                    >
                      {mutation.isPending ? "Sending..." : "Submit & Close"}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">
                Information Panel
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <User className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Name</label>
                    <span className="text-sm font-semibold text-gray-900">{ticket.user_full_name}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <span className="text-sm font-semibold text-gray-900 truncate block">{ticket.user_email}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created Date</label>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(ticket.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <BadgeCheck className="w-4 h-4 text-blue-500" /> Verified System Ticket
                </div>
              </div>
            </div>

            {/* Quick Tips or Policy Box */}
            <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/30">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Admin Policy
              </h4>
              <p className="text-xs leading-relaxed text-blue-800 opacity-80">
All responses are logged and archived. Users will receive an automated email notification once you submit the resolution.              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}