import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import ProtectedRoute from './ClientProtectedRoute'
import ClientRoutes from './ClientRoutes'
import ResetPasswordPage from '../features/client/resetpassword/ResetPasswordPage'
import AdminRoutes from './AdminRoutes'
import AdminProtectedRoute from './AdminProtectedRoutes'
import AdminLogin from '../features/admin/auth/AdminLogin'
import AdminLayout from '../layouts/AdminLayout'
import Landingpage from '../features/client/landingPage/Landingpage'


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ClientRoutes />
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="*" element={<AdminRoutes />} />
            </Route>
          </Route>


        </Route>
      </Routes>
    </BrowserRouter>


  )
}

export default AppRoutes