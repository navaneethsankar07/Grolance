import { Outlet } from "react-router-dom";
import ClientHeader from "../features/client/homepage/components/ClientHeader";
import ClientFooter from "../features/client/homepage/components/ClientFooter";

export default function ClientLayout() {
  return (
    <div className="min-h-screen  flex flex-col w-full overflow-x-hidden">
      <ClientHeader />

      <main className="flex-1 mt-19 bg-gray-50 w-full">
        <div className="w-full max-w-[1920px] mx-auto">
          <Outlet />
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}