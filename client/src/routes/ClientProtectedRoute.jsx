import { useEffect } from "react"; // 1. Import useEffect
import { useSelector } from "react-redux";
import Landingpage from "../features/client/landingPage/Landingpage";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import NotFound from "../components/NotFound";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);
  const location = useLocation();
  console.log(user);
  console.log(initialized);
  
  if (!initialized) return null;

  if (!user) {
    if (location.pathname === "/") {
      return <Landingpage />;
    }
    return <NotFound/>
  }

  if (user?.is_admin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }
  if (user?.current_role === 'freelancer' && !location.pathname.startsWith('/freelancer')) {
    return <Navigate to="/freelancer" replace />;
  }

  return children;
}