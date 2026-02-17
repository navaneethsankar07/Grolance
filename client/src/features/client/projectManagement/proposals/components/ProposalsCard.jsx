import React, { useState } from 'react';
import { X, CheckCircle2, Trash2, AlertTriangle, Star } from 'lucide-react'; 
import { useModal } from '../../../../../hooks/modal/useModalStore';
import { Link, useNavigate } from 'react-router-dom';



export default function ProposalCard({ freelancer, proposal, isInvitation = false, invitationStatus = 'pending', anyOfferMade, onReject, isRejecting }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const { openModal } = useModal();
  const navigate = useNavigate();
  
  const contract = proposal.contract_info;
  const isHiredFreelancer = contract?.is_this_freelancer;
  const isRejected = invitationStatus === 'rejected';
  
  const MAX_LENGTH = 180; 
  const isLongMessage = proposal.description?.length > MAX_LENGTH;
  const displayDescription = isLongMessage 
    ? `${proposal.description.substring(0, MAX_LENGTH)}...` 
    : proposal.description;

  const FreelancerAvatar = ({ size = "h-12 w-12", textSize = "text-xl" }) => (
    <>
      {freelancer?.image ? (
        <img 
          src={freelancer.image} 
          referrerPolicy="no-referrer" 
          className={`${size} rounded-full object-cover bg-gray-100 shadow-sm`} 
          alt={freelancer.name} 
        />
      ) : (
        <div className={`${size} rounded-full bg-primary flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
          {freelancer?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
    </>
  );

  const handleHire = () => {
    openModal('contract-offer', {
      projectName: proposal.title,
      freelancerName: freelancer.name,
      amount: proposal.bidAmount, 
      projectId: proposal.projectId,
      freelancerId: freelancer.id
    });
  };

  const FullProposalModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">Full Proposal</h3>
          <button onClick={() => setIsModalOpen(false)} className="rounded-full p-1 hover:bg-gray-100 transition">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
             <FreelancerAvatar size="h-14 w-14" textSize="text-2xl" />
             <div>
                <Link to={`/find-talents/${freelancer.id}`}>
                <p className="font-bold text-gray-900 hover:text-primary">{freelancer.name}</p>
                <p className="text-sm text-gray-500">{freelancer.title}</p>
                </Link>
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

  const RejectConfirmModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900">Reject Proposal?</h3>
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to reject <strong>{freelancer.name}'s</strong> proposal? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            disabled={isRejecting}
            onClick={() => setShowConfirmReject(false)} 
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            disabled={isRejecting}
            onClick={() => {
              onReject();
              setShowConfirmReject(false);
            }} 
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            {isRejecting ? "Rejecting..." : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );

  if (isInvitation) {
    const statusConfig = {
      pending: { bg: "bg-yellow-500", text: "Invitation Pending" },
      accepted: { bg: "bg-green-600", text: "Invitation Accepted" },
      declined: { bg: "bg-red-500", text: "Invitation Declined" },
      hired: { bg: "bg-blue-600", text: "Hired" },
    };
    const currentStatus = statusConfig[invitationStatus] || statusConfig.pending;

    return (
      <div className={`relative rounded-lg border px-6 pb-6 pt-[25px] shadow-sm transition-all ${isHiredFreelancer ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}>
        {isModalOpen && <FullProposalModal />}
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center rounded-full ${currentStatus.bg} px-3 py-1.5 text-xs font-medium text-white`}>
            {currentStatus.text}
          </span>
          
          {isHiredFreelancer ? (
            <button 
              onClick={() => navigate(`/contracts/${contract.id}`)}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              View Contract
            </button>
          ) : (
            invitationStatus === 'accepted' && (
              <button 
                onClick={handleHire}
                disabled={anyOfferMade}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition ${
                  anyOfferMade 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {anyOfferMade ? "Offer already out" : "Hire Now"}
              </button>
            )
          )}
        </div>

        <div className="flex items-start gap-4">
          <FreelancerAvatar size="h-16 w-16" textSize="text-2xl" />
          <div className="flex min-w-0 flex-col gap-1">
            <Link to={`/find-talents/${freelancer.id}`}>
              <h3 className="text-[15px] font-semibold text-gray-900 hover:text-primary">{freelancer.name}</h3>
              <p className="text-xs font-medium text-gray-600 hover:text-primary">{freelancer.title}</p>
            </Link>
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

  return (
    <div className={`rounded-xl border p-6 shadow-sm transition-all ${isRejected ? 'opacity-60 bg-gray-50 grayscale-[0.5]' : ''} ${isHiredFreelancer ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}>
      {isModalOpen && <FullProposalModal />}
      {showConfirmReject && <RejectConfirmModal />}
      
      {isHiredFreelancer && (
        <div className="mb-4 flex items-center gap-2 text-blue-700">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            {contract?.status === 'active' ? 'Currently Hired' : 'Pending Offer'}
          </span>
        </div>
      )}

      {isRejected && (
        <div className="mb-4 flex items-center gap-2 text-red-600">
          <X size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex gap-4">
          <FreelancerAvatar size="h-[100px] w-[100px]" textSize="text-4xl" />
          <div className="flex flex-col gap-1">
            <Link to={`/find-talents/${freelancer.id}` }>
            <h3 className="text-lg font-bold text-gray-900 hover:text-primary">{freelancer.name}</h3>
            <p className="text-sm text-gray-500 hover:text-primary">{freelancer.title}</p>
            </Link>
            <div className="flex items-center gap-1 pt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
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
        {!isHiredFreelancer && !isRejected && (
          <button 
            onClick={() => setShowConfirmReject(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            <Trash2 size={16} />
            Reject
          </button>
        )}

        {isHiredFreelancer ? (
          <button 
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md"
          >
            View Contract
          </button>
        ) : (
          !isRejected && (
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
          )
        )}
      </div>
    </div>
  );
}