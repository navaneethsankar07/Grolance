import React from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StepsSection from './components/StepsSection'
import CategoriesSection from './components/CategoriesSection'
import FeaturesSection from './components/Features'
import TestimonialsSection from './components/Testimonials'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

function Landingpage() {
  return (
      <>
        <Header/>
        <HeroSection/>
        <StepsSection/>
        <CategoriesSection/>
        <FeaturesSection/>
        <TestimonialsSection/>
        <CTASection/>
        
        <Footer/>
      </>
  )
}

export default Landingpage