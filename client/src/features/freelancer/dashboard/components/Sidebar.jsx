import { Home, Briefcase, FileText, MessageSquare, CheckSquare, Settings, Tag } from "lucide-react";
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

export function Sidebar() {
  const location = useLocation();
  const {user} = useSelector(state=>state.auth) 
  

  

  return (
    <aside className="w-64 h-screen bg-white border-r border-[#E5E7EB] flex flex-col shrink-0">
      <div className="h-[81px] border-b border-[#E5E7EB] flex items-center px-6">
        <h2 className="text-[20.4px] font-bold text-[#111827]">
          Freelancer Panel
        </h2>
      </div>

      <nav className="flex-1 px-4 py-4">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-[#3B82F6] text-white shadow-md shadow-blue-200" 
                    : "text-[#374151] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[#E5E7EB] p-4 mb-20">
        <Link to="/freelancer/profile" className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-xl transition-colors">
          <img 
            src={user?.profile_photo} 
            alt="User" 
            className="w-10 h-10 rounded-full bg-gray-100 object-cover"
          />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-[#1A1A1A] truncate">
              {user?.full_name}
            </p>
            <p className="text-[11px] text-[#6B7280]">View Profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}