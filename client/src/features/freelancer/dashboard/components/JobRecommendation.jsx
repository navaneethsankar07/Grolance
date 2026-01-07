import React from 'react'
import { useRecommendedProjects } from '../dashboardQueries'

function JobRecommendation() {
    const {data, isLoading} = useRecommendedProjects();
    const jobList = data?.results || []
    console.log(jobList);
  
    return (
    <div>
            <h2 className="text-[25px] font-semibold text-[#111827] leading-7 mb-4" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
              Recommended Jobs
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {jobList.map((job, index) => (
                <div key={index} className="bg-white rounded-xl border border-[#F3F4F6] shadow-sm">
                  <div className="p-8 pb-6">
                    <span className="inline-block bg-[#F9FAFB] text-primary  px-3 py-1 rounded-full text-[12px] font-medium mb-4" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {job.category}
                    </span>
                    <h3 className="text-[20px] font-semibold text-[#111827] leading-[25px] mb-2" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {job.title}
                    </h3>
                    <p className="text-sm text-[#4B5563] leading-[22px] mb-6" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {job.description}
                    </p>
                    <div className="flex items-end justify-between pb-6 border-b border-[#F3F4F6]">
                      <div>
                        <p className="text-[14px] text-black mb-1" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>Budget</p>
                        <p className="text-sm font-semibold text-[#6B7280]" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>{job.budget}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] text-black mb-1" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>Delivery</p>
                        <p className="text-sm font-medium text-[#374151]" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>{job.delivery_days}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="bg-[#F9FAFB] text-primary px-3 py-1 rounded-full text-[12px] font-normal" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="text-sm font-medium text-primary hover:underline mt-6" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  )
}

export default JobRecommendation