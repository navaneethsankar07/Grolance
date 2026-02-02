import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, CheckCircle, AlertCircle, FileText, Bell, Loader2, X } from "lucide-react";
import { useNotifications } from "./notificationQueries";
import { useMarkAsRead } from "./notificationMutations";

export default function Notifications({ onClose }) {
  const [fetchAll, setFetchAll] = useState(false);
  const { data: notifications, isLoading } = useNotifications(fetchAll);
  const markReadMutation = useMarkAsRead();
    
  const getStyleMap = (type) => {
    const maps = {
      proposal_accepted: { icon: <CheckCircle className="w-4 h-4" />, bg: "bg-green-50", text: "text-green-500", title: "Proposal Accepted" },
      invitation_received: { icon: <MessageCircle className="w-4 h-4" />, bg: "bg-blue-50", text: "text-blue-500", title: "New Invitation" },
      delivered: { icon: <FileText className="w-4 h-4" />, bg: "bg-amber-50", text: "text-amber-500", title: "Work Delivered" },
      offer_received: { icon: <MessageCircle className="w-4 h-4" />, bg: "bg-blue-50", text: "text-blue-500", title: "New Offer" },
      contract_started: { icon: <CheckCircle className="w-4 h-4" />, bg: "bg-green-50", text: "text-green-500", title: "Contract Started" },
      contract_completed: { icon: <CheckCircle className="w-4 h-4" />, bg: "bg-primary/10", text: "text-primary", title: "Contract Completed" },
      revision_requested: { icon: <AlertCircle className="w-4 h-4" />, bg: "bg-red-50", text: "text-red-500", title: "Revision Requested" },
      revision_accepted: { icon: <CheckCircle className="w-4 h-4" />, bg: "bg-green-50", text: "text-green-500", title: "Revision Accepted" },
      default: { icon: <Bell className="w-4 h-4" />, bg: "bg-gray-50", text: "text-gray-500", title: "Notification" }
    };
    return maps[type] || maps.default;
  };

  if (isLoading) {
    return (
      <div className="w-[384px] bg-white rounded-xl border p-10 flex justify-center shadow-2xl">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-[384px] min-w-[384px] animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-semibold text-gray-900">Notifications</h1>
            <button 
              onClick={() => setFetchAll(!fetchAll)}
              className="text-[9px] font-bold uppercase tracking-wider bg-white border border-gray-200 hover:bg-gray-50 px-2 py-0.5 rounded text-gray-600 transition-colors"
            >
              {fetchAll ? "Unread Only" : "See All"}
            </button>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="px-5 py-6 space-y-6 h-[400px] overflow-y-auto bg-white">
          {notifications?.results?.length > 0 ? (
            notifications?.results.map((n) => {
              const style = getStyleMap(n.notification_type);
              
              return (
                <div key={n.id} className={`flex gap-3 transition-opacity ${n.is_read ? 'opacity-50' : 'opacity-100'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full ${style.bg} flex items-center justify-center ${style.text}`}>
                    {style.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-gray-900 leading-[17px]">
                      {style.title}
                    </h3>
                    <p className="text-[10.2px] text-gray-600 leading-[19px] mt-[2px]">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-[9px]">
                      <span className="text-[9px] text-gray-400">
                        {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!n.is_read && (
                        <button
                          onClick={() => markReadMutation.mutate(n.id)}
                          className="text-[9px] font-medium text-blue-500 hover:text-blue-600"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Bell className="w-8 h-8 text-gray-200" />
              <p className="text-[11px] text-gray-400">No notifications to show</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}