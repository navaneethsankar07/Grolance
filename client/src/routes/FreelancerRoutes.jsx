import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FreelancerLayout } from '../layouts/FreelancerLayout'
import FreelancerDashboard from '../features/freelancer/dashboard/FreelancerDashboard'
import FindJobs from '../features/freelancer/findJobs/FindJobs'

function FreelancerRoutes() {
  return (
    <Routes>
        <Route element={<FreelancerLayout />}>
          <Route path='' element={<FreelancerDashboard />} />
        <Route path='/find-jobs' element={<FindJobs/>}/>
        </Route>
    </Routes>
)
}

export default FreelancerRoutes