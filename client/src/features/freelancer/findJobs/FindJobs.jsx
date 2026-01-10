import React, { useState } from 'react';
import JobCard from "./components/JobCard";
import { useFreelancerProjects } from "./findJobsQueries";
import { useCategories, useSkills } from '../../client/projectManagement/projectQueries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function FindJobs() {
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  const { data: skillsData, isLoading: skillsLoading } = useSkills();
  const skills = skillsData?.results ?? [];

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.results ?? [];

  const { data, isLoading } = useFreelancerProjects({
    search: appliedSearch || undefined,
    category: selectedCategory || undefined,
    skill: selectedSkill || undefined
  });

  const projects = data?.results || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(searchInput);
  };

  const handleShare = (projectId) => {
    const url = `${window.location.origin}/freelancer/projects/${projectId}`;
    navigator.clipboard.writeText(url);
    toast.success("Project link copied");
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setAppliedSearch("");
    setSelectedCategory("");
    setSelectedSkill("");
  };

  return (
    <div className="min-h-screen mt-5 bg-[#FCFCFD]">
      <header className="bg-white border-b border-[#F3F4F6] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left w-full">
            <h1 className="text-3xl font-bold text-[#111827]">Find Your Next Project</h1>
            <p className="text-[#6B7280] mt-2">Browse opportunities matched to your skills</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md flex gap-2">
            <div className="relative grow">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M17.5 17.5L13.8834 13.8838M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for jobs..."
                className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
              />
            </div>
            <button type="submit" className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">
              Search
            </button>
          </form>
        </div>
      </header>

      <div className="bg-white border-b border-[#F3F4F6] py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">

            <div className="relative">
              <button
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsSkillsOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${selectedCategory ? 'border-primary bg-blue-50 text-blue-700' : 'border-[#E5E7EB] text-[#374151] hover:bg-gray-50'}`}
              >
                <span>{selectedCategory || "Category"}</span>
                <svg className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {isCategoryOpen && (
                <div className="absolute mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-2 z-50 max-h-60 overflow-y-auto">
                  <button onClick={() => { setSelectedCategory(""); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-primary font-medium hover:bg-gray-50 border-b border-gray-100">All Categories</button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat.name); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsSkillsOpen(!isSkillsOpen);
                  setIsCategoryOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${selectedSkill ? 'border-primary bg-blue-50 text-primary' : 'border-[#E5E7EB] text-[#374151] hover:bg-gray-50'}`}
              >
                <span>{selectedSkill || "Skills"}</span>
                {skillsLoading ? (
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                ) : (
                  <svg className={`transition-transform ${isSkillsOpen ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {isSkillsOpen && (
                <div className="absolute mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-2 z-50 max-h-60 overflow-y-auto">
                  <button onClick={() => { setSelectedSkill(""); setIsSkillsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-primary font-medium hover:bg-blue-50 border-b border-gray-100">
                    All Skills
                  </button>
                  {skills.map((skill) => (
                    <button key={skill.id} onClick={() => { setSelectedSkill(skill.name); setIsSkillsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {skill.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {['Budget', 'Delivery'].map((name) => (
              <button key={name} className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-gray-50">
                {name}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 text-primary font-semibold text-sm">
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-sm text-[#6B7280] mb-8 font-medium">
          <span className="text-[#111827] font-bold">{data?.count || 0}</span> jobs found
          {selectedCategory && <span className="ml-2 bg-blue-100 text-primary px-2 py-0.5 rounded text-xs">Category: {selectedCategory}</span>}
          {selectedSkill && <span className="ml-2 bg-indigo-100 text-indigo-600 p-2  rounded-lg text-xs">Skill: {selectedSkill}</span>}
          {appliedSearch && <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Search: "{appliedSearch}"</span>}
        </p>

        {isLoading ? (
          <div className="p-20 text-center text-gray-500">Loading jobs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.length > 0 ? (
              projects.map((job) => (
                <Link key={job.id} to={`/freelancer/jobs/${job.id}`}>
                  <JobCard
                    category={job.category_name}
                    title={job.title}
                    description={job.description}
                    priceRange={job.pricing_type === 'fixed' ? `$${job.fixed_price}` : `$${job.min_budget}-$${job.max_budget}`}
                    duration={`${job.delivery_days} days`}
                    skills={job.skills || []}
                  />
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-500">No projects found</p>
                  <p className="text-sm">
                    {selectedCategory && !selectedSkill && !appliedSearch && `No projects in "${selectedCategory}"`}
                    {selectedSkill && !selectedCategory && !appliedSearch && `No projects requiring "${selectedSkill}"`}
                    {appliedSearch && `No results for "${appliedSearch}" with current filters.`}
                    {!appliedSearch && selectedCategory && selectedSkill && `No projects match both "${selectedCategory}" and "${selectedSkill}"`}
                  </p>
                  <button onClick={clearAllFilters} className="mt-4 text-blue-500 font-semibold hover:underline">
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}