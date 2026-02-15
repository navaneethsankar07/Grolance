import { Outlet } from "react-router-dom";
import AdminSidebar from "../features/admin/dashboard/components/AdminSidebar";
import AdminHeader from "../features/admin/dashboard/components/AdminHeader";
import AdminFooter from "../features/admin/dashboard/components/AdminFooter";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-64 flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1">
          <Outlet />
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
