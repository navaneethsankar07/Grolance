import React, { useState } from "react";
import ProjectHeader from "./components/ProposalHeader";
import ProposalCard from "./components/ProposalsCard";
import { useParams } from "react-router-dom";
import { useProjectDetails } from "../projectQueries";
import { useProposals, useSentInvitations } from "./proposalsQueries";
import { useRejectProposal } from "./proposalsMutations";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProposalsIndex() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data: project, isLoading: isProjectLoading } = useProjectDetails(id);
  const { data: invitationsData, isLoading: isInvitesLoading } = useSentInvitations(id);
  const { data: proposalsData, isLoading: isProposalsLoading } = useProposals(id, page, status);
  const { mutate: rejectMutation, isPending: isRejecting } = useRejectProposal();

  if (isProjectLoading || isInvitesLoading || isProposalsLoading) {
    return <div className="p-10 text-center font-inter text-gray-600">Loading data...</div>;
  }

  const invitations = invitationsData?.results || (Array.isArray(invitationsData) ? invitationsData : []);
  const actualProposals = proposalsData?.results || [];
  
  const sortedProposals = [...actualProposals].sort((a, b) => {
    if (a.contract_info?.is_this_freelancer) return -1;
    if (b.contract_info?.is_this_freelancer) return 1;
    return 0;
  });

  const anyOfferMade = actualProposals.some(p => p.contract_info !== null);

  const displayBudget = project?.pricing_type === "fixed" 
    ? `$${Number(project.fixed_price).toLocaleString()}` 
    : `$${Number(project.min_budget).toLocaleString()} - $${Number(project.max_budget).toLocaleString()}`;

  const tabs = [
    { label: "All Proposals", value: "", count: project?.proposals_count || actualProposals.length },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <ProjectHeader 
            title={project?.title}
            budget={displayBudget}
            proposalCount={proposalsData?.count || 0}
            postedTime={`Posted ${new Date(project?.created_at).toLocaleDateString()}`}
          />
        </div>

        {invitations.length > 0 && status === "" && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Sent Invitations
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{invitations.length}</span>
            </h2>
            <div className="space-y-4">
              {invitations.map((inv) => (
                <ProposalCard
                  key={inv.id}
                  isInvitation={true}
                  invitationStatus={inv.status}
                  anyOfferMade={anyOfferMade}
                  freelancer={{
                    id: inv.freelancer,
                    name: inv.freelancer_name, 
                    title: inv.freelancer_tagline || "Invited Talent",
                    image: inv.freelancer_image || "https://via.placeholder.com/150",
                  }}
                  proposal={{
                    title: project?.title,       
                    projectId: id,               
                    freelancerId: inv.freelancer_id, 
                    description: inv.message || "No message.",
                    bidAmount: inv.package_amount,
                    contract_info: inv.contract_info
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setStatus(tab.value); setPage(1); }}
                className={`pb-4 text-sm font-semibold transition-all ${
                  status === tab.value 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-6">
          {sortedProposals.length > 0 ? (
            sortedProposals.map((prop) => (
              <ProposalCard
                key={prop.id}
                isInvitation={false}
                invitationStatus={prop.status}
                anyOfferMade={anyOfferMade}
                onReject={() => rejectMutation(prop.id)}
                isRejecting={isRejecting}
                freelancer={{
                  id: prop.freelancer_id,
                  name: prop.freelancer_name,
                  title: prop.freelancer_tagline || "Freelancer",
                  image: prop.freelancer_photo || "https://via.placeholder.com/150",
                  rating: 4.8, 
                }}
                proposal={{
                  title: project?.title,
                  projectId: id,
                  freelancerId: prop.freelancer,
                  description: prop.cover_letter,
                  bidAmount: prop.bid_amount,
                  deliveryDays: prop.delivery_days,
                  contract_info: prop.contract_info
                }}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-gray-500 font-medium">No proposals found for this filter.</p>
            </div>
          )}
        </div>

        {proposalsData?.count > actualProposals.length && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!proposalsData?.previous} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
              <button onClick={() => setPage(p => p + 1)} disabled={!proposalsData?.next} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, proposalsData.count)}</span> of <span className="font-medium">{proposalsData.count}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button onClick={() => setPage(p => p - 1)} disabled={!proposalsData?.previous} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={() => setPage(p => p + 1)} disabled={!proposalsData?.next} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}