import { Route, Routes } from "react-router-dom";
import Landingpage from "../features/client/landingPage/Landingpage";
import ClientHomepage from "../features/client/homepage/ClientHomepage";
import ClientLayout from "../layouts/ClientLayout";
import { useSelector } from "react-redux";
import AddProject from "../features/client/projectManagement/AddProject";
import MyProjects from "../features/client/projectManagement/MyProjects";
import EditProject from "../features/client/projectManagement/EditProject";
import ProposalsIndex from "../features/client/projectManagement/proposals/ProposalsPage";

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
        </Route>
          
    </Routes>
  );
}
