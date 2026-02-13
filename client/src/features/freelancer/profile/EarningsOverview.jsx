import React, { useState } from "react";
import { useFreelancerTransactions } from "./profileQueries";
import { formatDateDMY } from "../../../utils/date";

export default function EarningsOverview() {
  const [tempFilters, setTempFilters] = useState({
    status: "All Statuses",
    range: "All Time",
  });
  const [activeFilters, setActiveFilters] = useState({
    status: "All Statuses",
    range: "All Time",
    page: 1,
  });

  const { data, isLoading, isError } = useFreelancerTransactions(activeFilters);
  
  const handleApplyFilters = () => {
    setActiveFilters({ ...tempFilters, page: 1 });
  };
  
  const StatusBadge = ({ status }) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      active: "bg-blue-100 text-primary",
      offered: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-gray-100 text-gray-700",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.cancelled}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return <div className="p-20 text-center font-medium text-gray-500">Loading Earnings...</div>;
  if (isError) return <div className="p-20 text-center text-red-500 font-bold">Failed to load transactions.</div>;
  
  const earningsData = data.results;
  
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-[26px] font-black text-gray-900 leading-tight">Earnings Overview</h1>
              <p className="text-sm text-gray-500 mt-1">Track your income and payment history</p>
            </div>

            <div className="w-full lg:w-[300px] bg-primary rounded-2xl shadow-xl shadow-blue-100 p-5 sm:p-6 transition-transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 1.66699V18.3337" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M14.1667 4.16699H7.91667C6.40125 4.16699 5 5.56825 5 7.08366C5 8.59907 6.40125 10.0003 7.91667 10.0003H12.0833C13.5987 10.0003 15 11.4016 15 12.917C15 14.4324 13.5987 15.8337 12.0833 15.8337H5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Balance</span>
              </div>
              <p className="text-xs text-blue-100 mb-1 font-bold">Total Earnings (Filtered)</p>
              <p className="text-3xl sm:text-[34px] font-black text-white leading-none">
                ${Number(earningsData.total_earning).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Status</label>
              <select
                value={tempFilters.status}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                className="w-full h-12 px-4 text-sm font-bold text-gray-900 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              >
                <option>All Statuses</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="offered">Offered</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Time Range</label>
              <select
                value={tempFilters.range}
                onChange={(e) => setTempFilters({ ...tempFilters, range: e.target.value })}
                className="w-full h-12 px-4 text-sm font-bold text-gray-900 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              >
                <option>All Time</option>
                <option value="1m">Last Month</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <button
              onClick={handleApplyFilters}
              className="h-12 w-full lg:w-auto px-8 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-2 border-b border-gray-50">
            <h2 className="text-lg font-black text-gray-900">Transaction History</h2>
            <p className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">{data.count} transactions found</p>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Earnings</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {earningsData.contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-5 text-xs font-bold text-gray-400">#{contract.id.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{contract.project_title}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-900">${Number(contract.freelancer_earnings).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={contract.status} /></td>
                    <td className="px-6 py-5 text-[11px] font-bold text-gray-500">{formatDateDMY(contract.client_signed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-gray-100">
            {earningsData.contracts.map((contract) => (
              <div key={contract.id} className="p-5 flex flex-col gap-3 active:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">#{contract.id.toString().padStart(3, '0')}</p>
                    <p className="text-sm font-bold text-gray-900 leading-snug">{contract.project_title}</p>
                  </div>
                  <span className="text-sm font-black text-gray-900">${Number(contract.freelancer_earnings).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <StatusBadge status={contract.status} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{formatDateDMY(contract.client_signed_at)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
            <button
              disabled={!data.previous}
              onClick={() => setActiveFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Page</span>
              <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-black shadow-md shadow-blue-200">{activeFilters.page}</span>
            </div>
            <button
              disabled={!data.next}
              onClick={() => setActiveFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}