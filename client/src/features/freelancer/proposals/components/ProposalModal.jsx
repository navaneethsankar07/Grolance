import React, { useState } from 'react';
import { CheckCircle2, Clock, ShieldCheck, X, Zap } from 'lucide-react';
import { useFreelancerProfile } from '../../profile/profileQueries';
import { useSubmitProposal } from './proposalsMutation';
import { toast } from 'react-toastify';

const PackageCard = ({ type, data, isSelected, onClick }) => {
  if (!data) return null;
  

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
        isSelected
          ? 'border-primary bg-white shadow-xl shadow-primary/10'
          : 'border-transparent bg-slate-200/50 hover:bg-slate-200'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-black uppercase tracking-tighter ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
          {type === 'starter' ? 'Starter' : 'Pro'} Package
        </span>
        <div className="flex items-center gap-1 text-slate-900 font-black">
          <Clock className="w-3 h-3 text-primary" />
          <span className="text-[11px]">{data.delivery_days} Days</span>
        </div>
      </div>
      <div className="text-xl font-black text-slate-900 mb-3">${data.price.toLocaleString()}</div>
      
      <ul className="grid grid-cols-1 gap-y-1">
        {data.description.map((line, i) => (
          <li key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
            <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-primary' : 'text-slate-300'}`} />
            {line}
          </li>
        ))}
      </ul>
    </button>
  );
};

export function ProposalModal({ onClose, projectId }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('starter');
  
  const { data: profile, isLoading } = useFreelancerProfile();
  const { mutate, isPending } = useSubmitProposal();

  if (isLoading) return <div className="text-center p-10 font-bold">Loading Profile...</div>;
  if (!profile || !profile.packages) return <div className="text-center p-10 text-red-500">Please setup your packages first.</div>;

  const currentPkgData = profile.packages[selectedPackage];
  
console.log(currentPkgData.id);

  const handleSubmit = () => {
    if (!coverLetter.trim()) {
      return toast.error("Please write a cover letter");
    }
    const proposalData = {
      project: projectId, 
      package: currentPkgData.id, 
      cover_letter: coverLetter,
    };

    mutate(proposalData, {
      onSuccess: () => {
        onClose(); 
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
        
        <div className="flex-1 p-10 lg:p-12">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Submit Proposal
            </h1>
            <p className="text-slate-500 font-medium italic">
              Tell the client how you will approach their project.
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">
              Your Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you're the perfect fit..."
              className="w-full h-[420px] px-6 py-5 border-2 border-slate-100 rounded-2xl text-slate-700 leading-relaxed  focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none bg-slate-50/30"
            />
          </div>
        </div>

        <div className="w-full lg:w-[420px] bg-slate-50 p-10 lg:p-12 flex flex-col border-l border-slate-100 relative">
          
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6">
            Select Your Package
          </h2>
          
          <div className="space-y-4 mb-8">
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

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Project Amount</span>
              <span className="text-slate-900">${currentPkgData.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Service Fee (10%)</span>
              <span className="text-red-500">-${(currentPkgData.price * 0.1).toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex justify-between text-sm font-black text-slate-900 uppercase">
              <span>You'll Receive</span>
              <span className="text-green-600 font-extrabold">${(currentPkgData.price * 0.9).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 h-14 text-sm font-bold text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-[2] h-14 text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {isPending ? 'Sending...' : 'Send Proposal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}