import { Bell, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSwitchRole } from "../../../client/homepage/homePageMutation";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { useNotifications } from "../../../../components/notifications/notificationQueries";
import { useNotificationSocket } from "../../../../hooks/notification/useNotificationSocket";
import { useChatRooms } from "../../../../components/chat/chatQueries";

export function FreelancerHeader() {
  const { mutateAsync } = useSwitchRole();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { openModal } = useModal();
  
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevCountRef = useRef(0);
  const { data: rooms } = useChatRooms(); 
  const currentUserId = user?.id;

  const { data: notifications } = useNotifications(false);
  useNotificationSocket(user?.id);

  const unreadCount = notifications?.results?.length || 0;

  useEffect(() => {
    if (unreadCount <= prevCountRef.current) {
      prevCountRef.current = unreadCount;
      return;
    }

    setShouldAnimate(true);
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 5000);
    prevCountRef.current = unreadCount;
    return () => clearTimeout(timer);
  }, [unreadCount]);

  const handleSwitchToClient = async () => {
    if (user?.is_freelancer) {
      await mutateAsync({ role: "client" });
      navigate("/");
    }
  };

    const unreadMessageCount = useMemo(() => {
      const roomList = rooms?.results || rooms || [];
      return roomList.reduce((acc, room) => {
        const lastMsg = room.last_message;
        if (lastMsg && !lastMsg.is_read && lastMsg.sender !== currentUserId) {
          return acc + 1;
        }
        return acc;
      }, 0);
    }, [rooms, currentUserId]);

  return (
    <header className="w-full h-[80px] bg-white border-b border-[#F3F4F6] flex items-center justify-between px-10">
      <Link to="/" className="flex items-center">
        <h1 className="text-[40px] leading-none font-[900] tracking-tight" style={{ fontFamily: 'MuseoModerno, sans-serif' }}>
          <span className="text-[#1A1A1A]">Gro</span>
          <span className="text-primary">lance</span>
        </h1>
      </Link>

      <div className="flex items-center gap-6">
        <button onClick={handleSwitchToClient} className="flex items-center gap-3 h-11 px-5 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.33334 2L2.66667 4.66667L5.33334 7.33333" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.66667 4.6665H13.3333" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.6667 13.9998L13.3333 11.3332L10.6667 8.6665" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.3333 11.3335H2.66667" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-bold text-[#3B82F6]" style={{ fontFamily: 'Inter, sans-serif' }}>Switch to Client</span>
        </button>

        <div className="flex items-center gap-2">
            <button 
              onClick={() => openModal("messages")}
              className="relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-6 h-6 text-[#4B5563]" />
              {unreadMessageCount > 0 && (
                <span className="absolute top-0 right-0 md:top-1 md:right-1 min-w-[14px] h-3.5 md:w-4 md:h-4 bg-blue-500 rounded-full flex items-center justify-center px-1">
                  <span className="text-white text-[8px] md:text-[9px] font-semibold">
                    {unreadMessageCount}
                  </span>
                </span>
              )}
            </button>

            <button 
              onClick={() => openModal("notifications")}
              className="relative w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-full"
            >
              <Bell className={`w-6 h-6 text-[#4B5563] transition-colors ${shouldAnimate ? 'animate-bounce text-primary' : ''}`} />
              
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-in zoom-in">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}

              {shouldAnimate && (
                <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping" />
              )}
            </button>
        </div>
      </div>
    </header>
  );
}