import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProjectDetails } from './jobDetailsQueries';
import { useModal } from '../../../hooks/modal/useModalStore';
import { 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  Star,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useProjectDetails(id);
  const { openModal } = useModal();

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium animate-pulse">Retrieving project specifications...</p>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-bold">Error: {error.message}</p>
      </div>
    </div>
  );

  const formatList = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== "");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans overflow-x-hidden">
      <div className="h-1 bg-primary w-full" />

      <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          <div className="w-full lg:w-2/3 space-y-6 md:space-y-8 min-w-0">
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm break-words overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Verified Project Listing</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                {data.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-8">
                {data.skills?.map((skill, index) => (
                  <span key={index} className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 md:px-4 rounded-xl text-xs font-bold transition-all hover:bg-white hover:border-primary/30 break-words">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="h-px bg-slate-100 w-full my-6 md:my-8" />

              <section className="mb-10 md:mb-12">
                <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">About This Project</h2>
                <div className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap break-words">
                  {data.description}
                </div>
              </section>

              <section className="mb-10 md:mb-12">
                <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">What You'll Deliver</h2>
                <div className="grid grid-cols-1 gap-3">
                  {formatList(data.expected_deliverables).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 md:gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-blue-100">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium leading-normal break-words overflow-hidden">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">Requirements</h2>
                <ul className="space-y-4">
                  {formatList(data.requirements).map((item, index) => (
                    <li key={index} className="flex items-start gap-3 md:gap-4 text-slate-600 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="text-sm md:text-base font-medium leading-relaxed break-words overflow-hidden">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-8 min-w-0">
            
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Snapshot</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-primary shrink-0">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total Budget</p>
                    <p className="text-lg md:text-xl font-black text-slate-900 truncate">
                      {data.pricing_type === 'fixed' ? `$${data.fixed_price}` : `$${data.min_budget} - $${data.max_budget}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Timeline</p>
                    <p className="text-base md:text-lg font-bold text-slate-900 truncate">{data.delivery_days} Working Days</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Contract Type</p>
                    <p className="text-base md:text-lg font-bold text-slate-900 capitalize truncate">{data.pricing_type} Model</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {data?.is_applied ? (
                  <Link to='/freelancer/my-proposals/' className="flex justify-center w-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-black py-4 rounded-xl md:rounded-2xl transition-all text-[10px] md:text-xs uppercase tracking-widest text-center">
                    Review Submitted Proposal
                  </Link>
                ) : (
                  <button onClick={() => openModal('job-proposal', id)} className="w-full bg-primary hover:bg-blue-600 text-white font-black py-4 rounded-xl md:rounded-2xl transition-all shadow-xl shadow-blue-100 text-[10px] md:text-xs uppercase tracking-widest active:scale-[0.98]">
                    Initiate Application
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden min-w-0">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Partner Profile</h3>
              
              <div className="flex items-center gap-4 mb-6 min-w-0">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl md:text-2xl overflow-hidden border border-slate-200 shrink-0">
                  {data.client_info?.profile_photo ? (
                    <img src={data.client_info.profile_photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    data.client_info?.full_name?.charAt(0) || "C"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-base md:text-lg text-slate-900 leading-tight truncate">{data.client_info?.full_name}</p>
                  <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500 truncate">Since {data.client_info?.member_since}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 mb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-black text-slate-900">4.8</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Client Rating</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-slate-900">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-black">{data.client_info?.total_jobs_posted}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Jobs Posted</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}