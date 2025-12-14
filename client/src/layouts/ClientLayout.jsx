import { Outlet } from "react-router-dom";
import ClientHeader from "../features/client/homepage/components/ClientHeader";
import ClientFooter from "../features/client/homepage/components/ClientFooter";

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />

      <main className="flex-1 bg-gray-50 px-4 py-6">
        <Outlet />
      </main>

      <ClientFooter />
    </div>
  );
}
