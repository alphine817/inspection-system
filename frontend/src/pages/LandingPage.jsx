import DashboardPreview from '../components/landing/DashboardPreview'
import FeaturesSection from '../components/landing/FeaturesSection'
import HeroSection from '../components/landing/HeroSection'
import LandingFooter from '../components/landing/LandingFooter'
import LandingNavbar from '../components/landing/LandingNavbar'
import PricingSection from '../components/landing/PricingSection'
import RentAutomationSection from '../components/landing/RentAutomationSection'

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-slate-50">
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
      <section id="contact">
        <LandingFooter />
      </section>
    </div>
  )
}
