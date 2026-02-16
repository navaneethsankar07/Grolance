import React, { useState } from "react";
import { Calendar, Building2, MapPin, Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useClientReviews, useProfile } from "./profileQueries"; 
import {useSelector} from 'react-redux'
import { Link } from "react-router-dom";

export default function ProfileOverview() {
  const [page, setPage] = useState(1);
  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
  const user = useSelector(state=>state.auth.user)
  const { data: reviewsData, isLoading: reviewsLoading, isFetching } = useClientReviews(user?.id, page);
  
  const reviews = reviewsData?.results || [];
  const hasNext = !!reviewsData?.next;
  const hasPrev = !!reviewsData?.previous;
  const totalCount = reviewsData?.count || 0;

  if (profileLoading) return <div className="p-8 text-gray-500 animate-pulse font-medium">Loading profile...</div>;
  if (profileError) return <div className="p-8 text-red-500 font-medium">Failed to load profile</div>;

  const { full_name, email, profile_photo, company_name, location, categories, joined_at, average_rating, review_count } = profile;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl md:text-[26px] lg:mt-10 font-black text-gray-900 mb-2">Profile Overview</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=3B82F6&color=fff`}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white" />
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-1">{full_name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <p className="text-sm text-gray-500 font-medium">{email}</p>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-amber-700">{Number(average_rating || 0).toFixed(1)}</span>
                      <span className="text-xs text-amber-600/60">({review_count})</span>
                    </div>
                  </div>
                </div>
                <Link to="/profile/edit" className="inline-flex justify-center px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-md">
                  Edit Profile
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {joined_at ? new Date(joined_at).toLocaleDateString() : "—"}</span>
                </div>
                {company_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-gray-600">{company_name}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-gray-600">{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full" />
            Skills & Interests
          </h3>
          {categories?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat} className="px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 text-xs font-bold transition-all hover:bg-white hover:border-blue-200 hover:text-blue-600">
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No skills listed yet.</p>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-600 rounded-full" />
              Reviews ({totalCount})
            </h3>
            {isFetching && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-black animate-pulse">SYNCING</span>}
          </div>
          
          {reviewsLoading ? (
            <div className="space-y-4">
              <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />
              <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={review.reviewer_photo || `https://ui-avatars.com/api/?name=${review.reviewer_name}&background=3B82F6&color=fff`} 
                        className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm" 
                        alt="" 
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-gray-900">{review.reviewer_name}</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed pl-2 border-l-2 border-gray-200">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>

              {(hasPrev || hasNext) && (
                <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                    disabled={!hasPrev}
                    className="p-2 border border-gray-200 rounded-xl disabled:opacity-20 hover:bg-gray-50 transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                    {page}
                  </span>
                  <button
                    onClick={() => setPage(old => (hasNext ? old + 1 : old))}
                    disabled={!hasNext}
                    className="p-2 border border-gray-200 rounded-xl disabled:opacity-20 hover:bg-gray-50 transition-all active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No reviews found</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}