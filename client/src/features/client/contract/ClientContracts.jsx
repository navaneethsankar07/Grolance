import React, { useState } from 'react';
import { 
  MessageSquare, 
  ExternalLink, 
  Clock, 
  Package, 
  Hash, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Search,
  ArrowUpRight,
  User,
  CreditCard,
  Filter,
  Calendar,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMyContracts } from '../../freelancer/contracts/contractsQueries';
import { useChatActions } from '../../../components/chat/chatMutations';
import { useModal } from "../../../hooks/modal/useModalStore";
import { toast } from "react-toastify";
import { formatDateDMY } from '../../../utils/date';

export default function ClientContracts() {
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const navigate = useNavigate();
  const { getRoomMutation } = useChatActions();
  const { openModal } = useModal();

  const { data, isLoading } = useMyContracts({ 
    status: activeTab, 
    page: page,
    role: 'client',
    search: search 
  });

  const tabs = ['All', 'In Progress', 'Submitted', 'Completed', 'Disputed'];

  const handleSearchTrigger = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchTrigger();
    }
  };

  const handleMessageFreelancer = async (freelancerId) => {
    try {
      const room = await getRoomMutation.mutateAsync(freelancerId);
      openModal("messages", { initialRoomId: room.id });
    } catch (error) {
      toast.error("Could not open chat room.");
    }
  };

  const calculateDeadline = (signedAt, deliveryDays) => {
    if (!signedAt) return "Pending Signature";
    const date = new Date(signedAt);
    date.setDate(date.getDate() + (Number(deliveryDays) || 0));
    return formatDateDMY(date.toISOString());
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Initializing Registry</p>
      </div>
    </div>
  );

  const contractList = data?.results || [];
  const totalCount = data?.count || 0;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <div className="bg-white border-b py-10 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center  mb-2">
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">Contracts</h1>
              <p className="text-lg text-slate-500 pl-2 mt-1 font-medium">Total: {totalCount} agreements.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search project or ID..." 
                  className="pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-full sm:w-80 transition-all"
                />
                {searchInput && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                )}
              </div>
              <button 
                onClick={handleSearchTrigger}
                className="bg-primary text-white p-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-primary text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {contractList.length > 0 ? (
            contractList.map((contract) => (
              <div key={contract.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                <div className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-2/3 p-8 border-r border-slate-100">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{contract.project_title}</h2>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Contractor: <span className="text-slate-900">{contract.freelancer_name}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Hash className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Ref: #ORD-{contract.id + 8000}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.1em] border ${
                          contract.status === 'active'
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : contract.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {contract.status || 'Execution Phase'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-6 bg-slate-50/50 rounded-xl px-6 border border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Package className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Selected Package</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 uppercase">{contract.package_name || 'Standard Pro'}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Due Date</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900">
                            {calculateDeadline(contract.freelancer_signed_at, contract.delivery_days)}
                          </p>
                        </div>
                        <div className="space-y-1 hidden md:block">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Deliver In </span>
                          </div>
                          <p className="text-sm font-bold text-slate-900">{contract.delivery_days || 0} Working Days</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-1/3 p-8 bg-slate-50/30 flex flex-col justify-between gap-8">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contract Valuation</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-slate-600">$</span>
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">
                            {Number(contract.total_amount).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => navigate(`/contracts/${contract.id}`)}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2563eb] transition-all shadow-lg shadow-slate-200 hover:shadow-blue-100"
                        >
                          Workspace Console
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMessageFreelancer(contract.freelancer_id)}
                          disabled={getRoomMutation.isPending}
                          className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {getRoomMutation.isPending ? "Connecting..." : "Open Channel"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl py-32 text-center border-2 border-dashed border-slate-200">
              <div className="max-w-xs mx-auto">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Records Found</h3>
                <p className="text-sm text-slate-400 font-medium">Try adjusting your search or filters.</p>
              </div>
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-2">
            <p className="text-sm text-gray-600">
              Showing {contractList.length} of {totalCount} results
            </p>
            <nav className="flex items-center rounded-md shadow-sm">
              <button 
                disabled={!data?.previous}
                onClick={() => setPage(p => p - 1)}
                className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="text-gray-400 w-5 h-5" />
              </button>
              <div className="h-9 px-4 bg-blue-600 text-white text-sm font-semibold flex items-center border-t border-b border-blue-600">
                {page}
              </div>
              <button 
                disabled={!data?.next}
                onClick={() => setPage(p => p + 1)}
                className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="text-gray-400 w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}