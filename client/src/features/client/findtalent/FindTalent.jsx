import React, { useState, useRef } from "react";
import { Search, SlidersHorizontal, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FreelancerCard } from "./components/FreelancerCard";
import { useFreelancerList } from "./findTalentQueries";
import { useAllCategories } from "../projectManagement/projectQueries";

export default function FindTalent() {
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

    if (minVal !== null && maxVal !== null && maxVal < minVal) {
      alert("Max price cannot be less than min price");
      return;
    }

    if ((minVal !== null && minVal < 0) || (maxVal !== null && maxVal < 0)) {
      alert("Price cannot be negative");
      return;
    }

    setPage(1);
    setQueryParams({
      search: searchRef.current.value,
      category: categoryRef.current.value === "All Categories" ? "" : categoryRef.current.value,
      minPrice: minPriceRef.current.value,
      maxPrice: maxPriceRef.current.value,
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setQueryParams(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  const clearSearch = () => {
    searchRef.current.value = "";
    setPage(1);
    setQueryParams(prev => ({ ...prev, search: "", page: 1 }));
  };

  const resetFilters = () => {
    searchRef.current.value = "";
    minPriceRef.current.value = "";
    maxPriceRef.current.value = "";
    categoryRef.current.value = "All Categories";
    
    setPage(1);
    setQueryParams({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      page: 1
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Find & Hire Top <span className="text-blue-600">Talent</span>
            </h1>
            <div className="mt-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                ref={searchRef}
                type="text"
                onKeyDown={handleKeyDown}
                placeholder="Search by skill, name or job title..."
                className="block w-full pl-12 pr-12 py-4.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-900"
              />
              {searchRef.current?.value && (
                <button 
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Filter Talents</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <select 
                    ref={categoryRef}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-blue-500"
                  >
                    <option>All Categories</option>
                    {categories?.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Budget Range ($)</label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={minPriceRef}
                      type="number"
                      placeholder="Min"
                      onKeyDown={handleKeyDown}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      ref={maxPriceRef}
                      type="number"
                      placeholder="Max"
                      onKeyDown={handleKeyDown}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={handleApplyFilters} className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">Apply Filters</button>
                  <button onClick={resetFilters} className="w-full py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Clear All</button>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                Found <span className="font-bold text-gray-900">{data?.count || 0}</span> freelancers
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-48 w-full bg-gray-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6">
                  {data?.results?.map((freelancer) => (
                    <FreelancerCard
                      key={freelancer.id}
                      id={freelancer.id}
                      name={freelancer.full_name}
                      title={freelancer.tagline}
                      description={freelancer.bio}
                      imageUrl={freelancer.profile_photo}
                      skills={freelancer.skills}
                      rating={4.9} 
                      price={freelancer.starting_price}
                      packages={freelancer.packages}
                    />
                  ))}
                  
                  {data?.results?.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                      <p className="text-gray-500">No freelancers match your budget or criteria.</p>
                    </div>
                  )}
                </div>

                {data?.count > 0 && (
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-2">
                    <p className="text-sm text-gray-600">
                      Showing {data?.results?.length || 0} of {data?.count || 0} results
                    </p>
                    <nav className="flex items-center rounded-md shadow-sm">
                      <button 
                        disabled={!data?.previous}
                        onClick={() => handlePageChange(page - 1)}
                        className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="text-gray-400 w-5 h-5" />
                      </button>
                      <div className="h-9 px-4 bg-blue-600 text-white text-sm font-semibold flex items-center border-t border-b border-blue-600">
                        {page}
                      </div>
                      <button 
                        disabled={!data?.next}
                        onClick={() => handlePageChange(page + 1)}
                        className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="text-gray-400 w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}