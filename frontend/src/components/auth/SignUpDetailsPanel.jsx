import { Home, Rocket, Settings, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthDetailsBadges from './AuthDetailsBadges'

const highlights = [
  {
    title: 'GETTING STARTED',
    icon: Rocket,
    description:
      'Launch your workspace in minutes with guided onboarding and a clean dashboard ready for your portfolio.',
  },
  {
    title: 'EASY SETUP',
    icon: Settings,
    description:
      'Add properties, invite your team, and schedule your first inspection without complex configuration.',
  },
  {
    title: 'TEAM ROLES',
    icon: Users,
    description:
      'Assign admins, managers, inspectors, and tenants with role-based access from day one.',
  },
]

export default function SignUpDetailsPanel() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-3 rounded-lg focus-visible:ring-brand-500"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <Home className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-lg font-bold text-ink">PropStat Pro</span>
      </Link>

      <div className="space-y-8">
        {highlights.map((item) => {
          const Icon = item.icon

          return (
            <article key={item.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                <span className="font-bold tracking-wide text-ink">{item.title}:</span>{' '}
                {item.description}
              </p>
            </article>
          )
        })}
      </div>

      <AuthDetailsBadges />
    </div>
  )
}
