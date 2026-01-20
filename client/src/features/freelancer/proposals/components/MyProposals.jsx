import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ProposalCard } from "./ProposalsCard";
import { useMyProposals } from "./proposalsQueries";

export default function MyProposals() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useMyProposals({page,status});
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading proposals. Please try again later.
      </div>
    );
  }

  const proposals = data?.results || data || [];
  const totalCount = data?.count || 0;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  const handleStatusChange = (e)=>{
    setStatus(e.target.value);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1085px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-[31px] font-bold text-gray-900 leading-tight sm:leading-[40px] mb-2">
            My Proposals
          </h1>
          <p className="text-sm text-gray-600">
            Review all the proposals you've submitted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="relative">
              <select 
                value={status} 
                onChange={handleStatusChange}
                className="appearance-none h-[42px] pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button className="flex items-center justify-between gap-4 sm:gap-6 h-[42px] px-4 sm:px-[17px] rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">
                Newest First
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            <span>{proposals.length}</span>
            <span> {proposals.length === 1 ? 'proposal' : 'proposals'}</span>
          </div>
        </div>
<div className="text-xs text-gray-500 mb-5 font-medium">
            <span>Showing {proposals.length} of {totalCount} proposals</span>
          </div>
        
        <div className="space-y-4">
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-400">You haven't submitted any proposals yet.</p>
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center rounded-md border border-gray-300 overflow-hidden shadow-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className="h-9 w-9 flex items-center justify-center border-r border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="h-9 px-4 flex items-center justify-center bg-blue-500 text-white font-semibold text-sm">
                {page}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="h-9 w-9 flex items-center justify-center bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}