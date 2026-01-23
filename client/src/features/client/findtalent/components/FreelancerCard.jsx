import React, { useState } from "react";
import { Send, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/modal/useModalStore";
import { getFreelancerDetails } from "../findTalentApi";


export function FreelancerCard({
  id,
  name,
  title,
  description,
  imageUrl,
  skills = [],
  rating = 5.0,
  price,
  currency = "$",
  packages = []
}) {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [isFetching, setIsFetching] = useState(false);
  const handleCardClick = () => {
    navigate(`/find-talents/${id}`);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action === 'profile') {
      navigate(`/freelancer/profile/${id}`);
    } 
  };

  const handleHireClick = async (e) => {
    e.stopPropagation();
    setIsFetching(true);

    try {
      const profileData = await getFreelancerDetails(id);
      
            const packageArray = profileData.packages 
        ? Object.entries(profileData.packages).map(([type, details]) => ({
            ...details,
            package_type: type,
            id: details.id 
          }))
        : [];

      openModal('job-invitation', {
        freelancerId: id,
        packages: packageArray 
      });
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      alert("Could not load freelancer packages. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };
console.log(packages)

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col lg:flex-row items-start gap-6 p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
    >
      <div className="relative shrink-0">
        <img
          src={imageUrl || "/default-avatar.png"}
          alt={name}
          className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-inner"
        />
        <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-6 h-6 rounded-full" title="Available Now"></div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h2>
          <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />
        </div>

        <p className="text-sm font-semibold text-blue-600 mb-3">{title}</p>
        
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-xs text-gray-400 self-center">+{skills.length - 4} more</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-900">{rating}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end w-full lg:w-48 lg:border-l lg:pl-6 border-gray-100 min-h-[120px]">
        <div className="text-right w-full">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Starting at</p>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-black text-gray-900">{currency}{price}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-4">
          <button 
            onClick={(e) => handleActionClick(e, 'profile')}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all active:scale-95"
          >
            View Profile
          </button>
          <button 
            onClick={handleHireClick}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            Hire Now
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}