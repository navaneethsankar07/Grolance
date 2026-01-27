import React from "react";
import { Star, Calendar, Briefcase, Clock, Check, Edit3, Eye, CreditCard } from "lucide-react";
import { useFreelancerProfile } from "./profileQueries";
import { formatDateDMY } from "../../../utils/date";
import { Link } from "react-router-dom";

export default function Profile() {
  const { data: profile, isLoading, isError, error } = useFreelancerProfile();

  console.log(profile);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error?.response?.data?.detail || "Failed to load profile"}
      </div>
    );
  }

  if (!profile) return null;

  const reviews = [
    {
      id: 1,
      name: "Michael Chen",
      rating: 5,
      date: "2 weeks ago",
      comment: "Outstanding work! Sarah delivered a beautiful, responsive website that exceeded our expectations. Communication was excellent throughout the project."
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      rating: 5,
      date: "1 month ago",
      comment: "Highly professional and talented developer. The UI/UX design was modern and user-friendly. Will definitely work with her again!"
    },
    {
      id: 3,
      name: "David Thompson",
      rating: 4,
      date: "2 months ago",
      comment: "Great experience working with Sarah. She was responsive to feedback and delivered quality work on time."
    }
  ];

  const date = formatDateDMY(profile.created_at);

  const renderDescription = (desc) => {
    if (!desc) return null;
    const features = Array.isArray(desc) ? desc : desc.split("\n").filter(line => line.trim() !== "");
    return features.map((feature, i) => (
      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
        <Check size={14} className="text-green-500 font-bold" /> {feature}
      </li>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm">View and manage your freelance professional profile.</p>
          </div>

          <div className="flex gap-3">
            <Link 
  to={'/freelancer/settings/payment'} 
  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all shadow-sm"
>
  <CreditCard size={16} /> Bank Details
</Link>
            <Link to={'/freelancer/profile/earnings-overview'} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all shadow-sm">
              <Eye size={16} /> View Earnings
            </Link>
            <Link to={'edit/'} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-all shadow-sm">
              <Edit3 size={16} /> Edit Profile
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img 
              src={profile.profile_photo}
              alt={profile.full_name} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-gray-50"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                  <p className="text-blue-600 font-medium">{profile.tagline}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 self-center md:self-start">
                  Available
                </span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-20 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="font-bold text-gray-900">4.9</span>
                  <span>(127 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span className="text-black">Member since:</span> {date}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  <span>{profile.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Your Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-gray-800 mb-2 text-lg">Starter Package</h4>
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-2xl font-bold text-gray-900">${profile.packages?.starter?.price || 0}</div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock size={14} /> {profile.packages?.starter?.delivery_days || 0} days delivery
                </div>
              </div>
              <ul className="space-y-3">
                {renderDescription(profile.packages?.starter?.description)}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-gray-800 mb-2 text-lg">Pro Package</h4>
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-2xl font-bold text-gray-900">${profile.packages?.pro?.price || 0}</div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock size={14} /> {profile.packages?.pro?.delivery_days || 0} days delivery
                </div>
              </div>
              <ul className="space-y-3">
                {renderDescription(profile.packages?.pro?.description)}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {profile.portfolios?.length > 0 ? (
              profile.portfolios.map((item) => (
                <div key={item.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic text-sm">No portfolio items added yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">About Me</h3>
          <div className="text-gray-600 text-sm leading-relaxed space-y-4">
            <p>{profile.bio || "No bio provided yet."}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Client Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}