import React, { useState } from "react";
import { Calendar, Building2, MapPin, Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useClientReviews, useProfile } from "./profileQueries"; 
import { Link } from "react-router-dom";

export default function ProfileOverview() {
  const [page, setPage] = useState(1);
  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
  
  const { 
    data: reviewsData, 
    isLoading: reviewsLoading, 
    isFetching 
  } = useClientReviews(profile?.id, page);
  
  const reviews = reviewsData?.results || [];
  const hasNext = !!reviewsData?.next;
  const hasPrev = !!reviewsData?.previous;
  const totalCount = reviewsData?.count || 0;

  if (profileLoading) return <div className="p-8 text-gray-500">Loading profile...</div>;
  if (profileError) return <div className="p-8 text-red-500">Failed to load profile</div>;

  const {
    full_name, email, profile_photo, company_name,
    location, categories, joined_at, average_rating, review_count,
  } = profile;

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-[26px] font-bold text-gray-900 mb-2">Profile Overview</h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <img
              src={profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}`}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{full_name}</h2>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-gray-600">{email}</p>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-gray-900">{Number(average_rating || 0).toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({review_count || 0} reviews)</span>
                    </div>
                  </div>
                </div>
                <Link to="/profile/edit" className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
                  Edit Profile
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Member since {joined_at ? new Date(joined_at).toLocaleDateString() : "—"}</span>
                </div>
                {company_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{company_name}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-6">Skills & Interests</h3>
          {categories?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat} className="px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-500 text-xs font-medium">
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">You haven’t added any skills or interests yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-semibold text-gray-900">Recent Client Reviews ({totalCount})</h3>
            {isFetching && <span className="text-[10px] text-blue-500 font-bold uppercase animate-pulse">Refreshing...</span>}
          </div>
          
          {reviewsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-gray-50 rounded-lg" />
              <div className="h-24 bg-gray-50 rounded-lg" />
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={review.reviewer_photo || `https://ui-avatars.com/api/?name=${review.reviewer_name}`} 
                        className="w-8 h-8 rounded-full object-cover" 
                        alt="" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{review.reviewer_name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">"{review.comment}"</p>
                  </div>
                ))}
              </div>

              {(hasPrev || hasNext) && (
                <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-50">
                  <button
                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                    disabled={!hasPrev}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Page {page}
                  </span>
                  <button
                    onClick={() => setPage(old => (hasNext ? old + 1 : old))}
                    disabled={!hasNext}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">No reviews yet as a client.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}