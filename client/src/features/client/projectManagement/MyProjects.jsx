import React, { useState } from "react";
import ProjectCard from "./components/ProjectCard";
import { useMyProjects } from "./projectQueries";

export default function MyProjects() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyProjects({
    page,
    status: activeTab === "all" ? "" : activeTab,
    search: searchQuery,
  });

  const jobs = data?.results ?? [];
  const totalCount = data?.count ?? 0;

  if (isLoading) return <div className="p-10 text-center">Loading Projects...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 py-8">
        
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Job Posts</h1>
          <div className="relative w-full lg:w-[400px]">
            <input
              type="text"
              placeholder="Search Jobs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
              className="w-full h-11 pl-4 pr-4 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6 flex gap-6">
          {["all", "open", "in-progress", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`pb-4 text-sm font-medium capitalize transition-all ${
                activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-6">
          {jobs.length > 0 ? (
            jobs.map((job) => <ProjectCard key={job.id} job={job} />)
          ) : (
            <div className="bg-white p-10 text-center rounded-lg border">No projects found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-gray-600">Total {totalCount} results</p>
            <div className="flex gap-2">
              <button
                disabled={!data?.previous}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border rounded bg-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={!data?.next}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}