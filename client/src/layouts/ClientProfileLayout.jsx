import { Outlet } from "react-router-dom";
import ProfileSidebar from "../features/client/profile/components/ProfileSidebar";

export default function ClientProfileLayout() {
  return (
    <div className="flex  -mt-6 min-h-full">
      <aside className="w-80 shrink-0 border-r border-gray-200 bg-white sticky top-0 self-start h-[calc(100vh-4rem)]">
        <ProfileSidebar />
      </aside>

      <main className="flex-1 p-6 bg-gray-50 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
