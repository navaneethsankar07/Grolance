import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import ClientRoutes from './routes/ClientRoutes'
import RootLayout from './layouts/RootLayout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<ClientRoutes />} />
        </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
