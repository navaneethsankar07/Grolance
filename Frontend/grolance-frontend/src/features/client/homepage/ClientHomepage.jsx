import React from 'react'
import ClientHeroSection from './components/ClientHeroSection'
import ClientWhyUs from './components/ClientWhyUs'
import TopFreelancers from './components/TopFreelancers'
import JoinNow from './components/JoinNow'

function ClientHomepage() {
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