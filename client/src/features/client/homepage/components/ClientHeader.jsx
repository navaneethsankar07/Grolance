import { Link } from "react-router-dom";
import { Plus, Bell, Mail } from "lucide-react";

export default function ClientHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-sm">
      <div className="container ml-20 flex h-[73px] items-center gap-80 min-w-456 ">
        <button  className="flex items-center gap-4">
          <h1 className="text-[37px] font-bold leading-7" style={{ fontFamily: 'MuseoModerno, sans-serif' }}>
            <span className="text-[#1A1A1A]">Gro</span>
            <span className="text-[#3B82F6]">lance</span>
          </h1>
        </button>

        <nav className="flex items-center gap-9">
          <button to="/" className="text-lg font-bold text-[#3B82F6]">
            Dashboard
          </button>
          <button  className="text-xs font-medium text-[#111318]">
            Find Talent
          </button>
          <button  className="text-sm font-medium text-[#111318]">
            How It Works
          </button>
          <button  className="text-sm font-medium text-[#111318]">
            My Posts
          </button>
        </nav>

        <div className="flex items-center gap-10">
          <button className="flex h-12 items-center gap-2.5 rounded-lg border-2 border-black bg-transparent px-6 transition-colors hover:bg-black/5">
            <Plus className="h-7 w-7" />
            <span className="text-base font-bold leading-6 tracking-[0.24px]">
              Post a Project
            </span>
          </button>

          <button className="relative">
            <Bell className="h-6 w-6 text-gray-400" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6] text-[9px] font-semibold text-white">
              3
            </span>
          </button>

          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-semibold">3</span>
              </span>
            </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-base font-semibold text-[#1A1A1A]">Alex Morgan</div>
              <div className="text-sm text-[#3B82F6]">Client Account</div>
            </div>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/474d9d1aa27ddaa218daa24136b5a92cfb3e0e51?width=88"
              alt="Alex Morgan"
              className="h-11 w-11 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
