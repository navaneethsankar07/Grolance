import { Loader2, ShieldCheck } from "lucide-react";
import {usePrivacyPolicies} from './privacyPolicyQueries'

export default function PrivacyPolicies() {
  const { data, isLoading } = usePrivacyPolicies();

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
  
      <div className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-[1037px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-[31px] font-bold text-gray-900 leading-[40px]">
                Privacy Policy
              </h1>
              <p className="text-[15px] text-gray-600 leading-[28px]">
                Your privacy is important to us. Learn how we protect and manage your data.
              </p>
            </div>
            <div className="flex items-center justify-center w-32 h-32 rounded-2xl bg-blue-100">
                <ShieldCheck className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1037px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 self-start">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-[12px] font-semibold text-gray-900 mb-4 uppercase tracking-wider">Policy Navigation</h2>
              <nav className="flex flex-col gap-2">
                {data?.results?.map((section) => (
                  <button
                    key={`nav-${section.id}`}
                    onClick={() => scrollToSection(`section-${section.id}`)}
                    className="text-left px-3 py-2 text-[12px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all truncate"
                  >
                    {section.heading}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 pb-[52vh] flex flex-col gap-8">
            {data?.results?.map((section, index) => (
              <section 
                key={section.id} 
                id={`section-${section.id}`} 
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 scroll-mt-24 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-[14px] font-bold">
                        {index + 1}
                    </span>
                    <h2 className="text-[20px] font-semibold text-gray-900 leading-[32px]">
                    {section.heading}
                    </h2>
                </div>
                <div className="space-y-4">
                  <div className="text-[14px] text-gray-700 leading-[26px] whitespace-pre-line prose prose-blue max-w-none">
                    {section.description}
                  </div>
                </div>
              </section>
            ))}
            
            {data?.results?.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No privacy policy sections found.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}