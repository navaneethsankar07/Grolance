import React from 'react'
import AdminDashboard from '../features/admin/dashboard/AdminDashboard'
import { Route, Routes } from 'react-router-dom'

function AdminRoutes() {
  return (
    <>
    <Routes>

        <Route path='' element={<AdminDashboard/>} />
    </Routes>
    </>
  )
}

export default AdminRoutes