import {
  AlertTriangle,
  Building2,
  CalendarClock,
  ClipboardList,
  Home,
  Wrench,
} from 'lucide-react'
import { formatNumber } from '../../utils/formatters'

const toneStyles = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  danger: 'bg-red-50 text-red-700 ring-red-100',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export default function StatCard({ label, value, hint, tone = 'neutral', icon: Icon, alert }) {
  return (
    <article
      className={[
        'rounded-2xl border bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md',
        alert ? 'border-red-200' : 'border-slate-200',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p
            className={[
              'mt-2 text-3xl font-bold tracking-tight',
              alert ? 'text-red-700' : 'text-slate-900',
            ].join(' ')}
          >
            {formatNumber(value)}
          </p>
          {hint && <p className="mt-1 truncate text-xs text-slate-500">{hint}</p>}
        </div>
        <div
          className={[
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
            toneStyles[tone],
          ].join(' ')}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}

export function buildStatCards(stats) {
  return [
    {
      key: 'inspections_today',
      label: 'Inspections Today',
      value: stats.inspections_today,
      hint: 'Scheduled for today',
      tone: 'brand',
      icon: CalendarClock,
    },
    {
      key: 'overdue_inspections',
      label: 'Overdue',
      value: stats.overdue_inspections,
      hint: stats.overdue_inspections > 0 ? 'Needs immediate attention' : 'All caught up',
      tone: stats.overdue_inspections > 0 ? 'danger' : 'success',
      icon: AlertTriangle,
      alert: stats.overdue_inspections > 0,
    },
    {
      key: 'open_maintenance_tickets',
      label: 'Maintenance',
      value: stats.open_maintenance_tickets,
      hint: 'Open tickets',
      tone: stats.open_maintenance_tickets > 0 ? 'warning' : 'neutral',
      icon: Wrench,
    },
    {
      key: 'total_properties',
      label: 'Properties',
      value: stats.total_properties,
      hint: 'Active portfolio',
      tone: 'neutral',
      icon: Building2,
    },
    {
      key: 'total_units',
      label: 'Units',
      value: stats.total_units,
      hint: 'Across all properties',
      tone: 'neutral',
      icon: Home,
    },
  ]
}

export function StatsGrid({ stats }) {
  const cards = buildStatCards(stats)

  return (
    <section
      aria-label="Dashboard statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      {cards.map((card) => (
        <StatCard key={card.key} {...card} />
      ))}
    </section>
  )
}
