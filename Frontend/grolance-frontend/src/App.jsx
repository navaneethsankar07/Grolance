import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import ClientRoutes from './routes/ClientRoutes'
import RootLayout from './layouts/RootLayout'
import Spinner from './components/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './features/client/account/auth/authThunks'
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
