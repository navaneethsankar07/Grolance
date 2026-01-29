import React, { useState } from 'react';
import { useReceivedInvitations } from './invitationQueries';
import { InvitationCard } from './InvitationCard';
import { Loader2, Inbox } from 'lucide-react';

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { data, isLoading, isError } = useReceivedInvitations();
const invitations = data?.results || data || []

const filteredInvitations = invitations?.filter(inv => {
    if (activeTab === 'all') return true;
    return inv.status === activeTab;
  }) || [];

  const counts = {
    all: invitations?.length || 0,
    pending: invitations?.filter(inv => inv.status === 'pending').length || 0,
    accepted: invitations?.filter(inv => inv.status === 'accepted').length || 0,
    hired:invitations?.filter(inv=>inv.status === 'hired').length || 0
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
          {['all', 'pending', 'accepted','hired'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
          {filteredInvitations.length > 0 ? (
            filteredInvitations.map((invitation) => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))
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