import React, { useState, useRef } from "react";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { FreelancerCard } from "./components/FreelancerCard";
import { useFreelancerList } from "./findTalentQueries";

export default function FindTalent() {
  const searchRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const categoryRef = useRef(null);

  const [queryParams, setQueryParams] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data, isLoading } = useFreelancerList(queryParams);

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

    setQueryParams({
      search: searchRef.current.value,
      category: categoryRef.current.value,
      minPrice: minPriceRef.current.value,
      maxPrice: maxPriceRef.current.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  const resetFilters = () => {
    searchRef.current.value = "";
    minPriceRef.current.value = "";
    maxPriceRef.current.value = "";
    categoryRef.current.value = "";
    
    setQueryParams({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Find & Hire Top <span className="text-blue-600">Talent</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Explore thousands of verified professionals ready to start your next project.
            </p>

            <div className="mt-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                ref={searchRef}
                type="text"
                onKeyDown={handleKeyDown}
                placeholder="Search by skill, name or job title..."
                className="block w-full pl-12 pr-4 py-4.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-900"
              />
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
                    <option value="">All Categories</option>
                    <option value="web">Web Development</option>
                    <option value="design">Graphic Design</option>
                    <option value="marketing">Digital Marketing</option>
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
                  <button 
                    onClick={handleApplyFilters}
                    className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                  >
                    Apply Filters
                  </button>
                  <button 
                    onClick={resetFilters}
                    className="w-full py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Clear All
                  </button>
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}