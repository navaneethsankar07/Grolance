import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import ClientRoutes from './routes/ClientRoutes'
import RootLayout from './layouts/RootLayout'
import ProtectedRoute from './routes/ClientProtectedRoute'
import ResetPasswordPage from './features/client/resetpassword/ResetPasswordPage';
import AdminRoutes from './routes/AdminRoutes';
import AppRoutes from './routes/AppRoutes';

export default function App() {


  return (
    <AppRoutes/>
  );
}
