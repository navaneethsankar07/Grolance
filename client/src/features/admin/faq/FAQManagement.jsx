import React, { useState } from 'react';
import { useAdminFAQs } from './faqQuries';
import { useFAQMutations } from './faqMutations';
import { Plus, Edit2, Trash2, X, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'client', label: 'Client' },
  { id: 'payment', label: 'Payment & Security' }
];

export default function FAQManagement() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'general' });

  const { data, isLoading } = useAdminFAQs(page);
  const { createMutation, updateMutation, deleteMutation } = useFAQMutations();

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setFormData({ question: faq.question, answer: faq.answer, category: faq.category });
      setCurrentFaq(faq);
    } else {
      setFormData({ question: '', answer: '', category: 'general' });
      setCurrentFaq(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentFaq) {
      updateMutation.mutate({ id: currentFaq.id, ...formData }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createMutation.mutate(formData, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(currentFaq.id, { onSuccess: () => setIsDeleteModalOpen(false) });
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-sm text-gray-500">Manage help center questions and categories</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New FAQ
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider bg-gray-50/50">
              <th className="py-4 px-6 font-semibold text-left w-[25%]">Question</th>
              <th className="py-4 px-6 font-semibold text-left w-[45%]">Answer</th>
              <th className="py-4 px-6 font-semibold text-left w-[15%]">Category</th>
              <th className="py-4 px-6 font-semibold text-right w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data?.results?.map((faq) => (
              <tr key={faq.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-5 px-6 align-top">
                  <p className="text-sm font-semibold text-gray-900 break-words leading-relaxed">
                    {faq.question}
                  </p>
                </td>
                <td className="py-5 px-6 align-top">
                  <p className="text-sm text-gray-600 break-words leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </td>
                <td className="py-5 px-6 align-top">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 uppercase tracking-tight">
                    {faq.category}
                  </span>
                </td>
                <td className="py-5 px-6 align-top text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => handleOpenModal(faq)} 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => { setCurrentFaq(faq); setIsDeleteModalOpen(true); }} 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!data?.results || data.results.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-500">No FAQs found. Click "Add New FAQ" to get started.</p>
          </div>
        )}

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

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{currentFaq ? 'Edit FAQ' : 'Create New FAQ'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                <select 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none bg-gray-50/50"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Question</label>
                <input 
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="Enter the question..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Answer</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50 resize-none"
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  placeholder="Enter the detailed answer..."
                />
              </div>
              <button 
                type="submit" 
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-100 active:scale-[0.98]"
              >
                {currentFaq ? 'Save Changes' : 'Create FAQ'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50/50">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete FAQ?</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">This action cannot be undone. This question will be permanently removed from the platform.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-[0.98]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}