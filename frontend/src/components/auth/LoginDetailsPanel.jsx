import { BarChart3, Building2, ClipboardList, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthDetailsBadges from './AuthDetailsBadges'

const features = [
  {
    title: 'PROPERTY DATA',
    icon: Building2,
    description:
      'Centralize addresses, units, occupancy, and portfolio notes in one searchable workspace.',
  },
  {
    title: 'INSPECTION REPORTS',
    icon: ClipboardList,
    description:
      'Generate structured move-in, move-out, and routine inspection records with clear status tracking.',
  },
  {
    title: 'ANALYTICS',
    icon: BarChart3,
    description:
      'Monitor overdue work, scheduled visits, and property performance with live dashboard insights.',
  },
]

export default function LoginDetailsPanel() {
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
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <article key={feature.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                <span className="font-bold tracking-wide text-ink">{feature.title}:</span>{' '}
                {feature.description}
              </p>
            </article>
          )
        })}
      </div>

      <AuthDetailsBadges />
    </div>
  )
}
