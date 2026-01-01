import { NavLink } from "react-router-dom";
import {
  User,
  Edit3,
  Sparkles,
  Settings,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { useModal } from "../../../../hooks/modal/useModalStore";


const navigation = [
  { name: "Profile Overview", href: "/profile", icon: User },
  { name: "Edit Profile", href: "/profile/edit", icon: Edit3 },
  { name: "Skills & Interests", href: "/profile/interests", icon: Sparkles },
  { name: "Account Settings", href: "/profile/settings", icon: Settings },
  { name: "Spending Summary", href: "/profile/spending", icon: TrendingUp },
];

export default function ProfileSidebar({ onNavigate }) {
  const { openModal } = useModal()
  return (
    <div className="h-full px-6 pt-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Client Account
        </h1>
        <p className="text-sm text-gray-500">
          Manage your profile and settings
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
              {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
                  strokeWidth={2}
                />
                <span>{item.name}</span>
              </>
            )}
            </NavLink>
          );
        })}

        <div className="pt-4">
          <button
            onClick={() => {
              openModal("delete-account");
              if(onNavigate) onNavigate(); 
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-600" strokeWidth={2} />
            <span>Delete Account</span>
          </button>

        </div>
      </nav>
      </div>
  );
}
