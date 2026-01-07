import { Bell, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="w-full h-[80px] bg-white border-b border-[#F3F4F6] flex items-center justify-between px-10">
      <Link to="/" className="flex items-center">
        <h1 className="text-[40px] leading-none font-[900] tracking-tight" style={{ fontFamily: 'MuseoModerno, sans-serif' }}>
          <span className="text-[#1A1A1A]">Gro</span>
          <span className="text-[#3B82F6]">lance</span>
        </h1>
      </Link>

      <div className="flex items-center gap-6">
        <Link to={'/'} className="flex items-center gap-3 h-11 px-5 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.33334 2L2.66667 4.66667L5.33334 7.33333" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.66667 4.6665H13.3333" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.6667 13.9998L13.3333 11.3332L10.6667 8.6665" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.3333 11.3335H2.66667" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-bold text-[#3B82F6]" style={{ fontFamily: 'Inter, sans-serif' }}>Switch to Client</span>
        </Link>

        <div className="flex items-center gap-2">
            <button className="relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Mail className="w-6 h-6 text-[#4B5563]" />
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#3B82F6] border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button className="relative w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-full">
              <Bell className="w-6 h-6 text-[#4B5563]" />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#EF4444] border-2 border-white rounded-full"></div>
            </button>
        </div>
      </div>
    </header>
  );
}