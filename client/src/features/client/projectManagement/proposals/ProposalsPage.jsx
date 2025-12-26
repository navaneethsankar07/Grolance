import React, { useState } from "react";
import ProjectHeader from "./components/ProposalHeader";
import ProposalCard from "./components/ProposalsCard";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProjectDetails } from "../projectQueries";

export default function ProposalsIndex() {
  const [currentPage, setCurrentPage] = useState(1);
  const {id} = useParams()
  const {data:project, isLoading} = useProjectDetails(id)

    if (isLoading) return <div className="p-10 text-center">Loading Header...</div>;
  const displayBudget = project?.pricing_type === "fixed" 
    ? `₹${Number(project.fixed_price).toLocaleString()}` 
    : `₹${Number(project.min_budget).toLocaleString()} - ₹${Number(project.max_budget).toLocaleString()}`;


  const proposals = [
    {
      id: 1,
      freelancer: {
        name: "Alex Thompson",
        title: "Web Developer",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/6469b482a3e7342a7317b59a10dbf68481c63fb6?width=128",
        rating: 4.8,
        location: "United States"
      },
      proposal: {
        title: "Full-stack E-commerce Solution",
        description: "Full-stack developer specializing in React and Node.js with 8+ years of experience building scalable web applications",
        bidAmount: "₹50,000",
        deliveryDays: 15
      },
      hasAcceptedInvitation: true
    },
    {
      id: 2,
      freelancer: {
        name: "Michael Chen",
        title: "Full Stack Developer",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/84bfb4a56b6fd40e8a0d77b5f4591afd4976c409?width=212",
        rating: 4.2,
        location: "Canada"
      },
      proposal: {
        title: "React & Node.js E-commerce Specialist",
        description: "I understand you need a robust solution. My approach involves building a scalable architecture using the MERN stack. I have previously worked on similar projects for retail clients...",
        bidAmount: "₹48,000",
        deliveryDays: 20
      }
    },
    {
      id: 3,
      freelancer: {
        name: "David Ross",
        title: "Shopify Expert",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/84bfb4a56b6fd40e8a0d77b5f4591afd4976c409?width=212",
        rating: 5.0,
        location: "Australia"
      },
      proposal: {
        title: "Custom Shopify Theme Development",
        description: "Specializing in Shopify, I can create a custom theme that is not only visually stunning but also optimized for speed and conversion. I will ensure your store stands out...",
        bidAmount: "₹60,000",
        deliveryDays: 10
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 font-inter">Proposals Received</h1>
          <p className="mt-1 text-base text-gray-500 font-roboto">
            Review all proposals submitted by freelancers for this project.
          </p>
        </div>

        <div className="mb-8">
          <ProjectHeader 
            title={project?.title}
            budget={displayBudget}
            proposalCount={0}
            postedTime={`Posted ${new Date(project?.created_at).toLocaleDateString()}`}
          />
        </div>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            <button className="border-b-2 border-blue-500 px-1 py-4 text-sm font-semibold text-blue-600">
              All Proposals ({2})
            </button>
            <button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all">
              Shortlisted
            </button>
            <button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all">
              Archived
            </button>
          </div>
        </div>

        <div className="mb-8 space-y-6">
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                freelancer={proposal.freelancer}
                proposal={proposal.proposal}
                hasAcceptedInvitation={proposal.hasAcceptedInvitation}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No proposals received yet.</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600 font-roboto">
            Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">12</span> results
          </p>

          <div className="inline-flex rounded-md shadow-sm">
            <button className="inline-flex h-10 items-center rounded-l-md border border-gray-300 bg-white px-3 text-gray-400 hover:bg-gray-50 transition">
              <ChevronLeftIcon />
            </button>

            <button className="inline-flex h-10 min-w-[44px] items-center justify-center border-y border-gray-300 bg-blue-500 px-4 text-sm font-semibold text-white">
              1
            </button>
            <button className="inline-flex h-10 min-w-[44px] items-center justify-center border-y border-r border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
              2
            </button>
            <button className="inline-flex h-10 min-w-[44px] items-center justify-center border-y border-r border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
              3
            </button>
            <button className="inline-flex h-10 min-w-[44px] items-center justify-center border-y border-r border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
              4
            </button>

            <button className="inline-flex h-10 items-center rounded-r-md border border-r border-gray-300 bg-white px-3 text-gray-400 hover:bg-gray-50 transition">
              <ChevronRightIcon />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}