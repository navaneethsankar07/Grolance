import React from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Truck, Check, Calendar, LayoutGrid } from "lucide-react";
import { useClientFreelancerProfile } from "./freelancerProfileQueries";
import { useModal } from "../../../hooks/modal/useModalStore";
import { formatDateDMY } from "../../../utils/date";

function PackageOption({ title, price, features, isPopular = false }) {
  return (
    <div className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${isPopular ? "border-primary ring-1 ring-primary bg-white" : "border-gray-200 bg-white hover:border-gray-300"}`}>
      {isPopular && (
        <div className="absolute -top-3 right-8 px-4 py-1 rounded-full bg-primary text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-blue-200">
          Popular
        </div>
      )}
      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
      <div className="flex items-baseline gap-1 mt-2 mb-8">
        <span className="text-3xl font-black text-gray-900">${price}</span>
        <span className="text-gray-400 text-xs font-bold uppercase tracking-tight">/ Project</span>
      </div>
      <div className="space-y-4 flex-1">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
              <Check className="w-3 h-3 text-primary" strokeWidth={3} />
            </div>
            <span className="text-sm text-gray-600 font-medium leading-tight">{feature}</span>
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

  const handleInviteClick = () => {
    const packageArray = freelancer?.packages 
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

  if (isLoading) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Profile</p>
      </div>
    </div>
  );

  if (isError || !freelancer) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-gray-500 font-bold">
      Profile Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-10 tracking-tight">About This Freelancer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 xl:gap-12 items-start">
          <aside className="lg:sticky lg:top-20 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
              <div className="relative inline-block">
                {freelancer?.profile_photo ? (
                  <img src={freelancer.profile_photo} className="w-32 h-32 rounded-2xl mx-auto object-cover border-4 border-white shadow-xl" alt="" />
                ) : (
                  <div className="w-32 h-32 bg-primary text-white font-black flex justify-center items-center text-4xl rounded-3xl mx-auto shadow-xl">
                    {freelancer.full_name[0]}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
              </div>

              <h2 className="mt-6 text-xl font-black text-gray-900 tracking-tight">{freelancer.full_name}</h2>
              <p className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-tighter">{freelancer.tagline}</p>
              
              <div className="flex items-center justify-center gap-1.5 mt-3 mb-8">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-black text-gray-900">5.0</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">(24 Reviews)</span>
              </div>

              <button 
                onClick={handleInviteClick} 
                className="w-full py-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
              >
                Invite to job
              </button>

              <div className="mt-8 space-y-6 text-left border-t border-gray-100 pt-8">
                <div className="flex items-start gap-4 text-gray-400">
                  <LayoutGrid className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Category</div>
                    <span className="block text-sm text-gray-900 font-bold mt-0.5">{freelancer.category}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-gray-400">
                  <Calendar className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Member Since</div>
                    <span className="block text-sm text-gray-900 font-bold mt-0.5">
                      {freelancer.created_at ? formatDateDMY(freelancer.created_at) : 'June 2021'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-gray-400">
                  <Clock className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Availability</div>
                    <span className="block text-sm text-green-600 font-black mt-0.5">
                      {freelancer.availability ? 'OPEN FOR PROJECTS' : 'UNAVAILABLE'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-gray-400">
                  <Truck className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Completed Projects</div>
                    <span className="block text-sm text-gray-900 font-bold mt-0.5">{freelancer.completed_projects_count} Records</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Expertise & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills?.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#F8F9FB] text-gray-600 text-[11px] font-black rounded-xl border border-gray-200 uppercase tracking-tighter transition-colors hover:bg-gray-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-8 min-w-0">
            <section className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
              <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">About Me</h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base font-medium whitespace-pre-wrap">{freelancer.bio}</p>
            </section>

            <section className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
              <h3 className="text-lg font-black text-gray-900 mb-10 uppercase tracking-tight">Portfolio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {freelancer.portfolios?.map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="" />
                    </div>
                    <div className="mt-5 px-1">
                      <h4 className="font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mt-1 overflow-hidden">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
              <h3 className="text-lg font-black text-gray-900 mb-10 uppercase tracking-tight">Select a Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {freelancer.packages && Object.entries(freelancer.packages).map(([type, pkg]) => (
                  <PackageOption
                    key={type}
                    title={`${type} Package`}
                    price={pkg.price}
                    isPopular={type.toLowerCase() === "pro" || type.toLowerCase() === "standard"}
                    features={[
                      ...(Array.isArray(pkg.description) ? pkg.description : [pkg.description]),
                      `${pkg.delivery_days} Days Express Delivery`
                    ]}
                  />
                ))}
              </div>
            </section>

            <div className=" rounded-2xl p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl border border-gray-300">
              <div className="max-w-md">
                <h3 className="text-2xl lg:text-3xl font-black text-black mb-3 tracking-tight">Ready to start your project?</h3>
                <p className="text-gray-800 text-sm font-medium leading-relaxed uppercase tracking-widest text-[10px]">Strategic collaboration for exceptional results. Initiate contact for priority scheduling.</p>
              </div>
              <button 
                onClick={handleInviteClick} 
                className="whitespace-nowrap px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/40 active:scale-[0.98]"
              >
                Invite to Job
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}