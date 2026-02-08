import AdminDashboard from '../features/admin/dashboard/AdminDashboard'
import { Route, Routes } from 'react-router-dom'
import AdminUserList from '../features/admin/usermanagement/AdminUserList'
import CategoriesAndSkills from '../features/admin/categorymanagement/CategoriesAndSkills'
import PaymentRelease from '../features/admin/payoutmanagement/PaymenRelease'
import AdminTransactions from '../features/admin/transactions/AdminTransactions'
import DisputeList from '../features/admin/disputemanagement/DisputeList'
import DisputeDetail from '../features/admin/disputemanagement/DisputeDetail'
import AdminSettings from '../features/admin/settings/AdminSettings'

function AdminRoutes() {
  return (
    <>
    <Routes>

        <Route index element={<AdminDashboard/>} />
        <Route path="users" element={<AdminUserList />} />
        <Route path='category-management' element={<CategoriesAndSkills/>}/>
        <Route path='payment-release' element={<PaymentRelease/>}/>
        <Route path='transactions' element={<AdminTransactions/>}/>
        <Route path='disputes' element={<DisputeList/>}/>
        <Route path='disputes/:id' element={<DisputeDetail/>}/>
        <Route path='settings/' element={<AdminSettings/>}/>
    </Routes>
    </>
  )
}

export default AdminRoutes