import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import ClientRoutes from './routes/ClientRoutes'
import RootLayout from './layouts/RootLayout'
import ProtectedRoute from './routes/ClientProtectedRoute'
import ResetPasswordPage from './features/client/resetpassword/ResetPasswordPage';

export default function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/*" element={<ProtectedRoute> <ClientRoutes /> </ProtectedRoute>} />
          <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
