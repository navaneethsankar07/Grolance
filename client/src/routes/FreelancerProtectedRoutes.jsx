import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function FreelancerProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.current_role !== "freelancer") {
    return <Navigate to="/onBoarding" replace />;
  }

  return children;
}
