import React from 'react'
import ClientHeroSection from './components/ClientHeroSection'
import ClientWhyUs from './components/ClientWhyUs'
import TopFreelancers from './components/TopFreelancers'
import JoinNow from './components/JoinNow'
import { useSelector } from 'react-redux'

function ClientHomepage() {
  const user = useSelector(state=>state.auth.user)
  console.log(user.current_role);
  
  return (
    <>
        <ClientHeroSection/>
        <ClientWhyUs/>
        <TopFreelancers/>
        <JoinNow/>
    </>
  )
}

export default ClientHomepage