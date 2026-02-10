import { useTermsAndConditions } from "./termsAndConditionQueries";
import { Loader2 } from "lucide-react";

export default function TermsAndConditions() {
  const { data, isLoading } = useTermsAndConditions();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      

      <div className="w-full  border-b border-gray-200 bg-white">
        <div className="max-w-[1037px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-[31px] font-bold text-gray-900 leading-[40px]">
                Terms & Conditions
              </h1>
              <p className="text-[15px] text-gray-600 leading-[28px]">
                Please read these terms carefully before using Grolance.
              </p>
            </div>
            <div className="flex items-center justify-center w-32 h-32 rounded-2xl bg-blue-100">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.6665 42.6663L50.6665 21.333L58.6665 42.6663C56.3465 44.3997 53.5465 45.333 50.6665 45.333C47.7865 45.333 44.9865 44.3997 42.6665 42.6663Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.3335 42.6663L13.3335 21.333L21.3335 42.6663C19.0135 44.3997 16.2135 45.333 13.3335 45.333C10.4535 45.333 7.6535 44.3997 5.3335 42.6663Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.6665 56H45.3332" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32 8V56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 18.6663H13.3333C18.6667 18.6663 26.6667 15.9997 32 13.333C37.3333 15.9997 45.3333 18.6663 50.6667 18.6663H56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1037px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-20 self-start">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-[12px] font-semibold text-gray-900 mb-4">Quick Navigation</h2>
              <nav className="flex flex-col gap-2">
                {data?.results?.map((section) => (
                  <button
                    key={`nav-${section.id}`}
                    onClick={() => scrollToSection(`section-${section.id}`)}
                    className="text-left px-3 py-2 text-[12px] text-gray-600 hover:bg-gray-50 rounded-lg transition-colors truncate"
                  >
                    {section.heading}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 flex pb-[54vh] flex-col gap-12">
            {data?.results?.map((section, index) => (
              <section 
                key={section.id} 
                id={`section-${section.id}`} 
                className="bg-white border  border-gray-100 rounded-2xl shadow-sm p-8 scroll-mt-20"
              >
                <h2 className="text-[20px] font-semibold text-gray-900 mb-4 leading-[32px]">
                  {index + 1}. {section.heading}
                </h2>
                <div className="space-y-4">
                  <p className="text-[14px] text-gray-700 leading-[26px] whitespace-pre-line">
                    {section.description}
                  </p>
                </div>
              </section>
            ))}
            
            {data?.results?.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                <p className="text-gray-500">No terms and conditions found.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}