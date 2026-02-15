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
const getAvatarColor = (name) => {
  const colors = [
  "bg-slate-700",   
  "bg-primary",   
  "bg-indigo-900",  
  "bg-teal-800",   
  "bg-cyan-900",    
  "bg-emerald-800", 
  "bg-violet-800",  
  "bg-zinc-700",   
  "bg-sky-800",     
];
  if (!name) return 'bg-gray-500';
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const avatarBg = getAvatarColor(name);
return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col lg:flex-row gap-5 p-5 md:p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      {/* Top Section: Avatar & Info */}
      <div className="flex gap-4 md:gap-6 flex-1">
        <div className="relative shrink-0">
          <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-xl md:rounded-2xl shadow-inner overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full ${avatarBg} flex items-center justify-center text-white text-xl md:text-3xl lg:text-4xl font-bold`}>
                {name ? name[0] : "?"}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 md:border-4 border-white w-4 h-4 md:w-6 md:h-6 rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h2 className="text-base md:text-xl font-bold text-gray-900 group-hover:text-blue-600 truncate transition-colors">
              {name}
            </h2>
            <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 shrink-0" />
          </div>
          <p className="text-xs md:text-sm font-semibold text-blue-600 mb-2 md:mb-3 line-clamp-1">{title}</p>
          
          <div className="hidden md:flex items-center gap-1 mb-3">
             <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
             <span className="font-bold text-gray-900 text-xs md:text-sm">{rating}</span>
          </div>

          <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2 md:mb-4">
            {description}
          </p>

          <div className="hidden md:flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] md:text-xs font-medium rounded-lg border border-gray-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only Stats/Skills Row */}
      <div className="flex md:hidden items-center justify-between py-1 border-y border-gray-50">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-gray-900 text-sm">{rating}</span>
        </div>
        <div className="flex gap-1">
          {skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-md border border-gray-100">{skill}</span>
          ))}
        </div>
      </div>

      {/* Pricing & Actions Section */}
      <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end w-full lg:w-48 lg:border-l lg:pl-6 border-gray-100 gap-4 mt-2 lg:mt-0">
        <div className="text-left lg:text-right">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest lg:mb-1">Starting at</p>
          <span className="text-xl md:text-2xl font-black text-gray-900">{currency}{price}</span>
        </div>

        <div className="flex flex-row lg:flex-col gap-2 flex-1 lg:flex-none justify-end w-full max-w-[240px] lg:max-w-none">
          <button 
            onClick={handleHireClick}
            className="flex-1 lg:w-full py-2.5 md:py-3 rounded-xl bg-blue-600 text-white text-xs md:text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
          >
            Hire Now
            <Send className="w-3 h-3 md:w-3.5 md:h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}