import React from 'react';
import { Briefcase, DollarSign, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { useUpdateInvitationStatus } from './invitationMutation';

export function InvitationCard({ invitation }) {
  const { mutate: updateStatus, isPending } = useUpdateInvitationStatus();

  const handleAction = (status) => {
    updateStatus({ id: invitation.id, status });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-gray-100 text-gray-700",
      accepted: "bg-green-100 text-green-700",
      declined: "bg-red-100 text-red-700",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span>Invited by <span className="font-semibold">{invitation.client_name}</span></span>
        </div>
        <div className="self-start sm:self-auto">
          {getStatusBadge(invitation.status)}
        </div>
      </div>

      <h2 className="text-[17px] font-bold text-gray-900 mb-2 leading-7">
        {invitation.project_title}
      </h2>

      <p className="text-xs text-gray-600 mb-4 leading-5 line-clamp-2">
        {invitation.message || "No message provided."}
      </p>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {invitation.package_type} Package
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-700">
            Received {new Date(invitation.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {invitation.status === 'pending' && (
          <>
            <button 
              onClick={() => handleAction('accepted')}
              disabled={isPending}
              className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept Invitation'}
            </button>
            <button 
              onClick={() => handleAction('declined')}
              disabled={isPending}
              className="px-4 py-2.5 rounded-lg border-2 border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 disabled:opacity-50"
            >
              Decline
            </button>
          </>
        )}
        {invitation.status === 'accepted' && (
          <button className="px-4 py-2 rounded-lg bg-green-50 text-green-600 text-xs font-bold flex items-center gap-2 cursor-default">
            Accepted
          </button>
        )}
      </div>
    </div>
  );
}