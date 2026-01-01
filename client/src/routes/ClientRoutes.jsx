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

export default function ClientRoutes() {
  const { user,loading } = useSelector(state => state.auth);
  if (loading) {
    return null; 
  }
  return (
    <Routes>
      
        <Route element={<ClientLayout />}>
          <Route path="/" element={<ClientHomepage />} />
          <Route path="/create-project" element={<AddProject/>}/>
          <Route path="/my-projects" element={<MyProjects/>}/>
          <Route path="/my-projects/:id/edit" element={<EditProject/>}/>
          <Route path="/my-projects/:id/proposals" element={<ProposalsIndex/>}/>
          <Route element={<ClientProfileLayout/>}>
          <Route path="/profile" element={<ProfileOverview/>}/>
          <Route path="/profile/settings" element={<AccountSettings/>}/>
          <Route path="/profile/interests" element={<Interests/>}/>
          <Route path="/profile/edit" element={<ProfileEdit/>}/>
          </Route>
        </Route>
          
    </Routes>
  );
}
