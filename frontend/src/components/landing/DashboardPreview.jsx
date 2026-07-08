import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Home,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { landingImages } from '../../constants/landingImages'
import Button from '../ui/Button'

const stats = [
  { label: 'Today', value: '4', icon: CalendarClock, tone: 'brand' },
  { label: 'Overdue', value: '1', icon: AlertTriangle, tone: 'danger' },
  { label: 'Properties', value: '12', icon: Building2, tone: 'neutral' },
  { label: 'Units', value: '48', icon: Home, tone: 'neutral' },
]

const inspections = [
  {
    unit: 'Sunset Apts · Unit 204',
    inspector: 'Jane Mwangi',
    status: 'Scheduled',
    statusTone: 'brand',
    date: 'Today, 2:00 PM',
    propertyImage: landingImages.properties.sunset,
    avatar: landingImages.avatars.jane,
  },
  {
    unit: 'Greenview · Unit 12B',
    inspector: 'David Ochieng',
    status: 'In Progress',
    statusTone: 'warning',
    date: 'Today, 10:30 AM',
    propertyImage: landingImages.properties.greenview,
    avatar: landingImages.avatars.david,
  },
  {
    unit: 'Lakeview · Unit 7',
    inspector: 'Sarah Kimani',
    status: 'Completed',
    statusTone: 'success',
    date: 'Yesterday',
    propertyImage: landingImages.properties.lakeview,
    avatar: landingImages.avatars.sarah,
  },
]

const propertyThumbnails = [
  { name: 'Sunset Apts', image: landingImages.properties.sunset },
  { name: 'Greenview', image: landingImages.properties.greenview },
  { name: 'Lakeview', image: landingImages.properties.lakeview },
]

const toneMap = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  danger: 'bg-red-50 text-red-700 ring-red-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
}

const statusToneMap = {
  brand: 'bg-brand-50 text-brand-700',
  warning: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
}

export default function DashboardPreview() {
  return (
    <section id="preview" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Dashboard preview
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Your portfolio at a glance
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              See inspections due today, overdue work, and property stats in a single view.
              The same clean interface powers every page in RentalInspect.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                'Real-time stats for inspections, properties, and units',
                'Filterable inspection lists with status badges',
                'Responsive layout from mobile to desktop',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700 sm:text-base">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link to="/dashboard">
                <Button size="lg">Open Live Dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 rounded-3xl bg-brand-50/60 blur-xl sm:-inset-6"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="ml-3 truncate text-xs font-medium text-slate-500">
                  rentalinspect.app/dashboard
                </span>
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">Inspection Dashboard</p>
                    <p className="hidden truncate text-xs text-slate-500 sm:block">
                      Monitor properties, units, and inspection activity
                    </p>
                  </div>
                  <div className="hidden shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 sm:block">
                    Refresh
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                              {stat.label}
                            </p>
                            <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">
                              {stat.value}
                            </p>
                          </div>
                          <div
                            className={[
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset sm:h-9 sm:w-9',
                              toneMap[stat.tone],
                            ].join(' ')}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                    Portfolio
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {propertyThumbnails.map((property) => (
                      <div
                        key={property.name}
                        className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                      >
                        <img
                          src={property.image}
                          alt={property.name}
                          className="h-14 w-full object-cover sm:h-16"
                          loading="lazy"
                          decoding="async"
                        />
                        <p className="truncate px-2 py-1.5 text-[10px] font-semibold text-ink sm:text-xs">
                          {property.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-brand-600" aria-hidden="true" />
                      <p className="text-sm font-bold text-ink">Recent Inspections</p>
                    </div>
                    <span className="hidden text-xs font-semibold text-brand-600 sm:inline">
                      Schedule
                    </span>
                  </div>

                  <ul className="divide-y divide-slate-100">
                    {inspections.map((item) => (
                      <li
                        key={item.unit}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={item.propertyImage}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">{item.unit}</p>
                            <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                              <img
                                src={item.avatar}
                                alt=""
                                className="h-4 w-4 shrink-0 rounded-full object-cover ring-1 ring-white"
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="truncate">
                                {item.inspector} · {item.date}
                              </span>
                            </p>
                          </div>
                        </div>
                        <span
                          className={[
                            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs',
                            statusToneMap[item.statusTone],
                          ].join(' ')}
                        >
                          {item.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
