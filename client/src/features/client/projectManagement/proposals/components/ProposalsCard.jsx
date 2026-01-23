import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react'; 
import { useModal } from '../../../../../hooks/modal/useModalStore';
import { useNavigate } from 'react-router-dom';

const StarIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <path d="M5.89967 13.2167L7.99967 11.95L10.0997 13.2333L9.54967 10.8333L11.3997 9.23333L8.96634 9.01667L7.99967 6.75L7.03301 9L4.59967 9.21667L6.44967 10.8333L5.89967 13.2167ZM3.88301 16L4.96634 11.3167L1.33301 8.16667L6.13301 7.75L7.99967 3.33333L9.86634 7.75L14.6663 8.16667L11.033 11.3167L12.1163 16L7.99967 13.5167L3.88301 16Z" fill="#EAB308"/>
  </svg>
);

export default function ProposalCard({ freelancer, proposal, isInvitation = false, invitationStatus = 'pending', anyOfferMade }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openModal } = useModal();
  const navigate = useNavigate();
  
  const contract = proposal.contract_info;
  const isHiredFreelancer = contract?.is_this_freelancer;
  
  const MAX_LENGTH = 180; 
  const isLongMessage = proposal.description?.length > MAX_LENGTH;
  const displayDescription = isLongMessage 
    ? `${proposal.description.substring(0, MAX_LENGTH)}...` 
    : proposal.description;

  const handleHire = () => {
    openModal('contract-offer', {
      projectName: proposal.title,
      freelancerName: freelancer.name,
      amount: proposal.bidAmount, 
      projectId: proposal.projectId,
      freelancerId: freelancer.id
    });
  };

  const Modal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">Full Proposal</h3>
          <button onClick={() => setIsModalOpen(false)} className="rounded-full p-1 hover:bg-gray-100 transition">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
             <img src={freelancer.image} referrerPolicy="no-referrer" className="h-12 w-12 rounded-full object-cover" alt="" />
             <div>
                <p className="font-bold text-gray-900">{freelancer.name}</p>
                <p className="text-sm text-gray-500">{freelancer.title}</p>
             </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{proposal.description}</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button onClick={() => setIsModalOpen(false)} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Invitation View Logic
  if (isInvitation) {
    const statusConfig = {
        pending: { bg: "bg-yellow-500", text: "Invitation Pending" },
        accepted: { bg: "bg-green-600", text: "Invitation Accepted" },
        declined: { bg: "bg-red-500", text: "Invitation Declined" },
      };
    const currentStatus = statusConfig[invitationStatus] || statusConfig.pending;

    return (
      <div className="relative rounded-lg border border-gray-200 bg-white px-6 pb-6 pt-[25px] shadow-sm">
        {isModalOpen && <Modal />}
        <div className="mb-4">
          <span className={`inline-flex items-center rounded-full ${currentStatus.bg} px-3 py-1.5 text-xs font-medium text-white`}>
            {currentStatus.text}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <img src={freelancer.image} alt="" referrerPolicy='no-referrer' className="h-16 w-16 shrink-0 rounded-full object-cover bg-gray-100" />
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-[15px] font-semibold text-gray-900">{freelancer.name}</h3>
            <p className="text-xs font-medium text-gray-600">{freelancer.title}</p>
            <div className="mt-1">
              <p className="text-xs text-gray-500 italic">"{displayDescription}"</p>
              {isLongMessage && (
                <button onClick={() => setIsModalOpen(true)} className="ml-1 text-xs font-semibold text-blue-600 hover:underline">
                  Read more
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Proposal View
  return (
    <div className={`rounded-xl border p-6 shadow-sm transition-all ${isHiredFreelancer ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}>
      {isModalOpen && <Modal />}
      
      {isHiredFreelancer && (
        <div className="mb-4 flex items-center gap-2 text-blue-700">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            {contract?.status === 'active' ? 'Currently Hired' : 'Pending Offer'}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex gap-4">
          <img src={freelancer.image} referrerPolicy="no-referrer" alt="" className="h-[100px] w-[100px] shrink-0 rounded-full object-cover bg-gray-100" />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-gray-900">{freelancer.name}</h3>
            <p className="text-sm text-gray-500">{freelancer.title}</p>
            <div className="flex items-center gap-1 pt-1">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              <span className="ml-1 text-sm font-medium text-gray-700">{freelancer.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
            <h4 className="text-base font-semibold text-gray-900">Proposal Details</h4>
            <div className="flex gap-4">
              <div className="lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bid Amount</p>
                <p className="text-base font-semibold text-gray-900">${proposal.bidAmount}</p>
              </div>
              <div className="lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Delivery</p>
                <p className="text-base font-semibold text-gray-900">{proposal.deliveryDays} Days</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 leading-relaxed inline">{displayDescription}</p>
            {isLongMessage && (
              <button onClick={() => setIsModalOpen(true)} className="ml-2 text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2">
                View full proposal
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t pt-6">
        {isHiredFreelancer ? (
          <button 
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md"
          >
            View Contract
          </button>
        ) : (
          <button 
            onClick={handleHire} 
            disabled={anyOfferMade}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              anyOfferMade 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
              : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {anyOfferMade ? "Offer already out" : "Hire Freelancer"}
          </button>
        )}
      </div>
    </div>
  );
}