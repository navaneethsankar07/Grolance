import React, { useState } from 'react';
import { useMyContracts } from './contractsQueries';
import { 
  MessageSquare, 
  ExternalLink, 
  Clock, 
  Package, 
  Hash, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contracts() {
  const { data: contracts, isLoading } = useMyContracts();
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const tabs = ['All', 'In Progress', 'Submitted', 'Completed', 'Disputed'];

  if (isLoading) return <div className="p-10 text-center animate-pulse">Loading Panel...</div>;

  const contractList = contracts?.results || contracts || [];

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1e293b] mb-1">My Contracts</h1>
          <p className="text-sm text-gray-500">
            Manage your active and completed freelance projects. Track progress and communicate with clients.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab 
                ? 'bg-[#3b82f6] text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {contractList.length > 0 ? (
            contractList.map((contract) => (
              <div key={contract.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#1e293b] mb-1">{contract.project_title}</h2>
                      <p className="text-xs text-gray-500">
                        Client: <span className="text-blue-600 font-medium">{contract.client_name}</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      contract.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {contract.status === 'active' ? 'In Progress' : contract.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-2">
                    {contract.project_description || "Detailed project implementation and milestone tracking for this contract."}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-gray-50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Hash className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Order ID</span>
                      </div>
                      <p className="text-xs font-bold text-gray-800">#ORD-{contract.id + 8000}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Package className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Package</span>
                      </div>
                      <p className="text-xs font-bold text-gray-800">Pro</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Delivery</span>
                      </div>
                      <p className="text-xs font-bold text-gray-800">14 Days</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <span className="text-[10px] font-bold uppercase">Price</span>
                      </div>
                      <p className="text-lg font-black text-gray-900">₹{Number(contract.total_amount).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/freelancer/contracts/${contract.id}`)}
                      className="flex items-center gap-2 bg-[#3b82f6] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Order
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message Client
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No contracts found in this category.</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center items-center gap-2">
          <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button 
              key={page} 
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                page === 1 ? 'bg-[#3b82f6] text-white' : 'bg-white text-gray-400 border border-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}