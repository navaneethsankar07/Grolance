import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null; 

  if (!user || !user.is_admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
