import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Bell, Mail, Menu, X } from "lucide-react"; // Added Menu and X
import { useSelector } from "react-redux";
import { useModal } from "../../../../hooks/modal/useModalStore";

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const fullName = user?.full_name ?? "";
  const displayName = fullName.split(" ")[0];
  const profilePic = user?.profile_photo ?? null;
  const {openModal} = useModal()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-sm">
      <div className=" w-full md:px-8 px-4  flex h-[73px] items-center justify-between">
        
        <Link to={"/"} className="flex items-center gap-4 shrink-0">
          <h1 className="text-[28px] md:text-[37px] font-bold leading-7" style={{ fontFamily: "MuseoModerno, sans-serif" }}>
            <span className="text-[#1A1A1A]">Gro</span>
            <span className="text-primary">lance</span>
          </h1>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          <Link to="/" className="text-lg font-bold text-primary">
            Dashboard
          </Link>
          <Link to={'/find-talents'} className="text-sm font-medium text-[#111318]">
            Find Talent
          </Link>
          <button className="text-sm font-medium text-[#111318]">
            How It Works
          </button>
          <Link to="/my-projects" className="text-sm font-medium text-[#111318]">
            My Posts
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-10">
          <Link
            to="/create-project"
            className="hidden sm:flex h-10 md:h-12 items-center gap-2.5 rounded-lg border-2 border-black bg-transparent px-4 md:px-6 transition-colors hover:bg-black/5"
          >
            <Plus className="h-5 w-5 md:h-7 md:w-7" />
            <span className="text-sm md:text-base font-bold leading-6 tracking-[0.24px]">
              Post a Project
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative">
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 md:h-4 md:w-4 items-center justify-center rounded-full bg-primary text-[8px] md:text-[9px] font-semibold text-white">
                3
              </span>
            </button>

            <button className="relative p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 md:top-1 md:right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] md:text-[9px] font-semibold">3</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <div className="text-base font-semibold text-[#1A1A1A]">{displayName}</div>
              <div className="text-sm text-primary">Client Account</div>
            </div>
            <button
  onClick={() => openModal("profile-menu")}
  className="h-10 w-10 md:h-11 md:w-11 rounded-full overflow-hidden border border-gray-100"
>
  {profilePic ? (
    <img src={profilePic} alt={fullName} className="h-full w-full object-cover" />
  ) : (
    <div className="bg-[#3B82f6] h-full w-full rounded-full flex items-center justify-center">
      <span className="text-white font-museo font-bold text-xl md:text-2xl">
        {fullName?.charAt(0).toUpperCase()}
      </span>
    </div>
  )}
</button>

          </div>

          <button 
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white p-4 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-lg font-bold text-primary" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <button className="text-left text-sm font-medium text-[#111318]">Find Talent</button>
            <button className="text-left text-sm font-medium text-[#111318]">How It Works</button>
            <button className="text-left text-sm font-medium text-[#111318]">My Posts</button>
            <Link 
              to="/create-project" 
              className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-black w-full"
              onClick={() => setIsMenuOpen(false)}
            >
               <Plus className="h-5 w-5" /> Post a Project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}