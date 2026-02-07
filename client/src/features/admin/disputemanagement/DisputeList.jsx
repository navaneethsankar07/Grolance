import { useState } from "react";
import { Search, Loader2, User } from "lucide-react";
import { useAdminDisputes } from "./disputeQueries";
import { useNavigate } from "react-router-dom";

export default function DisputeList() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: disputes, isLoading, isError } = useAdminDisputes();

  const getStatusLabel = (status) => {
    return status.replace("_", " ").toUpperCase();
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const filteredDisputes = disputes?.results?.filter((dispute) => {
    const matchesFilter = activeFilter === "All" || dispute.status === activeFilter;
    const matchesSearch = 
      searchQuery === "" ||
      dispute.id.toString().includes(searchQuery) ||
      dispute.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.freelancer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center text-primary font-bold bg-white">
      Error loading disputes. Please check your connection.
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dispute Resolution Center</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and resolve conflicts between users</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{filteredDisputes?.length || 0}</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Cases</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <input
              type="text"
              placeholder="Search by ID, Client or Freelancer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl h-12">
            {["All", "pending"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-1 text-[10px] font-bold rounded-lg transition-all uppercase tracking-tight ${
                  activeFilter === f ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["All", "pending", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 text-[11px] font-black rounded-full border transition-all whitespace-nowrap uppercase tracking-widest ${
                activeFilter === f 
                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                  : "bg-white border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Case ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Client</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Freelancer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dispute Reason</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDisputes?.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        #{dispute.id}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-2 font-medium">
                        {new Date(dispute.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{dispute.client_name}</span>
                        </div>
                        
                      </div>
                    </td>
                    <td>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                            <User className="w-3 h-3 text-indigo-400" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{dispute.freelancer_name}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 font-medium line-clamp-1 italic">
                          "{dispute.reason.replace("_", " ")}"
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{dispute.description}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border tracking-wider ${getStatusStyles(dispute.status)}`}>
                        {getStatusLabel(dispute.status)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/admin/disputes/${dispute.id}`)}
                        className="px-6 py-2 bg-white border-2 border-primary text-primary text-[11px] font-black rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        VIEW CASE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDisputes?.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-medium">No disputes found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}