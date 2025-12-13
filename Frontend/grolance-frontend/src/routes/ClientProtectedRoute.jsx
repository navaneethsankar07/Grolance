import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Landingpage from "../features/client/landingPage/Landingpage";
import { useEffect } from "react";
import { fetchUser } from "../features/client/account/auth/authThunks";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state)=>state.auth.user);

  console.log(user)
const dispatch = useDispatch();
useEffect(() => {
   dispatch(fetchUser());
  }, []);

  if (!user) {
    return <Landingpage/>
  }

  return children;
}
