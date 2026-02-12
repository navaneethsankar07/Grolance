import { Route, Routes } from "react-router-dom";
import ClientHomepage from "../features/client/homepage/ClientHomepage";
import ClientLayout from "../layouts/ClientLayout";
import { useSelector } from "react-redux";
import AddProject from "../features/client/projectManagement/AddProject";
import MyProjects from "../features/client/projectManagement/MyProjects";
import EditProject from "../features/client/projectManagement/EditProject";
import ProposalsIndex from "../features/client/projectManagement/proposals/ProposalsPage";
import ClientProfileLayout from "../layouts/ClientProfileLayout";
import ProfileOverview from "../features/client/profile/ProfileOverview";
import AccountSettings from "../features/client/profile/AccountSettings";
import Interests from "../features/client/profile/Interests";
import ProfileEdit from "../features/client/profile/EditProfile";
import { OnBoardingProvider } from "../features/client/onboarding/OnBoardingContext";
import OnboardingManager from "../features/client/onboarding/OnboardingManager";
import FindTalent from "../features/client/findtalent/FindTalent";
import FreelancerProfile from "../features/client/freelancerprofile/FreelancerProfile";
import ClientContracts from "../features/client/contract/ClientContracts";
import ClientContractDetail from "../features/client/contract/ContractDetail";
import ClientJobDetail from "../features/client/projectManagement/ProjectDetails";
import SpendingSummary from "../features/client/profile/SpendingSummary";
import HowItWorks from "../features/client/howitworks/HowItWorks";
import SupportPage from "../components/common/SupportPage";
import TermsAndConditions from "../components/common/termsandconditions/TermsAndConditions";
import PrivacyPolicies from "../components/common/privacypolicy/PrivacyPolicies";
import FAQPage from "../components/common/faq/FAQ";
import AllFreelancerReviews from "../features/client/freelancerprofile/AllFreelancerReviews";
import NotFound from "../components/NotFound";

export default function ClientRoutes() {
  const { user,loading } = useSelector(state => state.auth);
  if (loading) {
    return null; 
  }
  return (
    <Routes>
      
        <Route element={<ClientLayout />}>
          <Route path="/" element={<ClientHomepage />} />
          <Route path="/find-talents" element={<FindTalent/>}/>
          <Route path="/find-talents/:id" element={<FreelancerProfile/>}/>
          <Route path='/find-talents/:id/reviews' element={<AllFreelancerReviews/>}/>
          <Route path="/create-project" element={<AddProject/>}/>
          <Route path="/my-projects" element={<MyProjects/>}/>
          <Route path="/my-projects/:id" element={<ClientJobDetail/>}/>
          <Route path="/my-projects/:id/edit" element={<EditProject/>}/>
          <Route path="/my-projects/:id/proposals" element={<ProposalsIndex/>}/>
          <Route element={<ClientProfileLayout/>}>
          <Route path="/profile" element={<ProfileOverview/>}/>
          <Route path="/profile/settings" element={<AccountSettings/>}/>
          <Route path="/profile/interests" element={<Interests/>}/>
          <Route path="/profile/edit" element={<ProfileEdit/>}/>
          <Route path="/profile/spending" element={<SpendingSummary/>}/>
          </Route>
          <Route path="/onboarding" element={ <OnBoardingProvider><OnboardingManager /></OnBoardingProvider>} />
          <Route path="/contracts" element={<ClientContracts/>}/>
          <Route path="/contracts/:id" element={<ClientContractDetail/>}/>
          <Route path="/how-it-works" element={<HowItWorks/>}/>
          <Route path='/support' element={<SupportPage/>}/>
          <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
          <Route path="/privacy-policies" element={<PrivacyPolicies/>}/>
          <Route path="/faq" element={<FAQPage/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Route>
          
    </Routes>
  );
}
