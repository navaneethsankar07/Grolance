import AdminDashboard from '../features/admin/dashboard/AdminDashboard'
import { Route, Routes } from 'react-router-dom'
import AdminUserList from '../features/admin/usermanagement/AdminUserList'
import CategoriesAndSkills from '../features/admin/categorymanagement/CategoriesAndSkills'
import PaymentRelease from '../features/admin/payoutmanagement/PaymenRelease'
import AdminTransactions from '../features/admin/transactions/AdminTransactions'
import DisputeList from '../features/admin/disputemanagement/DisputeList'
import DisputeDetail from '../features/admin/disputemanagement/DisputeDetail'
import AdminSettings from '../features/admin/settings/AdminSettings'
import SupportTicketList from '../features/admin/support/SupportTicketList'
import SupportTicketDetail from '../features/admin/support/SupportTicketDetials'
import TermsAndConditions from '../features/admin/termsandconditionsmanagement/TermAndConditions'
import PrivacyPolicy from '../features/admin/privacypolicymanagement/PrivacyPolicy'
import FAQManagement from '../features/admin/faq/FAQManagement'

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
        <Route path='support/' element={<SupportTicketList/>}/>
        <Route path='support/:id' element={<SupportTicketDetail/>}/>
        <Route path='terms-and-conditions/' element={<TermsAndConditions/>}/>
        <Route path='privacy-policy/' element={<PrivacyPolicy/>}/>
        <Route path='faq-management/' element={<FAQManagement/>}/>
    </Routes>
    </>
  )
}

export default AdminRoutes