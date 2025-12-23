import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute() {
  const { user, loading, initialized } = useSelector((state) => state.auth);
  
  if (!initialized ) return null;
  if (!user && !loading) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
