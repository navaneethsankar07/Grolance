import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from './jobDetailsQueries';

export default function JobDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useProjectDetails(id);

  if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-600">Loading Project details...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;

  const formatList = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== "");
  };
console.log(data);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-2/3">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Project</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>{data.description}</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What You'll Deliver</h2>
            <ul className="space-y-3">
              {formatList(data.expected_deliverables).map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-3">
              {formatList(data.requirements).map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Job Info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Budget</span>
                </div>
                <span className="font-semibold text-gray-900">
                   {data.pricing_type === 'fixed' ? `$${data.fixed_price}` : `$${data.min_budget} - $${data.max_budget}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Delivery</span>
                </div>
                <span className="font-semibold text-gray-900">{data.delivery_days} days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span>Type</span>
                </div>
                <span className="font-semibold text-gray-900 capitalize">{data.pricing_type} Price</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Client</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                {data.profile_photo ? (
                  <img src={data.client_info.profile_photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  data.client_info?.full_name?.charAt(0) || "C"
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">{data.client_info?.full_name}</p>
                <p className="text-sm text-gray-500">Member since {data.client_info?.member_since}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900">4.8</span>
              <span className="text-sm text-gray-500">({data.client_info?.total_jobs_posted} jobs posted)</span>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-100">
            Apply to This Job
          </button>
        </div>

      </div>
    </div>
  );
}