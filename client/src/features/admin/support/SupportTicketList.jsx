import React, { useState } from "react";
import { useSupportTickets } from "./supportQueries";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function SupportTicketList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");

  const { data, isLoading, isError } = useSupportTickets(page, statusFilter);

  const getStatusBadgeClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider";
      case "resolved":
        return "bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider";
      default:
        return "bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider";
    }
  };
    const formatTicketId = (id) => {
  if (!id) return "";
  return `#TKT-${String(id).padStart(3, '0')}`;
};

  if (isError) return <div className="p-8 text-center text-red-500 font-bold">Failed to load tickets.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-[1420px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl md:text-[26px] font-black text-gray-900">
            Support Requests
          </h1>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-[200px] px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option>All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Ticket ID
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Sender Role
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.results?.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {formatTicketId(ticket.id)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {ticket.sender_role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {ticket.subject}
                        </td>
                        <td className="px-6 py-4">
                          <span className={getStatusBadgeClasses(ticket.status)}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`${ticket.id}`} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-primary border-2 border-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Total Records: {data?.count || 0}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!data?.previous}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 rounded-xl disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data?.next}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 rounded-xl disabled:opacity-30 text-white bg-primary border-primary shadow-lg shadow-primary/20"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {data?.results?.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-black">#{ticket.id}</span>
                    <span className={getStatusBadgeClasses(ticket.status)}>{ticket.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{ticket.subject}</h3>
                  <p className="text-xs text-gray-500 mb-4">{new Date(ticket.created_at).toLocaleDateString()}</p>
                  <button className="w-full py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest rounded-xl">View Ticket</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}