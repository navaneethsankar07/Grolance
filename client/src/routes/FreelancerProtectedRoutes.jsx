import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import NotFound from "../components/NotFound";

export default function FreelancerProtectedRoute({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);

  if (!initialized) return null; 

  if (!user) {
    toast.warn('Login before entering to this page',{ toastId: 'login-required' })
    return <Navigate to="/" replace />;

  }

  if (user.current_role !== "freelancer") {
    return <NotFound/>
  }

  return children;
}