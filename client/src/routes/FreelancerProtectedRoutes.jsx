import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function FreelancerProtectedRoute({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);

  if (!initialized) return null; 

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.current_role !== "freelancer") {
    return <Navigate to="/" replace />;
  }

  return children;
}