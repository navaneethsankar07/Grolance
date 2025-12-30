import {  useSelector } from "react-redux";
import Landingpage from "../features/client/landingPage/Landingpage";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state)=>state.auth.user);



  if (!user) {
    return <Landingpage/>
  }

  return children;
}

