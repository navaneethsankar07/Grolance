import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ProfileSidebar from "../features/client/profile/components/ProfileSidebar";

export default function ClientProfileLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row lg:-mt-6 -mt-3 min-h-screen">
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
        <h1 className="text-lg font-bold text-gray-900">Client Account</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <aside className={`
        fixed inset-y-0 lg:mt-0 mt-18 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto lg:w-80 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <ProfileSidebar onNavigate={() => setIsSidebarOpen(false)} />
      </aside>

      <main className="flex-1  p-4 sm:p-6 bg-gray-50 overflow-x-hidden w-full">
        <Outlet />
      </main>
    </div>
  );
}