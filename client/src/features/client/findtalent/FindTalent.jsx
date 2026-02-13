import React, { useState, useRef } from "react";
import { Search, SlidersHorizontal, ArrowLeft, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { FreelancerCard } from "./components/FreelancerCard";
import { useFreelancerList } from "./findTalentQueries";
import { useAllCategories } from "../projectManagement/projectQueries";

export default function FindTalent() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const searchRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const categoryRef = useRef(null);

  const [page, setPage] = useState(1);
  const [queryParams, setQueryParams] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    page: 1
  });

  const { data, isLoading } = useFreelancerList(queryParams);
  const { data: categories } = useAllCategories();

  const handleApplyFilters = () => {
    const minVal = minPriceRef.current.value ? parseFloat(minPriceRef.current.value) : null;
    const maxVal = maxPriceRef.current.value ? parseFloat(maxPriceRef.current.value) : null;
    
    if (minVal !== null && maxVal !== null && maxVal < minVal) { alert("Max price cannot be less than min price"); return; }
    if ((minVal !== null && minVal < 0) || (maxVal !== null && maxVal < 0)) { alert("Price cannot be negative"); return; }

    setPage(1);
    setQueryParams({
      search: searchValue,
      category: categoryRef.current.value === "All Categories" ? "" : categoryRef.current.value,
      minPrice: minPriceRef.current.value,
      maxPrice: maxPriceRef.current.value,
      page: 1
    });
    setShowMobileFilters(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setQueryParams(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e) => { 
    if (e.key === "Enter") handleApplyFilters(); 
  };

  const clearSearch = () => {
    setSearchValue("");
    setPage(1);
    setQueryParams(prev => ({ ...prev, search: "", page: 1 }));
    searchRef.current?.focus();
  };

  const resetFilters = () => {
    setSearchValue("");
    minPriceRef.current.value = ""; 
    maxPriceRef.current.value = ""; 
    categoryRef.current.value = "All Categories";
    setPage(1); 
    setQueryParams({ search: "", category: "", minPrice: "", maxPrice: "", page: 1 });
    setShowMobileFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Find & Hire Top <span className="text-blue-600">Talent</span>
            </h1>
            <div className="mt-6 md:mt-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                ref={searchRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search skill, name..."
                className="block w-full pl-11 pr-11 py-3.5 md:py-4.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm md:text-base text-gray-900"
              />
              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 bg-gray-100 rounded-full p-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`${showMobileFilters ? "block" : "hidden"} lg:block w-full lg:w-72 shrink-0 animate-in fade-in slide-in-from-top-4 lg:animate-none`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Filter Talents</h3>
                </div>
                <button onClick={() => setShowMobileFilters(false)} className="lg:hidden p-1">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <select ref={categoryRef} className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none">
                    <option>All Categories</option>
                    {categories?.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget Range ($)</label>
                  <div className="flex items-center gap-2">
                    <input ref={minPriceRef} type="number" placeholder="Min" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none" />
                    <input ref={maxPriceRef} type="number" placeholder="Max" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button onClick={handleApplyFilters} className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md">Apply Filters</button>
                  <button onClick={resetFilters} className="w-full py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl">Reset</button>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between px-1">
              <p className="text-gray-500 text-xs md:text-sm">
                Found <span className="font-bold text-gray-900">{data?.count || 0}</span> freelancers
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((n) => <div key={n} className="h-64 lg:h-48 w-full bg-white border border-gray-200 animate-pulse rounded-2xl" />)}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {data?.results?.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} {...freelancer} name={freelancer.full_name} title={freelancer.tagline} description={freelancer.bio} imageUrl={freelancer.profile_photo} price={freelancer.starting_price} rating={freelancer.average_rating} />
                ))}
                {data?.results?.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 mx-1">
                    <p className="text-gray-400 text-sm font-medium">No results found for your search.</p>
                  </div>
                )}

                {data?.count > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-4 pb-10">
                    <p className="text-xs text-gray-500">Showing {data?.results?.length} of {data?.count} results</p>
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button disabled={!data?.previous} onClick={() => handlePageChange(page - 1)} className="p-3 hover:bg-gray-50 disabled:opacity-30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                      <span className="px-6 py-3 bg-blue-50 text-blue-700 font-bold text-sm border-x border-gray-100">{page}</span>
                      <button disabled={!data?.next} onClick={() => handlePageChange(page + 1)} className="p-3 hover:bg-gray-50 disabled:opacity-30 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}