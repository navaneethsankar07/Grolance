import {  useSelector } from "react-redux";
import Landingpage from "../features/client/landingPage/Landingpage";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const {user, initialized} = useSelector((state)=>state.auth);
if (!initialized) return null; 

  if (!user) {
    return <Landingpage />;
  }

  if (user.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  if (user.current_role === 'freelancer') {
    return <Navigate to="/freelancer" replace />;
  }

  return children;
}