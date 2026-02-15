import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function FreelancerProtectedRoute({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);

  if (!initialized) return null; 

  if (!user) {
    toast.warn('Login before entering to this page')
    return <Navigate to="/" replace />;

  }

  if (user.current_role !== "freelancer") {
  toast.warn('This page is only for freelancers')

    return <Navigate to="/" replace />;
  }

  return children;
}