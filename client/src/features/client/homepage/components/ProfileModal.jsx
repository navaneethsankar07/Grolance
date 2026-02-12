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
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      onClose();
    }
  }
  
  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
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
      className="profile-menu-container fixed right-0 top-18 z-50 w-72 rounded-xl border border-gray-100 bg-white"
      style={{
        boxShadow:
          "0 8px 10px -6px rgba(0, 0, 0, 0.10), 0 20px 25px -5px rgba(0, 0, 0, 0.10)",
      }}
    >
      <div className="menu-content flex flex-col gap-4 px-[17px] pb-5 pt-[17px]">
        <Link
          to="/profile"
          onClick={onClose}
          className="menu-item flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-200"
          style={{ backgroundColor: "#F1F1F1" }}
        >
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </Link>

        <Link
          to="/contracts"
          onClick={onClose}
          className="menu-item flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-200"
          style={{ backgroundColor: "#F1F1F1" }}
        >
          <span className="text-sm font-medium text-gray-700">My Contracts</span>
        </Link>

        <Link
          to="/profile/settings"
          onClick={onClose}
          className="menu-item flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-200"
          style={{ backgroundColor: "#F1F1F1" }}
        >
          <span className="text-sm font-medium text-gray-700">Settings</span>
        </Link>

        <Link
          to="/support"
          onClick={onClose}
          className="menu-item flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-200"
          style={{ backgroundColor: "#F1F1F1" }}
        >
          <span className="text-sm font-medium text-gray-700">
            Contact Support
          </span>
        </Link>
      </div>

      <div className="px-4 pb-4">
        <button 
          onClick={handleSwitchToFreelancer}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 font-medium text-sm transition-colors"
        >
          Switch to Freelancer
        </button>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-red-50"
        >
          <span className="text-sm font-medium text-red-600">Logout</span>
        </button>
      </div>
    </div>
  );
}