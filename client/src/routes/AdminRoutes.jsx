import AdminDashboard from '../features/admin/dashboard/AdminDashboard'
import { Route, Routes } from 'react-router-dom'
import AdminUserList from '../features/admin/usermanagement/AdminUserList'
import CategoriesAndSkills from '../features/admin/categorymanagement/CategoriesAndSkills'
import PaymentRelease from '../features/admin/payoutmanagement/PaymenRelease'

function AdminRoutes() {
  return (
    <>
    <Routes>

        <Route index element={<AdminDashboard/>} />
        <Route path="users" element={<AdminUserList />} />
        <Route path='category-management' element={<CategoriesAndSkills/>}/>
        <Route path='payment-release' element={<PaymentRelease/>}/>
    </Routes>
    </>
  )
}

export default AdminRoutes