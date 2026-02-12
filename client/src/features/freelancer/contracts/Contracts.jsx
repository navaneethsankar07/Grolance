import React, { useState } from 'react';
import { useMyContracts } from './contractsQueries';
import { 
  MessageSquare, 
  ExternalLink, 
  Clock, 
  Package, 
  Hash, 
  ChevronLeft, 
  ChevronRight,
  Search,
  X,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contracts() {
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  const { data, isLoading } = useMyContracts({ 
    status: activeTab, 
    page: page,
    role: 'freelancer',
    search: searchTerm 
  });

  const tabs = ['All', 'In Progress', 'Submitted', 'Completed', 'Disputed'];

  const handleSearchTrigger = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchTrigger();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500">Loading your workspace...</p>
      </div>
    </div>
  );

  const contractList = data?.results || [];
  const totalCount = data?.count || 0;

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 sm:p-8 font-sans text-[#1e293b]">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Contracts</h1>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Professional management of your freelance portfolio. Track milestones, manage deliverables, and communicate with clients.
            </p>
          </div>

          <div className="relative flex items-center gap-2">
            <div className="relative group">
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Project or ID..."
                className="w-full sm:w-72 pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3b82f6]" />
              {searchInput && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            <button 
              onClick={handleSearchTrigger}
              className="bg-[#3b82f6] text-white p-2.5 rounded-lg hover:bg-blue-600 transition-all shadow-md active:scale-95"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-[#3b82f6] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {contractList.length > 0 ? (
            <>
              {contractList.map((contract) => (
                <div 
                  key={contract.id} 
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                            contract.status === 'active' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : 'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                            {contract.status === 'active' ? 'In Progress' : contract.status}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter italic">
                            Contract: #ORD-{contract.id + 8000}
                          </span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-[#1e293b] mb-1 group-hover:text-[#3b82f6] transition-colors cursor-pointer">
                          {contract.project_title}
                        </h2>
                        <p className="text-xs text-gray-500 mb-4">
                          Client Partner: <span className="text-[#3b82f6] font-semibold">{contract.client_name}</span>
                        </p>
                        
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 max-w-2xl">
                          {contract.project_description || "Consultancy and implementation services for the aforementioned project scope."}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4 lg:min-w-[300px]">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full lg:mb-4 xl:mb-0">
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Package</p>
                            <p className="text-xs font-bold text-gray-700">{contract.package_name || 'Professional'}</p>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Budget</p>
                            <p className="text-sm font-black text-gray-900">${Number(contract.total_amount).toLocaleString()}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Timeline</p>
                            <p className="text-xs font-bold text-gray-700">{contract.delivery_days || 14} Days</p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => navigate(`/freelancer/contracts/${contract.id}`)}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#3b82f6] text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all hover:shadow-lg hover:shadow-blue-100"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-2">
                <p className="text-sm text-gray-600">Showing {contractList.length} of {totalCount} results</p>
                <nav className="flex items-center rounded-md shadow-sm">
                  <button 
                    disabled={!data?.previous}
                    onClick={() => setPage(p => p - 1)}
                    className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="text-gray-400 w-5 h-5" />
                  </button>
                  <div className="h-9 px-4 bg-[#3b82f6] text-white text-sm font-semibold flex items-center border-t border-b border-[#3b82f6]">
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
            </>
          ) : (
            <div className="bg-white rounded-3xl p-24 text-center border-2 border-dashed border-gray-200">
              <div className="flex justify-center mb-4 text-gray-200">
                <Filter className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">No contracts found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}