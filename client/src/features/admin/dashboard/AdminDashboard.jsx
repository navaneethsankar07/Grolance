import React from 'react'
import AdminSidebar from './components/AdminSidebar'
import AdminOverview from './components/AdminOverview'
import AdminHeader from './components/AdminHeader'
import { disputes } from './dashboardApi'

function AdminDashboard() {
  disputes()
  
  return (
    
    <>
    <AdminOverview/>
    

    </>
  )
}

export default AdminDashboard 