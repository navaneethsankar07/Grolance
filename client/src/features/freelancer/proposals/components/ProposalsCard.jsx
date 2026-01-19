import { ArrowRight } from "lucide-react";
import { useModal } from "../../../../hooks/modal/useModalStore";

const statusStyles = {
  accepted: {
    bg: "bg-green-100",
    border: "border-green-200",
    text: "text-green-700",
    label: "Accepted",
  },
  offered: {
    bg: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-700",
    label: "Offered",
  },
  pending: {
    bg: "bg-gray-100",
    border: "border-gray-200",
    text: "text-gray-700",
    label: "Pending",
  },
  rejected: {
    bg: "bg-red-100",
    border: "border-red-200",
    text: "text-red-700",
    label: "Rejected",
  },
};

const RupeeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M4 2H12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 5.33301H12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 8.66699L9.66667 14.0003" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 8.66699H6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8.66667C10.4447 8.66667 10.4447 2 6 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <g clipPath="url(#clip0)">
      <path d="M7.99998 14.6663C11.6819 14.6663 14.6666 11.6816 14.6666 7.99967C14.6666 4.31778 11.6819 1.33301 7.99998 1.33301C4.31808 1.33301 1.33331 4.31778 1.33331 7.99967C1.33331 11.6816 4.31808 14.6663 7.99998 14.6663Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 4V8L10.6667 9.33333" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs><clipPath id="clip0"><rect width="16" height="16" fill="white" /></clipPath></defs>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M5.33333 1.33301V3.99967" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6667 1.33301V3.99967" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6.66699H14" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ProposalCard({ proposal }) {
  const { openModal } = useModal();
  const currentStatus = proposal?.contract_info?.status || proposal.status;
  const statusStyle = statusStyles[currentStatus] || statusStyles.pending;

  const handleViewDetails = () => {
    openModal("my-proposal-details", { proposal });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-8 sm:mb-10">
        <div className="flex-1">
          <h3 className="text-base sm:text-[17px] font-semibold text-gray-900 leading-6 sm:leading-7 mb-1">
            {proposal.project_title}
          </h3>
          <p className="text-xs text-gray-500">
            <span>by </span>
            <span>{proposal.client_name}</span>
          </p>
        </div>
        <span
          className={`px-3 sm:px-[17px] py-2 rounded-full border text-[10px] font-medium whitespace-nowrap sm:ml-4 self-start ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:flex sm:items-start gap-4 sm:gap-6 mb-5 sm:mb-6">
        <div className="flex items-start gap-2">
          <RupeeIcon />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 mb-1">Bid Amount</span>
            <span className="text-sm font-semibold text-gray-900">
              ₹{Number(proposal.bid_amount).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ClockIcon />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 mb-1">Delivery</span>
            <span className="text-sm font-semibold text-gray-900">
              {proposal.delivery_days} days
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CalendarIcon />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 mb-1">Submitted</span>
            <span className="text-sm font-semibold text-gray-900">
              {new Date(proposal.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors group"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}