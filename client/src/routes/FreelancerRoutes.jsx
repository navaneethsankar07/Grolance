import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FreelancerLayout } from '../layouts/FreelancerLayout'
import FreelancerDashboard from '../features/freelancer/dashboard/FreelancerDashboard'
import FindJobs from '../features/freelancer/findJobs/FindJobs'
import JobDetail from '../features/freelancer/jobdetails/JobDetails'
import Profile from '../features/freelancer/profile/Profile'
import ProfileEdit from '../features/freelancer/profile/ProfileEdit'

function FreelancerRoutes() {
  return (
    <Routes>
        <Route element={<FreelancerLayout />}>
          <Route path='' element={<FreelancerDashboard />} />
        <Route path='/jobs' element={<FindJobs/>}/>
        <Route path='/jobs/:id' element={<JobDetail/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile/edit' element={<ProfileEdit/>}/>
        </Route>
    </Routes>
)
}

export default FreelancerRoutes