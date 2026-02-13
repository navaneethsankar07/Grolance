import { ExternalLink, X } from "lucide-react";
import { useModal } from "../../../../hooks/modal/useModalStore";

export default function AuthLayout({ title, children, onClose }) {
  const { openModal } = useModal();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4">
      {/* Container: Full screen on mobile, capped on desktop */}
      <div className="w-full md:max-w-[1000px] lg:max-w-[1120px] h-full md:h-auto md:max-h-[90vh] lg:h-[780px] flex bg-white md:rounded-[28px] overflow-hidden shadow-2xl relative transition-all duration-300">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[60] p-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full text-gray-600 hover:text-black hover:bg-white transition-all active:scale-95 shadow-sm"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Banner Image: Hidden on mobile, 40% on small desktop, 60% on large desktop */}
        <div className="hidden md:block md:w-[45%] lg:w-[60%] shrink-0 relative bg-gray-100">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d5a056a1a9dcfe6edb4f50fccc858ae5f35d3183?width=1292"
            alt="Auth Banner"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for better contrast */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Form Section: Full width on mobile, 55% to 40% on desktop */}
        <div className="w-full md:w-[55%] lg:w-[40%] bg-white flex flex-col h-full">
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 md:p-8 lg:p-12 overflow-y-auto">
            
            <div className="w-full max-w-sm lg:max-w-none">
              <div className="text-center mb-6 lg:mb-8">
                <h1 className="font-Museo font-black text-[28px] md:text-[32px] lg:text-[40px] text-gray-900 tracking-tight leading-tight">
                  {title}
                </h1>
                
                {title === 'Welcome Back' && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                    <span>Don't have an account?</span>
                    <button 
                      onClick={() => openModal('signup')} 
                      className="text-blue-600 font-bold hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
                    >
                      <span>Sign up</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full">
                {children}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}