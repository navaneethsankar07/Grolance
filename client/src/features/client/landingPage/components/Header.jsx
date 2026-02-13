import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignupModal from '../../account/SignupModal';
import { useModal } from '../../../../hooks/modal/useModalStore';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { openModal } = useModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 md:top-8 left-0 right-0 z-50 px-4">
      <div className="max-w-[1700px] mx-auto relative">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-12 rounded-2xl md:rounded-3xl border border-white/30 backdrop-blur-md bg-white/80 shadow-sm">
          <div className="flex items-center">
            <Link to="/">
              <h2 className="text-[28px] md:text-[37px] font-museo font-extrabold leading-none">
                <span className="text-[#1A1A1A]">Gro</span>
                <span className="text-[#3B82F6]">lance</span>
              </h2>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-9">
            <Link to="/about-us" className="text-[#1A1A1A] font-grotesk font-bold text-sm hover:text-[#3B82F6] transition-colors">
              About Us
            </Link>
            <Link to="/why-us" className="text-[#1A1A1A] font-grotesk font-bold text-sm hover:text-[#3B82F6] transition-colors">
              Why Us
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={() => openModal('signin')}
                className="h-10 px-5 rounded-2xl bg-[#1A1A1A]/5 text-[#1A1A1A] font-grotesk font-bold text-sm hover:bg-[#1A1A1A]/10 transition-all"
              >  
                Log In
              </button>
              <button 
                onClick={() => openModal("signup")}
                className="h-10 px-5 rounded-2xl bg-[#3B82F6] text-white font-grotesk font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-[#2563EB] transition-all"
              >
                Sign Up
              </button>
            </div>

            <button 
              className="md:hidden p-2 text-[#1A1A1A]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Link 
                  to="/about-us" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#1A1A1A] font-grotesk font-bold text-lg border-b border-gray-50 pb-2"
                >
                  About Us
                </Link>
                <Link 
                  to="/why-us" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#1A1A1A] font-grotesk font-bold text-lg border-b border-gray-50 pb-2"
                >
                  Why Us
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { openModal('signin'); setIsMenuOpen(false); }}
                  className="w-full h-12 rounded-xl bg-gray-100 text-[#1A1A1A] font-grotesk font-bold"
                >
                  Log In
                </button>
                <button 
                  onClick={() => { openModal('signup'); setIsMenuOpen(false); }}
                  className="w-full h-12 rounded-xl bg-[#3B82F6] text-white font-grotesk font-bold"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SignupModal />
    </nav>
  );
};

export default Header;