import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignupModal from '../../account/SignupModal';
import { useModal } from '../../../../hooks/modal/useModalStore';
import VerifyOtp from '../../account/OtpModal';
const Header = () => {
  const { openModal } = useModal();

  return (
    
    <nav className="fixed top-8 left-0 right-0 z-50 px-4 md:px-8">
      <div className="max-w-[1700px] mx-auto">
        <div className="flex items-center justify-between h-16 px-6 md:px-12 rounded-3xl border border-white/30 backdrop-blur-md bg-white/80">
          <div className="flex items-center">
            <h2 className="text-[37px] font-museo font-extrabold leading-7">
              <span className="text-[#1A1A1A]">Gro</span>
              <span className="text-[#3B82F6]">lance</span>
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-9">
            <div className="text-[#1A1A1A] font-grotesk font-bold text-sm leading-5 hover:text-[#3B82F6] transition-colors">
              About Us
            </div>
            
            <Link to={'/why-us'} className="text-[#1A1A1A] font-grotesk font-bold text-sm leading-5 hover:text-[#3B82F6] transition-colors">
              Why Us
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={()=>openModal('signin')}
              variant="ghost"
              className="h-10 px-5 rounded-2xl bg-[#1A1A1A]/20 text-[#1A1A1A] font-grotesk font-bold text-sm hover:bg-[#1A1A1A]/30 flex items-center justify-center"
            >  
              Log In
            </button>
            <button onClick={() => openModal("signup")}
              className="h-10 px-4 rounded-2xl bg-[#3B82F6] text-white font-grotesk font-bold text-sm shadow-[0_10px_15px_-3px_rgba(26,26,26,0.3),0_4px_6px_-4px_rgba(26,26,26,0.3)] hover:bg-[#3B82F6]/90 flex items-center justify-center"
            >
              Sign Up
            </button>
            <SignupModal />
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Header