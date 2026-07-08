import { Building2, CalendarClock, ClipboardCheck } from 'lucide-react'
import { landingImages } from '../../constants/landingImages'

const features = [
  {
    icon: Building2,
    title: 'Property Management',
    description:
      'Centralize your entire rental portfolio — addresses, units, occupancy, and notes — in one searchable, mobile-friendly view.',
    tag: 'Portfolio',
    image: landingImages.features.propertyManagement,
    imageAlt: 'Modern residential property with clean exterior landscaping',
  },
  {
    icon: CalendarClock,
    title: 'Automated Scheduling',
    description:
      'Assign inspectors to units with date-time validation, status tracking, and overdue alerts so nothing slips through the cracks.',
    tag: 'Scheduling',
    image: landingImages.features.scheduling,
    imageAlt: 'Planner and calendar used for scheduling property inspections',
  },
  {
    icon: ClipboardCheck,
    title: 'Inspection Checklists',
    description:
      'Standardize move-in, move-out, and routine inspections with structured checklists, notes, and completion history.',
    tag: 'Compliance',
    image: landingImages.features.checklists,
    imageAlt: 'Inspector conducting a walk-through with a checklist',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Core pillars
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-4xl">
            Everything you need to run inspections at scale
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            Built for property managers who need clarity, speed, and accountability across
            every unit in their portfolio.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-800 sm:p-8"
              >
                <div className="mb-5 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-100">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-ink dark:text-slate-100">{feature.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
