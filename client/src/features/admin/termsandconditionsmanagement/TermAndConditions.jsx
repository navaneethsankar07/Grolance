import React, { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Trash2, Loader2, X, AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTermsSections } from "./termsQueries";
import { useTermsMutations } from "./temsMutations";

export default function TermsAndConditions() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { heading: "", description: "" }
  });

  const { data, isLoading } = useTermsSections(page);
  const { createMutation, updateMutation, deleteMutation } = useTermsMutations();

  const handleOpenModal = (section = null) => {
    if (section) {
      setSelectedSection(section);
      setValue("heading", section.heading);
      setValue("description", section.description);
    } else {
      setSelectedSection(null);
      reset({ heading: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    if (selectedSection) {
      updateMutation.mutate({ id: selectedSection.id, ...formData }, {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedSection.id, {
      onSuccess: () => setIsDeleteModalOpen(false)
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-16">
        <Link to="/admin/settings" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back to settings</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-[26px] font-bold text-gray-900 leading-tight mb-2">Terms & Conditions</h1>
            <p className="text-sm text-gray-600">Manage all sections of your terms and conditions.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors h-10 w-full sm:w-auto"
          >
            Add Section
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] md:min-w-full">
              <div className="grid grid-cols-[80px_200px_1fr_120px] bg-gray-50 border-b border-gray-200">
                <div className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider"># ID</div>
                <div className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Heading</div>
                <div className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description Preview</div>
                <div className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>

              {data?.results?.map((section, index) => (
                <div key={section.id} className={`grid grid-cols-[80px_200px_1fr_120px] border-b border-gray-200 last:border-b-0 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <div className="px-6 py-6 flex items-center text-xs text-gray-500 font-mono">#{section.id}</div>
                  <div className="px-6 py-6 flex items-center min-w-0 overflow-hidden">
                    <div className="text-xs font-bold text-gray-900 break-words line-clamp-6">
                      {section.heading}
                    </div>
                  </div>
                  <div className="px-6 py-6 flex items-center min-w-0">
                    <p className="text-xs text-gray-600 line-clamp-25 leading-relaxed break-words">{section.description}</p>
                  </div>
                  <div className="px-6 py-6 flex items-center justify-end gap-2 shrink-0">
                    <button onClick={() => handleOpenModal(section)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => { setSelectedSection(section); setIsDeleteModalOpen(true); }}
                      className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
    Showing {data?.results?.length || 0} of {data?.count || 0} Records
  </div>
  <nav className="flex items-center rounded-md shadow-sm">
    <button
      disabled={!data?.previous}
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      <ChevronLeft className="text-gray-400 w-5 h-5" />
    </button>
    <div className="h-9 px-4 bg-primary text-white text-sm font-semibold flex items-center border-t border-b border-primary">
      {page}
    </div>
    <button
      disabled={!data?.next}
      onClick={() => setPage((p) => p + 1)}
      className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      <ChevronRight className="text-gray-400 w-5 h-5" />
    </button>
  </nav>
</div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50 shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-widest">{selectedSection ? "Edit Section" : "Add New Section"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Section Heading</label>
                <input 
                  type="text" 
                  {...register("heading", { required: "Heading is required", maxLength: { value: 255, message: "Max length 255 chars" } })}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${errors.heading ? 'border-red-500' : ''}`} 
                />
                {errors.heading && <p className="text-[10px] text-red-500 mt-1">{errors.heading.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Description Content</label>
                <textarea 
                  rows={8}
                  {...register("description", { required: "Description is required" })}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-[10px] text-red-500 mt-1">{errors.description.message}</p>}
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors">
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Section?</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Are you sure you want to remove "{selectedSection?.heading}"? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="order-2 sm:order-1 flex-1 py-2.5 border rounded-lg text-xs font-bold uppercase">Cancel</button>
              <button 
                onClick={confirmDelete}
                className="order-1 sm:order-2 flex-1 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}