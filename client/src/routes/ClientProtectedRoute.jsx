import {  useSelector } from "react-redux";
import Landingpage from "../features/client/landingPage/Landingpage";
import { Navigate, replace } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state)=>state.auth.user);
  
  
  
  if (!user) {
    return <Landingpage/>
  }
  if(user.is_admin){
    return <Navigate to='/admin' replace/>
  }
  
  return children;
}
