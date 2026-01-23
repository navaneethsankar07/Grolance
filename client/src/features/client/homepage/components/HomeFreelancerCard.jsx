import { Star, Send } from "lucide-react";

export default function HomeFreelancerCard() {
  const details = {
    name: "Alex Morgan",
    title: "Senior Digital Marketing Specialist",
    description:
      "I help eCommerce brands scale from 6 to 7 figures using data-driven PPC strategies. Certified Google Partner with over $5M in ad spend managed. Let's optimize your...",
    skills: ["Google Ads", "Facebook Ads", "Copywriting"],
    rating: 5.0,
    reviews: 142,
    price: "$1200",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/9911d41260a8c606e9de17865bfcefb2feaf82be?width=192",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4 sm:gap-6 flex-1">
        <div className="shrink-0">
          <img
            src={details.image}
            alt={details.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <h3 className="text-[#111827] font-inter text-xl sm:text-2xl font-bold leading-tight sm:leading-8">
            {details.name}
          </h3>
          <p className="text-[#4B5563] font-inter text-sm sm:text-base leading-6">
            {details.title}
          </p>
          <p className="text-[#4B5563] font-inter text-sm sm:text-base leading-relaxed sm:leading-[26px] mt-2">
            {details.description}
          </p>

          <div className="flex gap-2 mt-4 sm:mt-6 flex-wrap">
            {details.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-[#374151] rounded-full text-xs sm:text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500 text-yellow-500" />
              <span className="text-[#111827] font-bold text-sm sm:text-base">
                {details.rating}
              </span>
              <span className="text-[#6B7280] text-sm sm:text-base">
                ({details.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-56 flex flex-col gap-3 sm:gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
        <div className="flex items-end gap-1">
          <span className="text-[#111827] font-bold text-2xl sm:text-[30px] leading-tight sm:leading-9">
            {details.price}
          </span>
          <span className="text-[#6B7280] text-sm sm:text-base leading-6 mb-0.5 sm:mb-1">
            / project
          </span>
        </div>
        <p className="text-[#9CA3AF] text-xs sm:text-sm">Starting price</p>

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <span>Invite to Job</span>
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button className="border border-gray-300 hover:bg-gray-50 text-[#374151] font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}
