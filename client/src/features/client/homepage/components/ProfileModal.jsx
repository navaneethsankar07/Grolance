import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import { logoutThunk } from "../../account/auth/authThunks";
import { useSwitchRole } from "../homePageMutation";

export default function ProfileModal({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutateAsync } = useSwitchRole();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    function handleClickOutside(event) {
      const toggleButton = document.querySelector('[data-profile-button="true"]');
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        (!toggleButton || !toggleButton.contains(event.target))
      ) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logoutThunk());
    onClose();
    navigate("/");
  };

  const handleSwitchToFreelancer = async() => {
    onClose(); 
    if (user?.is_freelancer) {
      await mutateAsync({ role: "freelancer" });
      navigate("/freelancer");
    } else {
      navigate('/onBoarding')
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed right-4 top-[74px] z-[100] w-[calc(100%-32px)] sm:w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex flex-col gap-2.5">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center px-4 py-3 rounded-xl bg-[#F1F1F1] hover:bg-gray-200 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </Link>

        <Link
          to="/contracts"
          onClick={onClose}
          className="flex items-center px-4 py-3 rounded-xl bg-[#F1F1F1] hover:bg-gray-200 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">My Contracts</span>
        </Link>

        <Link
          to="/profile/settings"
          onClick={onClose}
          className="flex items-center px-4 py-3 rounded-xl bg-[#F1F1F1] hover:bg-gray-200 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Settings</span>
        </Link>

        <Link
          to="/support"
          onClick={onClose}
          className="flex items-center px-4 py-3 rounded-xl bg-[#F1F1F1] hover:bg-gray-200 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Contact Support</span>
        </Link>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
        <button 
          onClick={handleSwitchToFreelancer}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
        >
          Switch to Freelancer
        </button>
        <button
          onClick={handleLogout}
          className="w-full py-3 text-red-600 font-medium text-sm hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}