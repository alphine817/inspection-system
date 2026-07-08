import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'

export default function AuthVisualPanel({
  backgroundSrc,
  backgroundAlt,
  children,
}) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
      <img
        src={backgroundSrc}
        alt={backgroundAlt}
        className="absolute inset-0 h-screen w-full scale-105 object-cover blur-[6px]"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <div className="absolute inset-0 bg-white/85 dark:bg-slate-950/80" aria-hidden="true" />

      <div className="absolute left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm dark:bg-slate-900/70">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
            <Home className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">PropStat Pro</span>
        </Link>
        <ThemeToggle className="rounded-full bg-white/80 shadow-sm backdrop-blur-sm dark:bg-slate-900/70" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-sm sm:p-8 dark:border-slate-700/70 dark:bg-slate-900/90">
          {children}
        </div>
      </div>
    </div>
  )
}
