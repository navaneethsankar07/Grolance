import React, { useRef, useState } from "react";
import ProjectCard from "./components/ProjectCard";
import { useMyProjects } from "./projectQueries";
import { Briefcase, CircleCheck, Hourglass , Search, ChevronRight, ChevronLeft, FolderOpen} from "lucide-react";

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

  const handleSearch = () => {
    const value = searchInputRef.current.value;
    setSearchQuery(value);
    setPage(1);
  }
console.log(data);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  }

  const TabButton = ({ id, label, Icon, count }) => (
    <button
      onClick={() => { setActiveTab(id); setPage(1); }}
      className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors ${
        activeTab === id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon className="w-5 h-5"/>
      <span className="text-sm font-medium">{label}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        activeTab === id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
      }`}>
        {count || 0}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Roboto, sans-serif" }}>
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-[30px] font-bold text-gray-800 leading-9">My Job Posts</h1>
            <p className="text-sm md:text-base text-gray-500">View, manage, and track all the projects you've posted.</p>
          </div>

          <div className="relative flex w-full lg:w-[414px] items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                ref={searchInputRef}
                onKeyDown={handleKeyDown}
                placeholder="Search Jobs..."
                className="w-full h-[46px] pl-11 pr-4 border border-gray-300 rounded-l-md text-base focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-[46px] px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md flex items-center justify-center transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6">
            <TabButton id="all" label="All Posts" Icon={Briefcase} count={activeTab === 'all' ? totalCount : null} />
            <TabButton id="completed" label="Completed" Icon={CircleCheck} />
            <TabButton id="in-progress" label="In Progress" Icon={Hourglass} />
          </nav>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg" />)
          ) : jobs.length > 0 ? (
            jobs.map((job) => <ProjectCard key={job.id} job={job} />)
          ) : (
            <div className="bg-white flex flex-col items-center justify-center p-20 gap-3 text-center rounded-lg border text-gray-400">
              <FolderOpen className="w-12 h-12 mb-2"/>
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-2">
          <p className="text-sm text-gray-600">Showing {jobs.length} of {totalCount} results</p>
          <nav className="flex items-center rounded-md shadow-sm">
            <button 
              disabled={!data?.previous}
              onClick={() => setPage(p => p - 1)}
              className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="text-gray-400 w-5 h-5"/>
            </button>
            <div className="h-9 px-4 bg-blue-500 text-white text-sm font-semibold flex items-center border-t border-b border-blue-500">
              {page}
            </div>
            <button 
              disabled={!data?.next}
              onClick={() => setPage(p => p + 1)}
              className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="text-gray-400 w-5 h-5"/>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}