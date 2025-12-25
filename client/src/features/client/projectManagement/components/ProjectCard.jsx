import React from "react";

const getStatusBadge = (status) => {
  const badges = {
    open: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  );
};

export default function ProjectCard({ job }) {
  // Format budget based on backend pricing_type
  const displayBudget = job.pricing_type === "fixed" 
    ? `₹${job.fixed_price}` 
    : `₹${job.min_budget} - ₹${job.max_budget}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="flex-1">
        <div className="flex items-center flex-wrap gap-2 md:gap-4 mb-2">
          {getStatusBadge(job.status)}
          <span className="text-sm text-gray-500">
            {new Date(job.created_at).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{job.category_name}</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 leading-7">{job.title}</h2>
        <p className="text-base text-gray-600 mb-3 leading-6 line-clamp-2">{job.description}</p>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="material-icons text-gray-600 text-xl">currency_rupee</span>
            <span className="text-sm text-gray-600 font-medium">{displayBudget}</span>
            <span className="text-sm text-gray-400 ml-1">
              ({job.pricing_type === 'fixed' ? 'Fixed Price' : 'Range'})
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="material-icons text-gray-600 text-xl">work_outline</span>
            <span className="text-sm text-gray-600">{job.delivery_days} Days Delivery</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skills?.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3 w-full md:w-[160px]">
        {job.status === "open" && (
          <>
            <button className="h-11 px-4 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors">
              View Proposals
            </button>
            <button className="h-11 px-4 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50">
              Edit Post
            </button>
          </>
        )}
        {job.status !== "open" && (
          <button className="h-11 px-4 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600">
            View Contract
          </button>
        )}
      </div>
    </div>
  );
}