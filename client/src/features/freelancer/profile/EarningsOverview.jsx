import React, { useState } from "react";
import { useFreelancerTransactions } from "./profileQueries";
import { formatDateDMY } from "../../../utils/date";

export default function EarningsOverview() {
  const [page, setPage] = useState(1);
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
    setPage(1);
    setActiveFilters({ ...tempFilters, page: 1 });
  };
  
  const StatusBadge = ({ status }) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      active: "bg-blue-100 text-blue-800",
      offered: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-gray-100 text-gray-700",
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium capitalize ${styles[status] || styles.cancelled}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return <div className="p-20 text-center">Loading Earnings...</div>;
  if (isError) return <div className="p-20 text-center text-red-500">Failed to load transactions.</div>;
  
  const earningsData = data.results;
  
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1320px] mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-[26px] font-bold text-gray-900 leading-9">Earnings Overview</h1>
              <p className="text-sm text-gray-600 mt-2">Track your income and payment history</p>
            </div>

            <div className="w-full lg:w-[280px] bg-blue-500 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 1.66699V18.3337" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14.1667 4.16699H7.91667C6.40125 4.16699 5 5.56825 5 7.08366C5 8.59907 6.40125 10.0003 7.91667 10.0003H12.0833C13.5987 10.0003 15 11.4016 15 12.917C15 14.4324 13.5987 15.8337 12.0833 15.8337H5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-blue-100 mb-2">Total Earnings (Filtered)</p>
              <p className="text-[31px] font-bold text-white leading-10">
                ${Number(earningsData.total_earning).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-6">
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-5 lg:items-end">
            <div className="flex-1 max-w-[439px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={tempFilters.status}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                className="w-full h-[37px] px-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option>All Statuses</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="offered">Offered</option>
              </select>
            </div>

            <div className="flex-1 max-w-[439px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={tempFilters.range}
                onChange={(e) => setTempFilters({ ...tempFilters, range: e.target.value })}
                className="w-full h-[37px] px-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option>All Time</option>
                <option value="1m">Last Month</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <button
              onClick={handleApplyFilters}
              className="h-9 px-6 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-[17px] font-semibold text-gray-900">Transaction History</h2>
            <p className="text-xs text-gray-600">{data.count} transactions found</p>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-700 uppercase">Contract ID</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-700 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.contracts.map((contract) => (
                  <tr key={contract.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-xs font-medium text-gray-900">#{contract.id}</td>
                    <td className="px-6 py-4 text-xs text-gray-700">{contract.project_title}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-900">${Number(contract.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={contract.status} /></td>
                    <td className="px-6 py-4 text-xs text-gray-600">{formatDateDMY(contract.client_signed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              disabled={!data.previous}
              onClick={() => setActiveFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              className="px-4 py-2 text-xs font-medium bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-gray-600">Page {activeFilters.page}</span>
            <button
              disabled={!data.next}
              onClick={() => setActiveFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              className="px-4 py-2 text-xs font-medium bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}