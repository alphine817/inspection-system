import {
  BellRing,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Receipt,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { landingImages } from '../../constants/landingImages'
import Button from '../ui/Button'

const steps = [
  {
    step: '01',
    icon: CalendarCheck,
    title: 'Schedule & sync',
    description:
      'Link rent due dates to inspection cycles so move-in, move-out, and routine visits stay aligned with lease milestones.',
  },
  {
    step: '02',
    icon: BellRing,
    title: 'Automated reminders',
    description:
      'Send tenants branded email and SMS nudges before rent is due, on the due date, and after overdue thresholds.',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Collect & reconcile',
    description:
      'Track payments, partial balances, and late fees in one ledger — no more spreadsheets or manual follow-ups.',
  },
]

const benefits = [
  'Reduce late payments with configurable reminder cadences',
  'Auto-generate rent receipts after each successful payment',
  'Flag units with overdue rent before scheduling inspections',
  'Export payment history for accounting and tax reporting',
]

export default function RentAutomationSection() {
  return (
    <section id="rent-automation" className="scroll-mt-24 bg-slate-50 py-16 dark:bg-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div
              className="absolute -inset-3 rounded-3xl bg-brand-50/60 blur-xl sm:-inset-6"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/70">
              <img
                src={landingImages.rentAutomation}
                alt="Property manager reviewing rent collection dashboard on laptop"
                className="h-48 w-full object-cover sm:h-56"
                loading="lazy"
                decoding="async"
              />

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Rent ledger
                    </p>
                    <p className="mt-1 text-lg font-bold text-ink dark:text-slate-100">March collections</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                    92% collected
                  </span>
                </div>

                <ul className="space-y-3">
                  {[
                    { unit: 'Sunset Apts · Unit 204', amount: 'KES 45,000', status: 'Paid', tone: 'success' },
                    { unit: 'Greenview · Unit 12B', amount: 'KES 38,500', status: 'Due today', tone: 'warning' },
                    { unit: 'Lakeview · Unit 7', amount: 'KES 52,000', status: 'Overdue', tone: 'danger' },
                  ].map((row) => (
                    <li
                      key={row.unit}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{row.unit}</p>
                        <p className="text-xs text-slate-500">{row.amount}</p>
                      </div>
                      <span
                        className={[
                          'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-xs',
                          row.tone === 'success' && 'bg-emerald-50 text-emerald-700',
                          row.tone === 'warning' && 'bg-amber-50 text-amber-700',
                          row.tone === 'danger' && 'bg-red-50 text-red-700',
                        ].join(' ')}
                      >
                        {row.status}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 ring-1 ring-brand-100">
                  <Receipt className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                    <span className="font-semibold text-ink dark:text-slate-100">3 reminders sent</span> automatically
                    this week — no manual follow-up needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Rent automation
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-4xl">
              Collect rent on autopilot
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              PropStat Pro connects rent collection with your inspection workflow — so you
              always know which units are paid, overdue, or ready for the next visit.
            </p>

            <div className="mt-8 space-y-5">
              {steps.map((item) => {
                const Icon = item.icon

                return (
                  <article key={item.step} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wide text-brand-600">{item.step}</p>
                      <h3 className="mt-0.5 text-base font-bold text-ink dark:text-slate-100">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>

            <ul className="mt-8 space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 sm:text-base">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link to="/signup">
                <Button size="lg">
                  <Wallet className="h-4 w-4" aria-hidden="true" />
                  Start automating rent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
