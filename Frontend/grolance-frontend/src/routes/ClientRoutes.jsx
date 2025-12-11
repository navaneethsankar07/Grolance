import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Landingpage from '../features/client/landingPage/Landingpage'
import ClientHomepage from '../features/client/homepage/ClientHomepage'

function ClientRoutes() {
    console.log('hello');
    
  return (
    <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/home' element={<ClientHomepage/>}/>
    </Routes>
  )
}

export default ClientRoutes