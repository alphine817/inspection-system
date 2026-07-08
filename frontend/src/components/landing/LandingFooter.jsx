import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Home className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink dark:text-slate-100">RentalInspect</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rental Property Inspection System</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
          >
            Features
          </a>
          <a
            href="#preview"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
          >
            Preview
          </a>
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
          >
            Dashboard
          </Link>
        </nav>

        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} RentalInspect. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
