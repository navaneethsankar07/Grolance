import React from 'react';
import { useOnBoarding } from '../OnBoardingContext';
import OnboardingLayout from '../../../../layouts/OnBoardingLayout';
import { useSelector } from 'react-redux';

function StepFive() {
  const { formData, nextStep } = useOnBoarding();
  const user = useSelector(state => state.auth.user);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <OnboardingLayout
      title="Review Your Profile"
      subtitle="This is how clients will see you. Take a moment to review."
    >
      <form id="onboarding-form" onSubmit={handleFinalSubmit}>
        <div className="space-y-6 md:space-y-8">
          
          <div className="relative p-5 md:p-8 border border-gray-100 rounded-2xl md:rounded-3xl bg-white shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-primary/10" />
            <div className="flex flex-col sm:flex-row gap-5 md:gap-8 items-center sm:items-start text-center sm:text-left">
              <div className="relative shrink-0">
                {user?.profile_photo ? (
                  <img className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover ring-4 ring-gray-50 shadow-sm" src={user.profile_photo} alt="Profile" />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-primary/20 to-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-primary border border-primary/10">
                    {formData.tagline?.charAt(0) || "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-green-500 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 md:border-4 border-white" />
              </div>

              <div className="flex-1 space-y-3 w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight truncate">
                    {user?.full_name} <span className="text-gray-400 font-medium">[Freelancer]</span>
                  </h2>
                  <span className="inline-block self-center sm:self-auto px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
                    {formData.experienceLevel}
                  </span>
                </div>
                <div className="w-full">
                  <p className="text-base md:text-lg font-bold text-primary leading-tight truncate">
                    {formData.tagline || "No tagline added"}
                  </p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl line-clamp-3">
                  {formData.bio || "No bio added"}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 pt-1">
                  <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-gray-400 uppercase">
                    <span className="w-2 h-2 bg-gray-300 rounded-full" />
                    {formData.phone || "No phone provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1">
               <div className="p-5 md:p-6 border border-gray-100 rounded-[20px] bg-gray-50/50 h-full">
                  <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Core Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills?.map((skill) => (
                      <span key={skill} className="px-3 md:px-4 py-1.5 md:py-2 bg-white border border-gray-200 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold text-gray-700 shadow-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['starter', 'pro'].map((tier) => (
                <div key={tier} className="relative p-5 md:p-6 bg-white border border-gray-100 rounded-[20px] shadow-xs group hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{tier} Plan</h3>
                      <p className="text-lg md:text-xl font-black text-gray-900">${formData.packages[tier].price}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                       <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6 h-12 line-clamp-3">
                    {formData.packages[tier].description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] md:text-[11px] font-bold text-gray-900 italic">
                      {formData.packages[tier].deliveryTime} Days Delivery
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight whitespace-nowrap">Portfolio Gallery</h3>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {formData.portfolios?.map((item, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-[20px] border border-gray-100 shadow-xs bg-gray-50">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={item.title} 
                      />
                    ) : item.files?.[0] ? (
                      <img 
                        src={URL.createObjectURL(item.files[0])} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={item.title} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5 line-clamp-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </form>
    </OnboardingLayout>
  );
}

export default StepFive;