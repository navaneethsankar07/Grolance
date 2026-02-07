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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Top Decoration Bar */}
      <div className="h-1 bg-primary w-full" />

      <div className="max-w-6xl mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Verified Project Listing</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
                {data.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-8">
                {data.skills?.map((skill, index) => (
                  <span key={index} className="bg-slate-50 text-slate-600 border border-slate-100 px-4 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-white hover:border-primary/30">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="h-px bg-slate-100 w-full my-8" />

              <section className="mb-12">
                <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">About This Project</h2>
                <div className="text-slate-600 leading-relaxed text-sm lg:text-base whitespace-pre-line">
                  {data.description}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">What You'll Deliver</h2>
                <div className="grid grid-cols-1 gap-3">
                  {formatList(data.expected_deliverables).map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-blue-100">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">Requirements</h2>
                <ul className="space-y-4">
                  {formatList(data.requirements).map((item, index) => (
                    <li key={index} className="flex items-start gap-4 text-slate-600 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="text-sm lg:text-base font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-8">
            
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Snapshot</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total Budget</p>
                    <p className="text-xl font-black text-slate-900">
                      {data.pricing_type === 'fixed' ? `$${data.fixed_price}` : `$${data.min_budget} - $${data.max_budget}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Timeline</p>
                    <p className="text-lg font-bold text-slate-900">{data.delivery_days} Working Days</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Contract Type</p>
                    <p className="text-lg font-bold text-slate-900 capitalize">{data.pricing_type} Model</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {data?.is_applied ? (
                  <Link to='/freelancer/my-proposals/' className="flex justify-center w-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest">
                    Review Submitted Proposal
                  </Link>
                ) : (
                  <button onClick={() => openModal('job-proposal', id)} className="w-full bg-primary hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 text-xs uppercase tracking-widest active:scale-[0.98]">
                    Initiate Application
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-3xl px-8 pt-8 border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 " />
              
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Partner Profile</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl overflow-hidden border border-slate-200">
                    {data.client_info?.profile_photo ? (
                      <img src={data.client_info.profile_photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      data.client_info?.full_name?.charAt(0) || "C"
                    )}
                  </div>
                  <div>
                    <p className="font-black text-lg text-slate-900 leading-tight">{data.client_info?.full_name}</p>
                    <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Since {data.client_info?.member_since}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 mb-6">
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
    </div>
  );
}