import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectDetails } from './projectQueries';
import { Edit, Users, Clock, Box, IndianRupee, FileText, ChevronLeft } from 'lucide-react';

export default function ClientJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useProjectDetails(id);

  const isProjectInProgress = data?.status === "in_progress" || data?.status === "in-progress" || data?.status === 'completed';

  if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-600 font-medium">Loading Project details...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500 font-medium">Error: {error.message}</div>;

  const formatList = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== "");
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="bg-white border-b border-gray-100 mb-6 md:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <button 
            onClick={() => navigate('/my-projects')}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Projects
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider ${
                  isProjectInProgress ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {data.status === 'in_progress' ? 'In Progress' : data.status}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{data.category_name || 'General'}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
                {data.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-2/3 space-y-8 md:space-y-10">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Project Description
              </h2>
              <p className="text-sm md:text-base wrap-break-word text-gray-600 leading-relaxed whitespace-pre-wrap">
                {data.description}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg md:text-xl font-black text-gray-900 mb-5">Deliverables</h2>
                <ul className="space-y-4">
                  {formatList(data.expected_deliverables).map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm md:text-base text-gray-600 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className='wrap-anywhere'>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg md:text-xl font-black text-gray-900 mb-5">Requirements</h2>
                <ul className="space-y-4">
                  {formatList(data.requirements).map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm md:text-base text-gray-600 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className='wrap-anywhere'>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {data.skills?.map((skill, index) => (
                  <span key={index} className="bg-gray-50 border border-gray-100 text-gray-600 px-4 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all hover:bg-white hover:border-blue-200 hover:text-blue-600">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm sticky top-8">
              <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider text-[10px]">Project Overview</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</p>
                      <p className="font-bold text-gray-900 md:text-lg">
                        {data.pricing_type === 'fixed' ? `₹${data.fixed_price}` : `₹${data.min_budget} - ₹${data.max_budget}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</p>
                      <p className="font-bold text-gray-900 md:text-lg">{data.delivery_days} Days</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Type</p>
                      <p className="font-bold text-gray-900 md:text-lg capitalize">{data.pricing_type || 'Fixed'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex flex-col gap-3">
                  {isProjectInProgress ? (
                    <button 
                      onClick={() => navigate(`/contracts/${data.contract_id}`)}
                      className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
                    >
                      <FileText className="w-5 h-5" />
                      View Contract
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => navigate(`/my-projects/${id}/proposals`)}
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
                      >
                        <Users className="w-5 h-5" />
                        View Proposals
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/my-projects/${id}/edit`)}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
                      >
                        <Edit className="w-5 h-5" />
                        Edit Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}