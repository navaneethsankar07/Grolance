import React, { useRef, useState } from "react";
import ProjectCard from "./components/ProjectCard";
import { useMyProjects } from "./projectQueries";
import { Briefcase, CircleCheck, Hourglass, Search, ChevronRight, ChevronLeft, FolderOpen, X } from "lucide-react";

export default function MyProjects() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchInputRef = useRef(null);

  const { data, isLoading } = useMyProjects({
    page,
    status: activeTab === "all" ? "" : activeTab,
    search: searchQuery,
  });

  const jobs = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const counts = data?.counts ?? { all: 0, completed: 0, in_progress: 0, open: 0 };

  const handleSearch = () => {
    const value = searchInputRef.current.value;
    setSearchQuery(value);
    setPage(1);
  };

  const clearSearch = () => {
    searchInputRef.current.value = "";
    setSearchQuery("");
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const TabButton = ({ id, label, Icon }) => (
    <button
      onClick={() => { setActiveTab(id); setPage(1); }}
      className={`flex items-center justify-center gap-2 px-2 md:px-1 py-3 md:py-4 border-b-2 transition-all flex-1 md:flex-none whitespace-nowrap ${
        activeTab === id ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      <span className="text-xs md:text-sm font-semibold">{label}</span>
      <span className={`px-1.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${
        activeTab === id ? "bg-blue-100 text-primary" : "bg-gray-100 text-gray-500"
      }`}>
        {counts[id] || 0}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB]" style={{ fontFamily: "Roboto, sans-serif" }}>
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 py-6 md:py-10">
        
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">My Job Posts</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">Manage and track your active projects.</p>
          </div>

          <div className="relative flex w-full lg:w-[420px] items-center shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                ref={searchInputRef}
                onKeyDown={handleKeyDown}
                placeholder="Search by title..."
                className="w-full h-[50px] pl-11 pr-10 border border-gray-200 rounded-l-xl text-sm md:text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="h-[50px] px-6 bg-primary hover:bg-blue-600 text-white rounded-r-xl font-bold transition-all active:scale-95"
            >
              <Search className="w-5 h-5 " />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-t-xl md:bg-transparent border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
          <nav className="flex md:gap-8 px-2 md:px-0 min-w-max md:min-w-0">
            <TabButton id="all" label="All Posts" Icon={Briefcase} />
            <TabButton id="completed" label="Completed" Icon={CircleCheck} />
            <TabButton id="in_progress" label="In Progress" Icon={Hourglass} />
          </nav>
        </div>

        <div className="space-y-4 md:space-y-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-44 bg-white border border-gray-100 animate-pulse rounded-2xl shadow-sm" />)
          ) : jobs.length > 0 ? (
            jobs.map((job) => <ProjectCard key={job.id} job={job} />)
          ) : (
            <div className="bg-white flex flex-col items-center justify-center py-16 px-6 gap-4 text-center rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg">No results found</p>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
              </div>
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10 pb-8">
            <p className="text-xs md:text-sm font-medium text-gray-500">
              Showing <span className="text-gray-900 font-bold">{jobs.length}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> results
            </p>
            <nav className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1">
              <button 
                disabled={!data?.previous}
                onClick={() => setPage(p => p - 1)}
                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="text-gray-600 w-5 h-5" />
              </button>
              <div className="h-10 px-5 flex items-center text-sm font-bold text-primary bg-blue-50 rounded-lg mx-1">
                {page}
              </div>
              <button 
                disabled={!data?.next}
                onClick={() => setPage(p => p + 1)}
                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="text-gray-600 w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}