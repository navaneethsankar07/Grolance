import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { logoutThunk } from "../../../client/account/auth/authThunks";
import { useDispatch } from "react-redux";

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Disputes", icon: AlertCircle, path: "/admin/disputes" },
  { name: "Categories", icon: Tag, path: "/admin/category-management" },
  { name: "Transactions", icon: Repeat, path: "/admin/transactions" },
  { name: "Payment Release", icon: Wallet, path: "/admin/payment-release" },
  { name: "Reports", icon: FileText, path: "/admin/reports" },
  { name: "Support", icon: MessageSquare, path: "/admin/support" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar() {
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate()
const handleLogout = async () => {
  try {
    await dispatch(logoutThunk()).unwrap();
    navigate('/', { replace: true }); 
  } catch (error) {
    navigate('/', { replace: true });
  }
};
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
      
      <div className="h-20 flex items-center px-9">
        <h1 className="text-[37px] font-extrabold leading-7 font-museo">
          <span className="text-[#1A1A1A]">Gro</span>
          <span className="text-blue-500">lance</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 pt-5">
        <p className="text-[10.2px] font-semibold text-gray-400 px-2 mb-4">
          Admin Navigation
        </p>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-gray-100 p-4">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full">
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
