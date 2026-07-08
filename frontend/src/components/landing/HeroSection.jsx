import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { landingImages } from '../../constants/landingImages'
import Button from '../ui/Button'

const highlights = [
  'Schedule inspections in seconds',
  'Track every unit and property',
  'Role-based team access',
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={landingImages.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right opacity-[0.14] sm:opacity-[0.18] lg:opacity-30"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white from-[58%] via-white/95 to-white/55 sm:from-[52%] lg:from-white lg:via-white/90 lg:to-white/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-50)_0%,_transparent_55%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">
            Rental Property Inspection System
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
            Inspect smarter.
            <span className="block text-brand-600">Manage every rental with confidence.</span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
            RentalInspect brings property portfolios, automated scheduling, and digital
            inspection checklists into one clean dashboard — built for managers, inspectors,
            and tenants.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-700 sm:text-base">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            No credit card required.{' '}
            <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
              Create your workspace
            </Link>
          </p>
        </div>

        <div className="hidden lg:block">
          <div className="relative space-y-4">
            <div
              className="absolute -inset-4 rounded-3xl bg-brand-50/80 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60">
              <img
                src={landingImages.heroSide}
                alt="Property manager reviewing a rental portfolio on a tablet"
                className="h-52 w-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
            </div>
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quick signup
                  </p>
                  <p className="mt-1 text-lg font-bold text-ink">Create your account</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                  Free
                </span>
              </div>

              <form className="mt-5 space-y-4" onSubmit={(event) => event.preventDefault()} noValidate>
                <div>
                  <label htmlFor="hero-email" className="mb-1.5 block text-sm font-semibold text-ink">
                    Work email
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="hero-password"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Password
                  </label>
                  <input
                    id="hero-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  />
                </div>
                <Link to="/signup" className="block">
                  <Button type="button" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </form>

              <p className="mt-4 text-center text-xs text-slate-500">
                By continuing, you agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
