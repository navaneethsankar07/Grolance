import React, { useState, useEffect } from 'react';
import { useFAQs } from './faqQuries';
import { ChevronDown, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'freelancer', label: 'Freelancers' },
  { id: 'client', label: 'Clients' },
  { id: 'payment', label: 'Payments' },
];

export default function FAQPage() {
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);

  const { data, isLoading, isFetching } = useFAQs(category, page);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-[40px] font-bold text-[#111827] mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-lg">Find quick answers to common questions.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { 
                setCategory(cat.id); 
                setPage(1); 
                setOpenId(null); 
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#111827]">Popular Questions</h2>
          {isFetching && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
        </div>

        <div className="space-y-3 mb-10 min-h-[400px]">
          {data?.results?.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#1F2937] text-[15px]">{faq.question}</span>
                <ChevronDown 
                  className={`text-gray-400 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openId === faq.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="p-5 pt-0 text-gray-600 text-[14px] leading-relaxed border-t border-gray-50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}

          {data?.results?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No questions found for this category.</p>
            </div>
          )}
        </div>

        {data?.count > 0 && (
          <div className="flex items-center justify-center gap-4 mb-12">
            <button 
              disabled={!data.previous || isFetching}
              onClick={() => setPage(prev => prev - 1)}
              className="flex items-center justify-center px-6 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              ← Previous
            </button>
            
            <div className="text-sm font-medium text-gray-500">
              Page <span className="text-gray-900">{page}</span>
            </div>

            <button 
              disabled={!data.next || isFetching}
              onClick={() => setPage(prev => prev + 1)}
              className="flex items-center justify-center px-6 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Next →
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Mail className="text-white w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#111827] mb-1">Need More Help?</h3>
            <p className="text-gray-500 text-sm">Can't find what you're looking for? Our support team is here to help you with any questions or issues.</p>
            <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
              <Link to={'/support'} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}