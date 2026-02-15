import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, MessageSquare } from "lucide-react";
import { useFreelancerReviews } from "./freelancerProfileQueries";
import { formatDateDMY } from "../../../utils/date";

export default function AllFreelancerReviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, isFetching } = useFreelancerReviews(id, page);

  const [allReviews, setAllReviews] = React.useState([]);

  React.useEffect(() => {
    if (data?.results) {
      setAllReviews((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
    }
  }, [data, page]);

  if (isLoading && page === 1) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Profile
        </button>

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">All Reviews</h1>
          <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-lg font-black text-gray-900">{data?.count || 0}</span>
            <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
          </div>
        </div>

        <div className="space-y-6">
          {allReviews.map((review, i) => (
            <div key={`${review.id}-${i}`} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {review.reviewer_photo ? (
                    <img src={review.reviewer_photo} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 text-sm">
                      {review.reviewer_name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-black text-gray-900 text-sm tracking-tight">{review.reviewer_name}</h4>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          size={12}
                          className={starIndex < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.project_title}</span>
                  <span className="text-[11px] font-bold text-gray-400">{formatDateDMY(review.created_at)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed italic">"{review.comment}"</p>
            </div>
          ))}
        </div>

        {data?.next && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={isFetching}
              className="px-8 py-4 bg-white border-2 border-primary text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              {isFetching ? "Loading..." : "Load More Reviews"}
            </button>
          </div>
        )}

        {allReviews.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}