import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FreelancerLayout } from '../layouts/FreelancerLayout'
import FreelancerDashboard from '../features/freelancer/dashboard/FreelancerDashboard'
import FindJobs from '../features/freelancer/findJobs/FindJobs'
import JobDetail from '../features/freelancer/jobdetails/JobDetails'

function FreelancerRoutes() {
  return (
    <Routes>
        <Route element={<FreelancerLayout />}>
          <Route path='' element={<FreelancerDashboard />} />
        <Route path='/jobs' element={<FindJobs/>}/>
        <Route path='/jobs/:id' element={<JobDetail/>}/>
        </Route>
    </Routes>
)
}

export default FreelancerRoutes