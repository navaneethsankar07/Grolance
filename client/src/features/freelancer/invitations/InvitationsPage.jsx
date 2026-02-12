import React, { useState } from 'react';
import { useReceivedInvitations } from './invitationQueries';
import { InvitationCard } from './InvitationCard';
import { Loader2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useReceivedInvitations({ page, status: activeTab === 'all' ? '' : activeTab });
  
  const invitations = data?.results || [];

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const counts = {
    all: data?.total_counts?.all || 0,
    pending: data?.total_counts?.pending || 0,
    accepted: data?.total_counts?.accepted || 0,
    hired: data?.total_counts?.hired || 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[992px] mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Invitations</h1>
          <p className="text-sm text-gray-600 mt-1">Manage project requests from clients.</p>
        </div>

        <div className="border-b border-gray-200 mb-8 flex gap-8">
          {['all', 'pending', 'accepted', 'hired'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`pb-4 px-1 relative text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab} ({counts[tab]})
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {invitations.length > 0 ? (
            <>
              {invitations.map((invitation) => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))}
              {data.count>10 &&

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-2">
                <p className="text-sm text-gray-600">
                  Showing {invitations.length} of {data?.count || 0} results
                </p>
                <nav className="flex items-center rounded-md shadow-sm">
                  <button
                    disabled={!data?.previous}
                    onClick={() => handlePageChange(page - 1)}
                    className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                    >
                    <ChevronLeft className="text-gray-400 w-5 h-5" />
                  </button>
                  <div className="h-9 px-4 bg-blue-600 text-white text-sm font-semibold flex items-center border-t border-b border-blue-600">
                    {page}
                  </div>
                  <button
                    disabled={!data?.next}
                    onClick={() => handlePageChange(page + 1)}
                    className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                    >
                    <ChevronRight className="text-gray-400 w-5 h-5" />
                  </button>
                </nav>
              </div>
                  }
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No {activeTab} invitations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}