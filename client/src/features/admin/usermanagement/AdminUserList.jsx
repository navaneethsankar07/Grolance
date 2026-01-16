import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useAdminUsers } from "./usersQueries";
import UserTable from "./userTable";

export default function AdminUserList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");

  const { data, isLoading, isError } = useAdminUsers({ page, search, role });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Overview of all accounts, permissions, and platform activity.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full h-11 pl-10 pr-4 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="h-11 pl-10 pr-10 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer font-medium text-gray-700"
          >
            <option value="">All Roles</option>
            <option value="client">Clients Only</option>
            <option value="freelancer">Freelancers Only</option>
            <option value="both">Dual Accounts</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-gray-500 font-medium">Fetching users...</p>
        </div>
      ) : isError ? (
        <div className="p-10 text-center bg-red-50 rounded-xl border border-red-100">
          <p className="text-sm text-red-600 font-semibold">Error loading user database.</p>
        </div>
      ) : (
        <UserTable
          users={data?.results || []}
          page={page}
          setPage={setPage}
          hasNext={!!data?.next}
          hasPrev={!!data?.previous}
        />
      )}
    </div>
  );
}