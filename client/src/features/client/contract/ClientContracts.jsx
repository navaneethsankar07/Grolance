import React, { useState } from 'react';
import { 
  MessageSquare, 
  Clock, 
  Package, 
  Hash, 
  ChevronLeft, 
  ChevronRight,
  Search,
  ArrowUpRight,
  User,
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
console.log(data);

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
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Contracts</h1>
              <p className="text-base md:text-lg text-slate-500 mt-1 font-medium">Total: {totalCount} agreements.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative group flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search project or ID..." 
                  className="pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-full sm:w-64 md:w-80 transition-all"
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
                className="bg-primary text-white py-3 px-6 sm:px-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="sm:hidden font-bold uppercase text-xs tracking-widest">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 md:mt-10">
        <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex items-center gap-2 w-max sm:w-auto p-1.5 bg-white border border-slate-200 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
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
              <div key={contract.id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-6 md:p-8 lg:border-r border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                      <div className="space-y-2 max-w-full sm:max-w-[70%]">
                        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{contract.project_title}</h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Contractor: <span className="text-slate-900">{contract.freelancer_name}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Hash className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Ref: #ORD-{contract.id + 8000}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border shrink-0 ${
                        contract.status === 'active'
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : contract.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {contract.status || 'Execution Phase'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5 md:p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Package className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Package</span>
                        </div>
                        <p className="text-xs md:text-sm font-bold text-slate-900 uppercase truncate">{contract.package_name || 'Standard Pro'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Due Date</span>
                        </div>
                        <p className="text-xs md:text-sm font-bold text-slate-900">
                          {calculateDeadline(contract.freelancer_signed_at, contract.delivery_days)}
                        </p>
                      </div>
                      <div className="space-y-1 sm:col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Delivery Time</span>
                        </div>
                        <p className="text-xs md:text-sm font-bold text-slate-900">{contract.delivery_days || 0} Working Days</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-[320px] p-6 md:p-8 bg-slate-50/40 flex flex-col justify-between gap-6">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Valuation</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-500">$</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                          {Number(contract.total_amount).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full">
                      <button 
                        onClick={() => navigate(`/contracts/${contract.id}`)}
                        className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-100/50 active:scale-95"
                      >
                        Workspace
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMessageFreelancer(contract.freelancer_id)}
                        disabled={getRoomMutation.isPending}
                        className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-50 active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {getRoomMutation.isPending ? "..." : "Message"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[40px] py-24 px-6 text-center border-2 border-dashed border-slate-200">
              <div className="max-w-xs mx-auto">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">No Records Found</h3>
                <p className="text-sm text-slate-400 font-medium">Try adjusting your search or filters to see more results.</p>
              </div>
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 mb-10">
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">
              Showing {contractList.length} of {totalCount} results
            </p>
            <nav className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button 
                disabled={!data?.previous}
                onClick={() => setPage(p => p - 1)}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="text-slate-600 w-5 h-5" />
              </button>
              <div className="h-10 px-6 bg-primary text-white text-xs font-black flex items-center rounded-xl mx-1 shadow-lg shadow-blue-200">
                {page}
              </div>
              <button 
                disabled={!data?.next}
                onClick={() => setPage(p => p + 1)}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="text-slate-600 w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}