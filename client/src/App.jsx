import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import ClientRoutes from './routes/ClientRoutes'
import RootLayout from './layouts/RootLayout'
import ProtectedRoute from './routes/ClientProtectedRoute'

export default function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/*" element={<ProtectedRoute> <ClientRoutes /> </ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
