import { Star } from "lucide-react";
import { Link } from 'react-router-dom';

export default function HomeFreelancerCard({freelancer}) {
  if (!freelancer) return null;

  const displaySkills = freelancer.skills?.slice(0, 3) || [];
 
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex flex-row gap-4 sm:gap-6 flex-1">
        <div className="shrink-0">
          <img
            src={freelancer.profile_photo || 'computer-worker.png'}
            alt={freelancer.full_name}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-blue-50"
          />
        </div>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <h3 className="text-[#111827] font-inter text-lg sm:text-2xl font-bold leading-tight">
            {freelancer.full_name}
          </h3>
          <p className="text-[#4B5563] font-inter text-xs sm:text-base font-medium">
            {freelancer.tagline}
          </p>
          <p className="text-[#4B5563] font-inter text-sm leading-relaxed mt-2 line-clamp-2 md:line-clamp-3">
            {freelancer.bio}
          </p>

          <div className="flex gap-2 mt-3 sm:mt-5 flex-wrap">
            {displaySkills.map((skill, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] sm:text-sm font-semibold"
              >
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-[#111827] font-bold text-sm">
                {Number(freelancer.average_rating).toFixed(1)}
              </span>
              <span className="text-[#6B7280] text-xs sm:text-sm">
                ({freelancer.review_count || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-56 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-3 sm:gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
        <div className="flex flex-col">
          <div className="flex items-end gap-1">
            <span className="text-[#111827] font-bold text-xl sm:text-[28px] leading-none">
              ${freelancer.starting_price || '0'}
            </span>
            <span className="text-[#6B7280] text-xs sm:text-sm mb-0.5">
              / project
            </span>
          </div>
          <p className="text-[#9CA3AF] text-[10px] sm:text-xs">Starting price</p>
        </div>

        <Link
          to={`/find-talents/${freelancer.id}`}
          className="bg-primary text-white hover:bg-blue-600 font-semibold text-sm sm:text-base py-2 px-6 lg:w-full rounded-lg transition-colors text-center"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}