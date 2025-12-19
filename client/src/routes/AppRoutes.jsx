import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import ProtectedRoute from './ClientProtectedRoute'
import ClientRoutes from './ClientRoutes'
import ResetPasswordPage from '../features/client/resetpassword/ResetPasswordPage'
import AdminRoutes from './AdminRoutes'
import AdminProtectedRoute from './AdminProtectedRoutes'
import AdminLogin from '../features/admin/auth/AdminLogin'
import AdminLayout from '../layouts/AdminLayout'


function AppRoutes() {
  return (
    <BrowserRouter>
  <Routes>
    <Route element={<RootLayout />}>

      {/* CLIENT */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ClientRoutes />
          </ProtectedRoute>
        }
      />

      {/* PUBLIC */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminRoutes />} />
        </Route>
      </Route>

    </Route>
  </Routes>
</BrowserRouter>


  )
}

export default AppRoutes