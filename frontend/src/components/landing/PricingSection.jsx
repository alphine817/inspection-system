import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'For solo landlords and small portfolios getting started with digital inspections.',
    features: [
      'Up to 5 properties',
      '3 team members',
      'Basic inspection checklists',
      'Email reminders',
      'Mobile-friendly dashboard',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 'KES 4,900',
    period: 'per month',
    description: 'For growing property managers who need automation, reporting, and team roles.',
    features: [
      'Up to 50 properties',
      'Unlimited team members',
      'Rent automation & reminders',
      'Advanced analytics',
      'Custom inspection templates',
      'Priority email support',
    ],
    cta: 'Start free trial',
    href: '/signup',
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large portfolios, agencies, and organizations with advanced compliance needs.',
    features: [
      'Unlimited properties',
      'Dedicated account manager',
      'API access & integrations',
      'SSO & advanced security',
      'Custom onboarding & training',
      'SLA-backed support',
    ],
    cta: 'Contact sales',
    href: '#contact',
    highlighted: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Simple plans that scale with your portfolio
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Start free, upgrade when you need rent automation, analytics, and unlimited
            properties. No hidden fees.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={[
                'relative flex h-full flex-col rounded-2xl border p-6 sm:p-8',
                plan.highlighted
                  ? 'border-brand-200 bg-brand-50/40 shadow-lg shadow-brand-100/50 ring-2 ring-brand-500/20'
                  : 'border-slate-200 bg-white shadow-sm',
              ].join(' ')}
            >
              {plan.badge ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {plan.badge}
                </span>
              ) : null}

              <div>
                <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">/ {plan.period}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{plan.description}</p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.href.startsWith('/') ? (
                  <Link to={plan.href} className="block">
                    <Button
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      className="w-full rounded-xl py-3.5"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <a href={plan.href} className="block">
                    <Button
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      className="w-full rounded-xl py-3.5"
                    >
                      {plan.cta}
                    </Button>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          All plans include a 14-day free trial on Professional features.{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            No credit card required.
          </Link>
        </p>
      </div>
    </section>
  )
}
