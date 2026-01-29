import React from 'react'
import { useRecommendedProjects } from '../dashboardQueries'
import { Briefcase } from 'lucide-react'

function JobRecommendation() {
    const { data, isLoading } = useRecommendedProjects();
    const jobList = data?.results || []

    if (isLoading) {
        return (
            <div className="mb-8">
                <h2 className="text-[25px] font-semibold text-[#111827] leading-7 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Recommended Jobs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl border border-[#F3F4F6]"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mb-8">
            <h2 className="text-[25px] font-semibold text-[#111827] leading-7 mb-4" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Recommended Jobs
            </h2>

            {jobList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobList.map((job, index) => (
                        <div key={job.id || index} className="bg-white rounded-xl border border-[#F3F4F6] shadow-sm flex flex-col h-full">
                            <div className="p-6 md:p-8 flex flex-col h-full">
                                <div className="mb-4">
                                    <span className="inline-block bg-[#F9FAFB] text-primary px-3 py-1 rounded-full text-[12px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {job.category}
                                    </span>
                                </div>
                                
                                <h3 className="text-[18px] md:text-[20px] font-semibold text-[#111827] leading-tight mb-3 line-clamp-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {job.title}
                                </h3>
                                
                                <p className="text-sm text-[#4B5563] leading-[22px] mb-6 line-clamp-3 flex-grow" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {job.description}
                                </p>

                                <div className="flex items-end justify-between pb-6 border-b border-[#F3F4F6]">
                                    <div>
                                        <p className="text-[14px] text-black mb-1 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Budget</p>
                                        <p className="text-sm font-semibold text-[#6B7280]" style={{ fontFamily: 'Inter, sans-serif' }}>{job.budget}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[14px] text-black mb-1 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Delivery</p>
                                        <p className="text-sm font-medium text-[#374151]" style={{ fontFamily: 'Inter, sans-serif' }}>{job.delivery_days} Days</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-6 mb-6">
                                    {job.skills?.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="bg-[#F9FAFB] text-primary px-3 py-1 rounded-full text-[12px] font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {skill}
                                        </span>
                                    ))}
                                    {job.skills?.length > 3 && (
                                        <span className="text-[12px] text-gray-400 self-center">+{job.skills.length - 3}</span>
                                    )}
                                </div>

                                <button className="text-sm font-medium text-primary hover:underline text-left mt-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Briefcase className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-[#6B7280] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        No recommended jobs yet.
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Update your profile skills to get better recommendations.
                    </p>
                </div>
            )}
        </div>
    )
}

export default JobRecommendation