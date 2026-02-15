import React, { useState } from 'react';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import { useEligibleProjects, useSendInvitation} from '../findTalentQueries'
import { toast } from 'react-toastify';

export default function InviteFreelancerModal({ isOpen, onClose, modalProps }) {
  const { freelancerId, packages } = modalProps ;
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [message, setMessage] = useState('');

  const { data: projects, isLoading: projectsLoading } = useEligibleProjects(isOpen);
   
    
 const inviteMutation = useSendInvitation({
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
      onClose();
    },
    onError: (error) => {
      const serverError = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          "Failed to send invitation. Please try again.";
      
      toast.error(serverError);
    }

  });
  

const handleSendInvite = () => {
    if (!selectedProjectId || !selectedPackageId) {
      toast.warn("Please select a project and a package");
      return;
    }
    
    inviteMutation.mutate({
      freelancer: parseInt(freelancerId),
      project: parseInt(selectedProjectId),
      package: parseInt(selectedPackageId), 
      message: message
    }, {
      onSuccess: () => {
        onClose();
        setSelectedProjectId('');
        setSelectedPackageId(null);
        setMessage('');
      },
      onError: (error) => {
        const serverError = error.response?.data?.error || 
                            error.response?.data?.detail || 
                            "Failed to send invitation. Please try again.";
        
      }
    });
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[512px] bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
        <div className="p-8 border-b border-gray-50 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Send Invitation</h2>
            <p className="text-sm text-gray-500 mt-1">Select a project to invite this talent.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Choose a Job</label>
            <div className="relative">
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full h-14 pl-5 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
              >
                <option value="">Select a job...</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {projectsLoading && <p className="text-xs text-blue-500 mt-2 animate-pulse font-medium">Loading your projects...</p>}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 block">Select Package</label>
            <div className="grid grid-cols-1 gap-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.package_type}
                  onClick={() => setSelectedPackageId(pkg.id )}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${
                    selectedPackageId === pkg.id 
                    ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-100' 
                    : 'border-gray-50 bg-white hover:border-gray-200'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-gray-900 capitalize">{pkg.package_type} Package</h4>
                    <p className="text-xs text-gray-500 mt-1">{pkg.delivery_days} Days Delivery</p>
                  </div>
                  <span className="text-lg font-black text-blue-600">${pkg.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Optional Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
              placeholder="Tell them why they're a good fit..."
            />
          </div>
        </div>

        <div className="p-8 border-t border-gray-50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSendInvite}
            disabled={inviteMutation.isPending}
            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {inviteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Invitation'}
          </button>
        </div>
      </div>
    </div>
  );
}