import React, { useEffect } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StepsSection from './components/StepsSection'
import CategoriesSection from './components/CategoriesSection'
import FeaturesSection from './components/Features'
import TestimonialsSection from './components/Testimonials'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Landingpage() {
  const { user, initialized } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If we are initialized and a user exists, send them home
    if (initialized && user) {
      if (user.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, initialized, navigate]);
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