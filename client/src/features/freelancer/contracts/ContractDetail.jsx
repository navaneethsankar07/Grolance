import React from "react";
import { useParams } from "react-router-dom";
import { useContractDetail } from "./contractsQueries";
import { 
  FileText, Package, Clock, Calendar, Briefcase, Tag, 
  Upload, Download, X, MessageSquare, ShieldAlert, CheckCircle2 
} from "lucide-react";

export default function ContractDetail() {
  const { id } = useParams();
  const { data: contract, isLoading, isError } = useContractDetail(id);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading contract details.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1085px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-gray-900 leading-9 mb-2">Order Details</h1>
          <p className="text-sm text-gray-500 leading-6">Manage your ongoing freelance order and submit your work here.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[17px] font-semibold text-gray-900">Order Summary</h2>
            <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-medium rounded-full uppercase">
              {contract.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-x-12">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="text-sm font-semibold text-gray-900">#ORD-{contract.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 rounded bg-blue-200" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Client Name</p>
                <p className="text-sm font-semibold text-gray-900">{contract.client_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm font-semibold text-gray-900">{contract.project_category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-[15px] font-bold text-blue-600">₹</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Budget</p>
                <p className="text-sm font-semibold text-gray-900">₹{Number(contract.total_amount).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(contract.freelancer_signed_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-[17px] font-semibold text-gray-900 mb-6">Project Description</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">{contract.project_title}</h3>
              <div className="text-sm text-gray-700 leading-[26px]">
                <p>{contract.project_description}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Service Type</p>
                    <p className="text-sm font-medium text-gray-900">{contract.project_category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="w-full">
                    <p className="text-xs text-gray-500 mb-2">Skills Involved</p>
                    <div className="flex flex-wrap gap-2">
                      {contract.skills?.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-50 p-6">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Deliverables</h2>
            <p className="text-xs text-gray-500">Upload your work files here for client review.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="w-6 h-6 text-blue-600 mx-auto mb-4" />
              <p className="text-xs font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
              <p className="text-[10px] text-gray-500">ZIP, PDF, PNG or JPG (max. 50MB)</p>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
              Submit for Review
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-5 h-5" />
            Message Client
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
            <ShieldAlert className="w-5 h-5" />
            Raise Dispute
          </button>
        </div>
      </div>
    </div>
  );
}