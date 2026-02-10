import { ReactNode } from "react";
import { Sidebar } from "../features/freelancer/dashboard/components/Sidebar";
import { Outlet } from "react-router-dom";
import { FreelancerHeader } from "../features/freelancer/dashboard/components/Header";
import FreelancerFooter from "../features/freelancer/dashboard/components/FreelancerFooter";


export function FreelancerLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F9FAFB]">
        <FreelancerHeader/>
      <div className="flex-1 flex  overflow-hidden">
      <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
                    <FreelancerFooter />
        </main>
      </div>
    </div>
  );
}
