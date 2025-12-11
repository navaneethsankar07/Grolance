import React from 'react'
import ClientHeader from './components/ClientHeader'
import ClientHeroSection from './components/ClientHeroSection'
import ClientFooter from './components/ClientFooter'
import ClientWhyUs from './components/ClientWhyUs'
import TopFreelancers from './components/TopFreelancers'
import JoinNow from './components/JoinNow'

function ClientHomepage() {
  return (
    <>
        <ClientHeader/>
        <ClientHeroSection/>
        <ClientWhyUs/>
        <TopFreelancers/>
        <JoinNow/>
        <ClientFooter/>
    </>
  )
}

export default ClientHomepage