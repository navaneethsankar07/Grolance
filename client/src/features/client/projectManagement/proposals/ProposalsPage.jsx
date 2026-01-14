import React, { useState } from "react";
import ProjectHeader from "./components/ProposalHeader";
import ProposalCard from "./components/ProposalsCard";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProjectDetails } from "../projectQueries";
import { useProposals, useSentInvitations } from "./proposalsQueries";

export default function ProposalsIndex() {
  const { id } = useParams();
  
  const { data: project, isLoading: isProjectLoading } = useProjectDetails(id);
  const { data: invitationsData, isLoading: isInvitesLoading } = useSentInvitations(id);
  const { data: proposals, isLoading: isProposalsLoading } = useProposals(id);

  if (isProjectLoading || isInvitesLoading || isProposalsLoading) {
    return <div className="p-10 text-center font-inter text-gray-600">Loading data...</div>;
  }

  const invitations = invitationsData?.results || (Array.isArray(invitationsData) ? invitationsData : []);
  const actualProposals = proposals?.results || (Array.isArray(proposals) ? proposals : []);

  const displayBudget = project?.pricing_type === "fixed" 
    ? `₹${Number(project.fixed_price).toLocaleString()}` 
    : `₹${Number(project.min_budget).toLocaleString()} - ₹${Number(project.max_budget).toLocaleString()}`;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <ProjectHeader 
            title={project?.title}
            budget={displayBudget}
            proposalCount={actualProposals.length}
            postedTime={`Posted ${new Date(project?.created_at).toLocaleDateString()}`}
          />
        </div>

        {invitations.length > 0 && (
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
                  freelancer={{
                    name: inv.freelancer_name, 
                    title: inv.freelancer_tagline || "Invited Talent",
                    image: inv.freelancer_image || "https://via.placeholder.com/150",
                  }}
                  proposal={{
                    description: inv.message || "No message.",
                    bidAmount: "N/A"
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            <button className="border-b-2 border-blue-500 px-1 py-4 text-sm font-semibold text-blue-600">
              Direct Proposals ({actualProposals.length})
            </button>
          </div>
        </div>

        <div className="mb-8 space-y-6">
          {actualProposals.length > 0 ? (
            actualProposals.map((prop) => (
              <ProposalCard
                key={prop.id}
                isInvitation={false}
                freelancer={{
                  name: prop.freelancer_name,
                  title: prop.freelancer_tagline || "Freelancer",
                  image: prop.freelancer_photo || "https://via.placeholder.com/150",
                  rating: 4.8, 
                }}
                proposal={{
                  title: "Proposal Details", 
                  description: prop.cover_letter,
                  bidAmount: `₹${Number(prop.bid_amount).toLocaleString()}`,
                  deliveryDays: prop.delivery_days
                }}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-gray-500 font-medium">No proposals found in database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}