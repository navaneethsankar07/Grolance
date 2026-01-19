import React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ProposalCard } from "./ProposalsCard";
import { useMyProposals } from "./proposalsQueries";

export default function MyProposals() {
  const { data, isLoading, isError } = useMyProposals();

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
            <button className="flex items-center justify-between gap-4 sm:gap-6 h-[42px] px-4 sm:px-[17px] rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">
                All Status
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

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

        {proposals.length > 0 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center rounded-md border border-gray-300 overflow-hidden shadow-sm">
              <button
                className="h-9 w-9 flex items-center justify-center border-r border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>

              <button className="h-9 px-4 flex items-center justify-center bg-blue-500 text-white font-semibold text-sm border-r border-gray-300">
                1
              </button>

              <button className="h-9 w-9 flex items-center justify-center bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}