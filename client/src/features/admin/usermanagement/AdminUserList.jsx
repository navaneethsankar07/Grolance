import { useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { useAdminUsers } from "./usersQueries";
import UserTable from "./userTable";

export default function AdminUserList() {
  const [searchInput, setSearchInput] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError } = useAdminUsers({ 
    page, 
    search: activeSearch, 
    status 
  });

  const handleSearchTrigger = () => {
    setActiveSearch(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchTrigger();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

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
        <div className="flex flex-1 min-w-60 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name or email..."
              className="w-full h-11 pl-10 pr-10 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleSearchTrigger}
            className="h-11 px-6 bg-primary hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-11 pl-10 pr-10 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer font-medium text-gray-700 min-w-[160px]"
          >
            <option value="">All Users</option>
            <option value="active">Active Only</option>
            <option value="both">Both (Active)</option>
            <option value="client">Clients (Active)</option>
            <option value="blocked">Blocked</option>
            <option value="deleted">Deleted</option>
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
          totalUsers={data?.count}
        />
      )}
    </div>
  );
}