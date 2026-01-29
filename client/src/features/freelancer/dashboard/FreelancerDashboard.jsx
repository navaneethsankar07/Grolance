import React from 'react'
import Invitations from './components/Invitations';
import TodoList from './components/TodoList';
import ActiveContacts from './components/ActiveContacts';
import JobRecommendation from './components/JobRecommendation';
import { Link } from 'react-router-dom';

function FreelancerDashboard() {
  return (
    <div className="max-w-400 mt-5 mx-auto mb-10">
      <div className="bg-[#EFF6FF] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between mb-8 border border-blue-100">
        <div className="flex flex-col gap-2">
          <h1 className="text-[30px] font-bold text-[#1E293B] leading-9" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome Back to Grolance
          </h1>
          <p className="text-base font-normal text-[#64748B] leading-6 max-w-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your personalized freelance workspace is ready. You have 3 new opportunities waiting.
          </p>
          <div className="flex items-center gap-5 mt-4">
            <Link to={'jobs'} className="bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold text-base shadow-sm hover:bg-[#4338CA] transition-all">
              Find Work
            </Link>
            <Link to={'profile'} className="bg-white text-[#334155] px-6 py-2.5 rounded-lg font-semibold text-base border border-[#E2E8F0] hover:bg-gray-50 transition-all">
              View Profile
            </Link>
          </div>
        </div>
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/51330fa538d711eb51ff769fccc6fef3cdf2a326?width=698" 
          alt="Team collaboration" 
          className="w-full max-w-[349px] h-auto rounded-[20px] object-cover mt-6 md:mt-0"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-8">
          <Invitations />
          <ActiveContacts />
          <JobRecommendation/>
        </div>

        <div className="lg:col-span-1 sticky top-6">
          <TodoList />
        </div>

      </div>
    </div>
  );
}

export default FreelancerDashboard;