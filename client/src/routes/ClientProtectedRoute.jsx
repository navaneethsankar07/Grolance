import {  useSelector } from "react-redux";
import Landingpage from "../features/client/landingPage/Landingpage";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const {user, initialized} = useSelector((state)=>state.auth);
if (!initialized) return null; 
const location = useLocation();

  if (!user) {
    if (location.pathname === "/") {
       return <Landingpage />;
    }
    return children;
  }

  if (user.is_admin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }
  if (user.current_role === 'freelancer' && !location.pathname.startsWith('/freelancer')) {
    return <Navigate to="/freelancer" replace />;
  }

  return children;
}