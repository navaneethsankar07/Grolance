import React from 'react';
import { CircleDollarSign, Clock, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export default function JobCard({id, category, title, description, priceRange, duration, skills }) {
const handleShare = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/freelancer/jobs/${projectId}`;
    navigator.clipboard.writeText(url);
    toast.success("Project link copied");
  };
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-transparent hover:border-blue-100 transition-all flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-[#F3F4F6] text-[#6B7280] px-4 py-1 rounded-full text-[11px] font-medium">
          {category}
        </span>
        <button onClick={(e)=>handleShare(e,id)} className="p-2.5 bg-[#3B82F6] text-white rounded-md hover:bg-blue-600 transition-colors">
          <Send className="w-4 h-4 fill-current" />
        </button>
      </div>

      <h3 className="text-[18px] font-bold text-[#111827] leading-tight mb-3">
        {title}
      </h3>
      
      <p className="text-[13px] text-[#6B7280] leading-relaxed mb-6 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2 text-[#111827]">
          <CircleDollarSign className="w-4 h-4 text-[#9CA3AF]" />
          <span className="text-[14px] font-bold">{priceRange}</span>
        </div>
        <div className="flex items-center gap-2 text-[#6B7280]">
          <Clock className="w-4 h-4 text-[#9CA3AF]" />
          <span className="text-[13px] font-medium">{duration}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-white text-[#6B7280] px-4 py-1 rounded-md text-[11px] font-medium border border-[#F3F4F6]">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}