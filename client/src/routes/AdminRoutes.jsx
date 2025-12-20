import AdminDashboard from '../features/admin/dashboard/AdminDashboard'
import { Route, Routes } from 'react-router-dom'
import AdminUserList from '../features/admin/usermanagement/AdminUserList'

function AdminRoutes() {
  return (
    <>
    <Routes>

        <Route index element={<AdminDashboard/>} />
        <Route path="users" element={<AdminUserList />} />
    </Routes>
    </>
  )
}

export default AdminRoutes