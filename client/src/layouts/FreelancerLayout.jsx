import { useState } from "react";
import { Sidebar } from "../features/freelancer/dashboard/components/Sidebar";
import { Outlet } from "react-router-dom";
import { FreelancerHeader } from "../features/freelancer/dashboard/components/Header";
import FreelancerFooter from "../features/freelancer/dashboard/components/FreelancerFooter";

export function FreelancerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F9FAFB]">
      <FreelancerHeader onMenuClick={toggleSidebar} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
            onClick={toggleSidebar}
          />
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto flex flex-col w-full">
          <div className="flex-1 p-4 md:p-0">
            <Outlet />
          </div>
          <FreelancerFooter />
        </main>
      </div>
    </div>
  );
}