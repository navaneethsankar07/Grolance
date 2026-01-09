import {  useSelector } from "react-redux";
import Landingpage from "../features/client/landingPage/Landingpage";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state)=>state.auth.user);
  const location = useLocation()

  if (!user) {
    return <Landingpage/>
  }
    if (user.current_role !== "client") {
    return <Navigate to="/freelancer" replace />;
  }
 return children;
}

