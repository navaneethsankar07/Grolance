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
import FreelancerRoutes from './FreelancerRoutes'
import FreelancerProtectedRoute from './FreelancerProtectedRoutes'
import ContactPage from '../components/common/ContactUs'
import WhyUsPage from '../components/common/WhyUs'
import SupportPage from '../components/common/SupportPage'
import AboutPage from '../components/common/AboutUs'
import NotFound from '../components/NotFound'


function AppRoutes() {
  
  return (
    
    <BrowserRouter>
      <Routes>
<Route path="/404" element={<NotFound />} />
        <Route element={<RootLayout />}>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path='/contact-us' element={<ContactPage/>}/>
          <Route path='/why-us' element={<WhyUsPage/>}/>
          <Route path='/about-us' element={<AboutPage/>}/>
          
          <Route path='/freelancer/*' element={<FreelancerProtectedRoute><FreelancerRoutes/></FreelancerProtectedRoute> }/>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="*" element={<AdminRoutes />} />
            </Route>
          </Route>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ClientRoutes />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>


  )
}

export default AppRoutes