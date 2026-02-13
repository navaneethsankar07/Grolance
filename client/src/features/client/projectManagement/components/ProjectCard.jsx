import React from "react";
import { ClipboardList, Clock, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/modal/useModalStore";

export default function ProjectCard({ job }) {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const isProjectInProgress = job.status === "in_progress" || job.status === "in-progress" || job.status === 'completed';
  
  const renderBudget = () => {
    const fixed = job.fixed_price ? Number(job.fixed_price).toLocaleString() : "0";
    const min = job.min_budget ? Number(job.min_budget).toLocaleString() : "0";
    const max = job.max_budget ? Number(job.max_budget).toLocaleString() : "0";

    if (job.pricing_type === "fixed") {
      return <span className="text-sm md:text-base text-gray-900 font-bold">${fixed}</span>;
    } else {
      return <span className="text-sm md:text-base text-gray-900 font-bold">${min} - ${max}</span>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6 hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-y-2 gap-x-3 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${
            isProjectInProgress ? "bg-blue-100 text-[#3b82f6]" : "bg-green-100 text-green-800"
          }`}>
            {job.status === "in_progress" ? "In Progress" : job.status}
          </span>
          <div className="flex items-center text-xs md:text-sm text-gray-500 gap-2">
            <span>{new Date(job.created_at).toLocaleDateString()}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="font-medium text-gray-600">{job.category_name}</span>
          </div>
        </div>

        <h2 
          className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight capitalize cursor-pointer hover:text-[#3b82f6] transition-colors flex items-center justify-between group" 
          onClick={() => navigate(`/my-projects/${job.id}`)}
        >
          <span className="truncate">{job.title}</span>
          <ChevronRight className="w-5 h-5 md:hidden text-gray-400 group-hover:text-[#3b82f6]" />
        </h2>

        <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed line-clamp-2 md:line-clamp-3">
          {job.description}
        </p>

        <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 pt-2 border-t border-gray-50 md:border-none">
          <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1.5">
            {renderBudget()}
            <span className="text-[10px] md:text-sm text-gray-400 font-medium uppercase md:capitalize">
              {job.pricing_type === "fixed" ? "Fixed Price" : "Budget Range"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-50 rounded-md md:bg-transparent md:p-0">
              <ClipboardList className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs md:text-sm text-gray-600 font-medium">{job.proposals_count || 0} Proposals</span>
          </div>

          <div className="flex items-center gap-2 col-span-2 md:col-span-1">
            <div className="p-1.5 bg-gray-50 rounded-md md:bg-transparent md:p-0">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs md:text-sm text-gray-600 font-medium">{job.delivery_days} Days Delivery</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col justify-center gap-2 md:gap-3 w-full md:w-44 pt-4 md:pt-0 border-t md:border-none border-gray-100">
        {isProjectInProgress ? (
          <>
            <button 
              onClick={() => navigate(`/contracts/${job.contract_id || ''}`)} 
              className="flex-1 md:flex-none h-11 px-4 min-h-11 bg-primary shrink-0  text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              View Contract
            </button>
            <button 
              onClick={() => navigate(`/my-projects/${job.id}`)} 
              className="flex-1 md:flex-none min-h-11 h-11 px-4 border border-gray-300 bg-white text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors active:scale-[0.98]"
            >
              Details
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2 w-full">
            <button 
              onClick={() => navigate(`/my-projects/${job.id}/proposals`)} 
              className="col-span-2 md:col-span-1 h-11 px-4 bg-[#3b82f6] text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm active:scale-[0.98]"
            >
              View Proposals
            </button>
            <button 
              onClick={() => navigate(`/my-projects/${job.id}/edit`)} 
              className="h-11 px-4 border border-gray-300 bg-white text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors active:scale-[0.98]"
            >
              Edit
            </button>
            <button 
              onClick={() => openModal('delete-project', { projectId: job.id })} 
              className="h-11 px-4 border border-red-200 bg-white text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors active:scale-[0.98]"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}