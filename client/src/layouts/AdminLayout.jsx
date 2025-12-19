import { Outlet } from "react-router-dom";
import AdminSidebar from "../features/admin/dashboard/components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
