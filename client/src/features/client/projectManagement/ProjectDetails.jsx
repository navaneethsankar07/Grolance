import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectDetails } from './projectQueries';
import { Edit, Users, Clock, Box, IndianRupee, FileText } from 'lucide-react';

export default function ClientJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useProjectDetails(id);

  const isProjectInProgress = data?.status === "in_progress" || data?.status === "in-progress";

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
            <div className="flex justify-between items-start mb-4">
               <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {data.title}
              </h1>
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                isProjectInProgress ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {data.status === 'in_progress' ? 'In Progress' : data.status}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Project Description</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>{data.description}</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Deliverables</h2>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <IndianRupee className="w-5 h-5" />
                  <span>Budget</span>
                </div>
                <span className="font-semibold text-gray-900">
                   {data.pricing_type === 'fixed' ? `₹${data.fixed_price}` : `₹${data.min_budget} - ₹${data.max_budget}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <span>Timeline</span>
                </div>
                <span className="font-semibold text-gray-900">{data.delivery_days} days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Box className="w-5 h-5" />
                  <span>Category</span>
                </div>
                <span className="font-semibold text-gray-900 capitalize">{data.category_name || 'General'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isProjectInProgress ? (
              <button 
                onClick={() => navigate(`/contracts/${data.contract_id}`)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-100"
              >
                <FileText className="w-5 h-5" />
                Go to Contract
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate(`/my-projects/${id}/proposals`)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-100"
                >
                  <Users className="w-5 h-5" />
                  View Proposals
                </button>
                
                <button 
                  onClick={() => navigate(`/my-projects/${id}/edit`)}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Edit Project
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}