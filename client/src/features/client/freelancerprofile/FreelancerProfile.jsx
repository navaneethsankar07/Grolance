import React from "react";
import { Link, useParams } from "react-router-dom";
import {Star, Clock, Truck, Check, Calendar, LayoutGrid } from "lucide-react";
import { useClientFreelancerProfile } from "./freelancerProfileQueries";
import { useModal } from "../../../hooks/modal/useModalStore";
import { formatDateDMY } from "../../../utils/date";

function PackageOption({ title, price, features, isPopular = false }) {
  return (
    <div className={`relative flex flex-col p-8 rounded-2xl border ${isPopular ? "border-blue-600 ring-1 ring-blue-600" : "border-gray-200"}`}>
      {isPopular && (
        <div className="absolute -top-3 right-8 px-4 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-widest">
          Popular
        </div>
      )}
      <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      <div className="flex items-baseline gap-1 mt-4 mb-8">
        <span className="text-3xl font-extrabold text-gray-900">${price}</span>
        <span className="text-gray-500 text-sm">/ project</span>
      </div>
      <div className="space-y-4 flex-1">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
            </div>
            <span className="text-sm text-gray-600">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function FreelancerProfile() {
  const { id } = useParams();
  const { data: freelancer, isLoading, isError } = useClientFreelancerProfile(id);
const { openModal } = useModal();
console.log(freelancer);

const handleInviteClick = () => {
  const packageArray = freelancer.packages 
    ? Object.entries(freelancer.packages).map(([type, details]) => ({
        ...details,
        package_type: type,
        id: details.id || type 
      }))
    : [];
  openModal('job-invitation', {
    freelancerId: id,
    packages: packageArray
  });
};


  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>;
  if (isError || !freelancer) return <div className="min-h-screen flex items-center justify-center">Profile Not Found</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-gray-900 mb-12">About This Freelancer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
              <img src={freelancer.profile_photo || "/default-avatar.png"} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md" alt="" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">{freelancer.full_name}</h2>
              <p className="text-gray-500 text-sm font-medium">{freelancer.tagline}</p>
              <div className="flex items-center justify-center gap-1 mt-2 mb-6">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-700">5.0</span>
                <span className="text-sm text-gray-400 font-medium">(24 Reviews)</span>
              </div>
              <button onClick={handleInviteClick} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Invite to job
              </button>

              <div className="mt-8 space-y-5 text-left border-t border-gray-50 pt-8">
                <div className="flex items-center gap-3 text-gray-400">
                  <LayoutGrid className="w-4 h-4" />
                  <div className="text-xs font-semibold uppercase tracking-wider">Category <span className="block text-gray-900 normal-case mt-0.5">{freelancer.category}</span></div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <div className="text-xs font-semibold uppercase tracking-wider">Member Since <span className="block text-gray-900 normal-case mt-0.5">{freelancer.created_at?formatDateDMY(freelancer.created_at):'June 2021'}</span></div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <div className="text-xs font-semibold uppercase tracking-wider">Availability <span className="block text-green-600 normal-case mt-0.5 font-bold">{freelancer.availability?'Available':'Unavailable'}</span></div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Truck className="w-4 h-4" />
                  <div className="text-xs font-semibold uppercase tracking-wider">Completed Projects Count <span className="block text-gray-900 normal-case mt-0.5">{freelancer.completed_projects_count}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills?.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-lg border border-gray-100 capitalize">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-8">
            <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-500 leading-relaxed text-sm whitespace-pre-wrap">{freelancer.bio}</p>
            </section>

            <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-8">Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {freelancer.portfolios?.map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    </div>
                    <h4 className="mt-4 font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-medium mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-8">Select a Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {freelancer.packages && Object.entries(freelancer.packages).map(([type, pkg]) => (
                  <PackageOption
                    key={type}
                    title={`${type} Package`}
                    price={pkg.price}
                    isPopular={type.toLowerCase() === "pro" || type.toLowerCase() === "standard"}
                    features={[
                      ...(Array.isArray(pkg.description) ? pkg.description : [pkg.description]),
                      `${pkg.delivery_days} Days Delivery`
                    ]}
                  />
                ))}
              </div>
            </section>

            <div className="bg-[#E9F0FF] rounded-[2.5rem] p-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Ready to start your project?</h3>
                <p className="text-gray-500 text-sm">Let's collaborate to create something amazing. Invite me to your job today!</p>
              </div>
              <button onClick={handleInviteClick} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                Invite to Job
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}