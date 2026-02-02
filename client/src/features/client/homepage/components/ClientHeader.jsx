import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Bell, Mail, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { useNotifications } from "../../../../components/notifications/notificationQueries";
import { useNotificationSocket } from "../../../../hooks/notification/useNotificationSocket";
import { useChatRooms } from "../../../../components/chat/chatQueries";

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevCountRef = useRef(0);
  
  const user = useSelector((state) => state.auth.user);
  const currentUserId = user?.id;
  
  const { data: notifications } = useNotifications(false);
  const { data: rooms } = useChatRooms(); // Fetch rooms for message count
  useNotificationSocket(user?.id);
  
  const unreadNotifications = notifications?.results?.length || 0;
  
  // Calculate total unread messages across all rooms
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

  const fullName = user?.full_name ?? "";
  const displayName = fullName.split(" ")[0];
  const profilePic = user?.profile_photo ?? null;
  const { openModal } = useModal();

  useEffect(() => {
    if (unreadNotifications < prevCountRef.current) return;
    if (unreadNotifications > prevCountRef.current) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadNotifications;
  }, [unreadNotifications]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-sm">
      <div className="w-full md:px-8 px-4 flex h-[73px] items-center justify-between">
        
        <Link to={"/"} className="flex items-center gap-4 shrink-0">
          <h1 className="text-[28px] md:text-[37px] font-bold leading-7" style={{ fontFamily: "MuseoModerno, sans-serif" }}>
            <span className="text-[#1A1A1A]">Gro</span>
            <span className="text-primary">lance</span>
          </h1>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          <Link to="/" className="text-lg font-bold text-primary">Dashboard</Link>
          <Link to={'/find-talents'} className="text-sm font-medium text-[#111318]">Find Talent</Link>
          <Link to={'/how-it-works'} className="text-sm font-medium text-[#111318]">How It Works</Link>
          <Link to="/my-projects" className="text-sm font-medium text-[#111318]">My Posts</Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-10">
          <Link
            to="/create-project"
            className="hidden sm:flex h-10 md:h-12 items-center gap-2.5 rounded-lg border-2 border-black bg-transparent px-4 md:px-6 transition-colors hover:bg-black/5"
          >
            <Plus className="h-5 w-5 md:h-7 md:w-7" />
            <span className="text-sm md:text-base font-bold">Post a Project</span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <button 
              className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => openModal("notifications")}
            >
              <Bell className={`h-5 w-5 md:h-6 md:w-6 text-gray-400 ${shouldAnimate ? 'animate-bounce text-primary' : ''}`} />
              {unreadNotifications > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 md:h-4 md:w-4 items-center justify-center rounded-full bg-primary text-[8px] md:text-[9px] font-bold text-white">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            <button 
              className="relative p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => openModal("messages")}
            >
              <Mail className="w-5 h-5 text-gray-600" />
              {unreadMessageCount > 0 && (
                <span className="absolute top-0 right-0 md:top-1 md:right-1 min-w-[14px] h-3.5 md:w-4 md:h-4 bg-blue-500 rounded-full flex items-center justify-center px-1">
                  <span className="text-white text-[8px] md:text-[9px] font-semibold">
                    {unreadMessageCount}
                  </span>
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <div className="text-base font-semibold text-[#1A1A1A]">{displayName}</div>
              <div className="text-sm text-primary">Client Account</div>
            </div>
            <button
              onClick={() => openModal("profile-menu")}
              className="h-10 w-10 md:h-11 md:w-11 rounded-full overflow-hidden border border-gray-100"
            >
              {profilePic ? (
                <img src={profilePic} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="bg-[#3B82f6] h-full w-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{fullName?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}