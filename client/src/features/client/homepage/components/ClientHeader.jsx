import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Bell, Mail, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { useNotifications } from "../../../../components/notifications/notificationQueries";
import { useChatRooms } from "../../../../components/chat/chatQueries";
import Header from "../../landingPage/components/Header";
import { FreelancerHeader } from "../../../freelancer/dashboard/components/Header";
import AdminHeader from "../../../admin/dashboard/components/AdminHeader";

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevCountRef = useRef(0);
  const location = useLocation();
  
  const user = useSelector((state) => state.auth.user);
  const currentUserId = user?.id;
  
  const { data: notifications } = useNotifications(false, { enabled: !!currentUserId });
  const { data: rooms } = useChatRooms({ enabled: !!currentUserId }); 

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (!user) return <Header />;
  if (user?.current_role === 'freelancer') return <FreelancerHeader />;
  if (user?.is_admin) return <AdminHeader />;

  const unreadNotifications = notifications?.results?.length || 0;
  
  const unreadMessageCount = useMemo(() => {
    const roomList = Array.isArray(rooms?.results) 
      ? rooms.results 
      : Array.isArray(rooms) 
        ? rooms 
        : [];
    if (roomList.length === 0) return 0;
    return roomList?.reduce((acc, room) => {
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
    if (unreadNotifications > prevCountRef.current) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadNotifications;
  }, [unreadNotifications]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-sm">
      <div className="w-full xl:px-8 px-4 flex h-[73px] items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            className="xl:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link to={"/"} className="flex items-center gap-2 md:gap-4 shrink-0">
            <h1 className="text-[22px] md:text-[32px] xl:text-[37px] font-bold" style={{ fontFamily: "MuseoModerno, sans-serif" }}>
              <span className="text-[#1A1A1A]">Gro</span>
              <span className="text-primary">lance</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-6 xxl:gap-9">
          <Link to="/" className={`text-base xxl:text-lg font-bold ${isActive("/") ? "text-primary" : "text-[#111318]"}`}>Dashboard</Link>
          <Link to={'/find-talents'} className={`text-sm font-medium ${isActive("/find-talents") ? "text-primary" : "text-[#111318]"}`}>Find Talent</Link>
          <Link to={'/how-it-works'} className={`text-sm font-medium ${isActive("/how-it-works") ? "text-primary" : "text-[#111318]"}`}>How It Works</Link>
          <Link to="/my-projects" className={`text-sm font-medium ${isActive("/my-projects") ? "text-primary" : "text-[#111318]"}`}>My Posts</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4 xl:gap-10">
          <Link
            to="/create-project"
            className={`hidden sm:flex h-10 xl:h-12 items-center gap-2.5 rounded-lg border-2 px-4 xl:px-6 transition-colors ${isActive("/create-project") ? "border-primary bg-primary/5 text-primary" : "border-black bg-transparent text-black hover:bg-black/5"}`}
          >
            <Plus className="h-5 w-5 xl:h-7 xl:w-7" />
            <span className="text-sm xl:text-base font-bold whitespace-nowrap">Post a Project</span>
          </Link>

          <div className="flex items-center gap-1 md:gap-3 xl:gap-6">
            <button className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors" onClick={() => openModal("notifications")}>
              <Bell className={`h-5 w-5 md:h-6 md:w-6 text-gray-400 ${shouldAnimate ? 'animate-bounce text-primary' : ''}`} />
              {unreadNotifications > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            <button className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => openModal("messages")}>
              <Mail className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              {unreadMessageCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-blue-500 rounded-full flex items-center justify-center px-1">
                  <span className="text-white text-[9px] font-semibold">{unreadMessageCount}</span>
                </span>
              )}
            </button>
          </div>

          <button data-profile-button='true' onClick={() => openModal("profile-menu")} className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold text-[#1A1A1A]">{displayName}</div>
              <div className="text-[10px] text-primary uppercase font-bold">Client</div>
            </div>
            <div className="h-9 w-9 md:h-11 md:w-11 rounded-full overflow-hidden border border-gray-100 shrink-0">
              {profilePic ? (
                <img src={profilePic} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="bg-[#3B82f6] h-full w-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{fullName?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="xl:hidden absolute top-[73px] left-0 w-full bg-white border-b border-gray-200 py-4 px-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top duration-300 z-50">
          <Link to="/" className={`text-base font-bold ${isActive("/") ? "text-primary" : "text-[#111318]"}`}>Dashboard</Link>
          <Link to={'/find-talents'} className={`text-base font-medium ${isActive("/find-talents") ? "text-primary" : "text-[#111318]"}`}>Find Talent</Link>
          <Link to={'/how-it-works'} className={`text-base font-medium ${isActive("/how-it-works") ? "text-primary" : "text-[#111318]"}`}>How It Works</Link>
          <Link to="/my-projects" className={`text-base font-medium ${isActive("/my-projects") ? "text-primary" : "text-[#111318]"}`}>My Projects</Link>
          <Link to="/create-project" className="sm:hidden flex items-center gap-2 text-primary font-bold"><Plus size={18}/> Post a Project</Link>
        </div>
      )}
    </header>
  );
}