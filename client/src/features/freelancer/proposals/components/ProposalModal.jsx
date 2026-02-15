import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ShieldCheck, X, Zap, SendHorizontal, Info } from 'lucide-react';
import { useFreelancerProfile } from '../../profile/profileQueries';
import { useSubmitProposal } from './proposalsMutation';
import { toast } from 'react-toastify';
import { fetchPlatformFee } from './proposalApi';

const PackageCard = ({ type, data, isSelected, onClick }) => {
  if (!data) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
        isSelected
          ? 'border-primary bg-white shadow-lg shadow-primary/5'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg z-10">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
            {type === 'starter' ? 'Standard' : 'Premium'} Tier
          </span>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            ${data.price.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">{data.delivery_days} Days</span>
        </div>
      </div>
      
      <ul className="space-y-1.5">
        {data.description.slice(0, 3).map((line, i) => (
          <li key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase leading-tight">
            <CheckCircle2 className={`w-3 h-3 shrink-0 ${isSelected ? 'text-primary' : 'text-slate-300'}`} />
            <span className="truncate">{line}</span>
          </li>
        ))}
      </ul>
    </button>
  );
};

export function ProposalModal({ onClose, projectId }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [feePercentage, setFeePercentage] = useState(10);
  const { data: profile, isLoading } = useFreelancerProfile();
  const { mutate, isPending } = useSubmitProposal();

useEffect(() => {
    const getFee = async () => {
      try {
        const fee = await fetchPlatformFee();
        setFeePercentage(Number(fee));
      } catch (error) {
        console.error("Failed to fetch fee:", error);
      }
    };
    getFee();
  }, []);
  if (isLoading) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!profile || !profile.packages) return null;

  const currentPkgData = profile.packages[selectedPackage];

  const handleSubmit = () => {
    if (!coverLetter.trim()) return toast.error("Please write a cover letter");
    
    const proposalData = {
      project: projectId, 
      package: currentPkgData.id, 
      cover_letter: coverLetter,
    };

    mutate(proposalData, { onSuccess: () => onClose() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-0 sm:p-6 lg:p-10">
      <div className="relative w-full max-w-[1100px] bg-white sm:rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row h-full sm:h-auto sm:max-h-[90vh] overflow-hidden transition-all">
        
        <div className="flex lg:hidden items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Proposal</span>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 scrollbar-hide">
          <div className="hidden lg:block mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Project Application</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Submit Proposal
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Highlight your relevant experience and project approach.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Executive Summary / Cover Letter
                </label>
                <span className="text-[10px] font-bold text-slate-400">{coverLetter.length} chars</span>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are the best fit for this role..."
              className="w-full min-h-[250px] lg:min-h-[400px] px-6 py-5 border-2 border-slate-100 rounded-3xl text-slate-700 leading-relaxed focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all resize-none bg-slate-50/50 placeholder:text-slate-300 text-sm md:text-base"
            />
          </div>
        </div>

        <div className="w-full lg:w-[420px] bg-slate-50/80 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 md:p-8 lg:p-12 flex flex-col overflow-y-auto max-h-[50vh] lg:max-h-full">
          
          <button 
            onClick={onClose} 
            className="hidden lg:flex absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Service Level Selection
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <PackageCard 
                    type="starter" 
                    data={profile.packages.starter} 
                    isSelected={selectedPackage === 'starter'} 
                    onClick={() => setSelectedPackage('starter')}
                />
                <PackageCard 
                    type="pro" 
                    data={profile.packages.pro} 
                    isSelected={selectedPackage === 'pro'} 
                    onClick={() => setSelectedPackage('pro')}
                />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Financial Breakdown</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span className="uppercase tracking-tight">Contract Value</span>
                    <span className="text-slate-900">${currentPkgData.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 uppercase tracking-tight">Platform Fee <Info className="w-3 h-3 text-slate-300"/></span>
                    <span className="text-red-500">-${(currentPkgData.price * (feePercentage/100)).toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-50 my-1" />
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Net Earnings</span>
                    <span className="text-xl font-black text-emerald-600">${(currentPkgData.price * 0.9).toLocaleString()}</span>
                </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full h-14 md:h-16 text-[11px] font-black text-white bg-primary rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <SendHorizontal className="w-4 h-4" />
                  Send Proposal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}