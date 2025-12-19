import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  Tag,
  Repeat,
  Wallet,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { useSelector } from "react-redux";

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Users", icon: Users, path: "/users" },
  { name: "Disputes", icon: AlertCircle, path: "/disputes" },
  { name: "Categories", icon: Tag, path: "/categories" },
  { name: "Transactions", icon: Repeat, path: "/transactions" },
  { name: "Payment Release", icon: Wallet, path: "/payment-release" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "Support", icon: MessageSquare, path: "/support" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function AdminSidebar() {
  const location = useLocation();
  return (
    <div className="w-64 h-screen border-r border-gray-100 bg-white flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center px-9">
        <h1 className="text-[37px] font-extrabold leading-7 font-museo">
          <span className="text-[#1A1A1A]">Gro</span>
          <span className="text-blue-500">lance</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 pt-5">
        <div className="mb-4">
          <p className="text-[10.2px] font-semibold text-gray-400 px-2">
            Admin Navigation
          </p>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign Out */}
      <div className="h-[73px] border-t border-gray-100 flex items-center px-4">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full">
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
