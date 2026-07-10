import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardPreview from '../components/landing/DashboardPreview'
import FeaturesSection from '../components/landing/FeaturesSection'
import HeroSection from '../components/landing/HeroSection'
import LandingFooter from '../components/landing/LandingFooter'
import LandingNavbar from '../components/landing/LandingNavbar'
import PricingSection from '../components/landing/PricingSection'
import RentAutomationSection from '../components/landing/RentAutomationSection'

export default function LandingPage() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const sectionId = location.hash.replace('#', '')
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-svh bg-slate-50 dark:bg-slate-950">
      <LandingNavbar />
      <main className="pt-[81px]">
        <HeroSection />
        <FeaturesSection />
        <section id="how-it-works" className="scroll-mt-24">
          <DashboardPreview />
        </section>
        <RentAutomationSection />
        <PricingSection />
      </main>
      <section id="contact" className="scroll-mt-24">
        <LandingFooter />
      </section>
    </div>
  )
}
