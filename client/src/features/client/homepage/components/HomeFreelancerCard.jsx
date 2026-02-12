import { Star, Send } from "lucide-react";
import {Link} from 'react-router-dom'

export default function HomeFreelancerCard({freelancer}) {
  if (!freelancer) return null;

  const displaySkills = freelancer.skills?.slice(0, 3) || [];
 
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex gap-4 sm:gap-6 flex-1">
        <div className="shrink-0">
          <img
            src={freelancer.profile_photo ||'computer-worker.png' }
            alt={freelancer.full_name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-blue-50"
          />
        </div>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <h3 className="text-[#111827] font-inter text-xl sm:text-2xl font-bold leading-tight sm:leading-8">
            {freelancer.full_name}
          </h3>
          <p className="text-[#4B5563] font-inter text-sm sm:text-base leading-6 font-medium">
            {freelancer.tagline}
          </p>
          <p className="text-[#4B5563] font-inter text-sm sm:text-base leading-relaxed mt-2 line-clamp-2">
            {freelancer.bio}
          </p>

          <div className="flex gap-2 mt-4 sm:mt-6 flex-wrap">
            {displaySkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-primary rounded-full text-xs sm:text-sm font-semibold"
              >
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500 text-yellow-500" />
              <span className="text-[#111827] font-bold text-sm sm:text-base">
                {Number(freelancer.average_rating).toFixed(1)}
              </span>
              <span className="text-[#6B7280] text-sm sm:text-base">
                ({freelancer.review_count || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-56 flex flex-col gap-3 sm:gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
        <div className="flex items-end gap-1">
          <span className="text-[#111827] font-bold text-2xl sm:text-[30px] leading-tight sm:leading-9">
            ${freelancer.starting_price || '0'}
          </span>
          <span className="text-[#6B7280] text-sm sm:text-base leading-6 mb-0.5 sm:mb-1">
            / project
          </span>
        </div>
        <p className="text-[#9CA3AF] text-xs sm:text-sm">Starting price</p>

        <Link
          to={`/find-talents/${freelancer.id}`}
          className="border bg-primary text-white border-gray-300 mt-5 hover:bg-blue-600 text-[#374151] font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-center"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}