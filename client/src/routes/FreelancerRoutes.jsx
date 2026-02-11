import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FreelancerLayout } from '../layouts/FreelancerLayout'
import FreelancerDashboard from '../features/freelancer/dashboard/FreelancerDashboard'
import FindJobs from '../features/freelancer/findJobs/FindJobs'
import JobDetail from '../features/freelancer/jobdetails/JobDetails'
import Profile from '../features/freelancer/profile/Profile'
import ProfileEdit from '../features/freelancer/profile/ProfileEdit'
import InvitationsPage from '../features/freelancer/invitations/InvitationsPage'
import MyProposals from '../features/freelancer/proposals/components/MyProposals'
import FreelancerOffers from '../features/freelancer/offers/FreelancerOffers'
import Contracts from '../features/freelancer/contracts/Contracts'
import ContractDetail from '../features/freelancer/contracts/ContractDetail'
import EarningsOverview from '../features/freelancer/profile/EarningsOverview'
import PaymentSettings from '../features/freelancer/profile/PaymentSettings'
import SupportPage from '../components/common/SupportPage'
import TermsAndConditions from '../components/common/termsandconditions/TermsAndConditions'
import PrivacyPolicies from '../components/common/privacypolicy/PrivacyPolicies'
import FAQPage from '../components/common/faq/FAQ'

function FreelancerRoutes() {
  return (
    <Routes>
        <Route element={<FreelancerLayout />}>
          <Route path='' element={<FreelancerDashboard />} />
        <Route path='/jobs' element={<FindJobs/>}/>
        <Route path='/jobs/:id' element={<JobDetail/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile/edit' element={<ProfileEdit/>}/>
        <Route path='/profile/earnings-overview' element={<EarningsOverview/>}/>
        <Route path='/invitations' element={<InvitationsPage/>}/>
        <Route path='/my-proposals' element = {<MyProposals/>}/>
        <Route path='/offers' element={<FreelancerOffers/>} />
        <Route path='/contracts' element={<Contracts/>}/>
        <Route path='/contracts/:id' element={<ContractDetail/>}/>
        <Route path='/settings/payment' element={<PaymentSettings/>}/>
        <Route path='/support' element={<SupportPage/>}/>
        <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
        <Route path='/privacy-policies' element={<PrivacyPolicies/>}/>
        <Route path="/faq" element={<FAQPage/>}/>
        </Route>
    </Routes>
)
}

export default FreelancerRoutes