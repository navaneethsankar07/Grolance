import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector(state => state.auth);

  if (!initialized) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/landing-page" replace />;
  }

  if (user.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
