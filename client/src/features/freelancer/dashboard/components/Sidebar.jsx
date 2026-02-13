import { Home, Briefcase, FileText, MessageSquare, CheckSquare, Settings, Tag, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/freelancer" }, 
  { icon: Briefcase, label: "Find Jobs", path: "/freelancer/jobs" },
  { icon: FileText, label: "Contracts", path: "/freelancer/contracts" },
  { icon: MessageSquare, label: "Proposals", path: "/freelancer/my-proposals" },
  { icon: CheckSquare, label: "Invitations", path: "/freelancer/invitations" },
  { icon: Tag, label: "Offers", path: "/freelancer/offers" },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useSelector(state => state.auth);

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      <div className="h-[71px] md:h-[81px] border-b border-[#E5E7EB] flex items-center justify-between px-6">
        <h2 className="text-[18px] md:text-[20.4px] font-bold text-[#111827]">
          Freelancer Panel
        </h2>
        <button onClick={onClose} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose} // Close sidebar on link click (mobile)
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-[#3B82F6] text-white shadow-md shadow-blue-200" 
                    : "text-[#374151] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[#E5E7EB] p-4 lg:mb-0">
        <Link to="/freelancer/profile" onClick={onClose} className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-xl">
          {user?.profile_photo ? (
            <img src={user?.profile_photo} alt="User" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
              {user?.full_name?.[0]}
            </span>
          )}
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-[#1A1A1A] truncate">{user?.full_name}</p>
            <p className="text-[11px] text-[#6B7280]">View Profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}