import React from 'react';

const StarIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <path d="M5.89967 13.2167L7.99967 11.95L10.0997 13.2333L9.54967 10.8333L11.3997 9.23333L8.96634 9.01667L7.99967 6.75L7.03301 9L4.59967 9.21667L6.44967 10.8333L5.89967 13.2167ZM3.88301 16L4.96634 11.3167L1.33301 8.16667L6.13301 7.75L7.99967 3.33333L9.86634 7.75L14.6663 8.16667L11.033 11.3167L12.1163 16L7.99967 13.5167L3.88301 16Z" fill="#EAB308"/>
  </svg>
);

export default function ProposalCard({ freelancer, proposal, isInvitation = false, invitationStatus = 'pending' }) {
  
  // 1. UI for Sent Invitations (Pending, Accepted, or Declined)
  if (isInvitation) {
    const statusConfig = {
      pending: { bg: "bg-yellow-500", text: "Invitation Pending", showHire: false },
      accepted: { bg: "bg-green-600", text: "Invitation Accepted", showHire: true },
      declined: { bg: "bg-red-500", text: "Invitation Declined", showHire: false },
    };

    const currentStatus = statusConfig[invitationStatus] || statusConfig.pending;

    return (
      <div className="relative rounded-lg border border-gray-200 bg-white px-6 pb-6 pt-[25px] shadow-sm">
        <div className="mb-4">
          <span className={`inline-flex items-center rounded-full ${currentStatus.bg} px-3 py-1.5 text-xs font-medium text-white`}>
            {currentStatus.text}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex flex-1 gap-4">
            <img src={freelancer.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-full object-cover bg-gray-100" />
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="text-[15px] font-semibold text-gray-900">{freelancer.name}</h3>
              <p className="text-xs font-medium text-gray-600">{freelancer.title}</p>
              <p className="text-xs text-gray-500 italic mt-1">"{proposal.description}"</p>
            </div>
          </div>
          
          {currentStatus.showHire && (
            <button className="hidden lg:block shrink-0 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 transition">
              Hire Freelancer
            </button>
          )}

          {invitationStatus === 'pending' && (
            <button className="hidden lg:block shrink-0 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-400 cursor-not-allowed">
              Awaiting Response
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Standard Proposal UI (Freelancers who applied directly)
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex gap-4">
          <img src={freelancer.image} alt="" className="h-[100px] w-[100px] flex-shrink-0 rounded-full object-cover bg-gray-100" />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-gray-900">{freelancer.name}</h3>
            <p className="text-sm text-gray-500">{freelancer.title}</p>
            <div className="flex items-center gap-1 pt-1">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              <span className="ml-1 text-sm font-medium text-gray-700">{freelancer.rating}</span>
            </div>
            <p className="text-sm text-gray-500">{freelancer.location}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
            <h4 className="text-base font-semibold text-gray-900">{proposal.title}</h4>
            <div className="flex gap-4">
              <div className="lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bid Amount</p>
                <p className="text-base font-semibold text-gray-900">{proposal.bidAmount}</p>
              </div>
              <div className="lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Delivery</p>
                <p className="text-base font-semibold text-gray-900">{proposal.deliveryDays} Days</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{proposal.description}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t pt-6">
        <button className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          Shortlist
        </button>
        <button className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600 transition">
          Hire Freelancer
        </button>
      </div>
    </div>
  );
}