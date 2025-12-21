export default function AdminHeader() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
        Admin Dashboard
      </h1>

      {/* Admin Info */}
      <div className="flex items-center gap-5">
        <div className="border-l border-gray-200 pl-5">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              Alex Morgan
            </p>
            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
