import React from "react";
// Import icons to replace the text spans
import { IndianRupee, ClipboardList, Clock } from "lucide-react";

export default function ProjectCard({ job }) {
  const renderBudget = () => {
    // Ensure we handle potential null/undefined from backend to avoid NaN
    const fixed = job.fixed_price ? Number(job.fixed_price).toLocaleString() : "0";
    const min = job.min_budget ? Number(job.min_budget).toLocaleString() : "0";
    const max = job.max_budget ? Number(job.max_budget).toLocaleString() : "0";

    if (job.pricing_type === "fixed") {
      return (
        <span className="text-sm text-gray-600 font-medium">
          ₹{fixed}
        </span>
      );
    } else {
      return (
        <span className="text-sm text-gray-600 font-medium">
          ₹{min} - ₹{max}
        </span>
      );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="flex-1">
        <div className="flex items-center flex-wrap gap-2 md:gap-4 mb-2">
          {/* Status Badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
            {job.status}
          </span>
          <span className="text-sm text-gray-500">
            Posted {new Date(job.created_at).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{job.category_name}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 leading-7 capitalize">
          {job.title}
        </h2>

        {/* Description */}
        <p className="text-base text-gray-600 mb-3 leading-6 line-clamp-2">
          {job.description}
        </p>

        {/* Budget and Details */}
        <div className="flex items-center flex-wrap gap-6 pt-2">
          {/* Budget Icon and Amount */}
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-gray-500" />
            {renderBudget()}
            <span className="text-sm text-gray-400 ml-1">
              {job.pricing_type === "fixed" ? "Fixed Price" : "Range"}
            </span>
          </div>

          {/* Proposals Icon */}
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">0 Proposals</span>
          </div>

          {/* Schedule Icon (Only if relevant) */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{job.delivery_days} Days</span>
          </div>
        </div>
      </div>

      {/* Buttons matching original design */}
      <div className="flex flex-col justify-center gap-3 w-full md:w-[160px]">
        <button className="h-11 px-4 bg-[#3b82f6] text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow-sm">
          View Proposals
        </button>
        <button className="h-11 px-4 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm">
          Edit Post
        </button>
      </div>
    </div>
  );
}