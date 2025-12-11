import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Landingpage from "../features/client/landingPage/Landingpage";
import ClientHomepage from '../features/client/homepage/ClientHomepage'
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    children: [
      { path: "", element: <Landingpage/> },
      { path: "home", element: <ClientHomepage/>}
    ]
  }
]);
