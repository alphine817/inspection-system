import { Menu, RefreshCw, X } from 'lucide-react'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'

export default function Header({ title, subtitle, onMenuToggle, menuOpen, onRefresh, refreshing }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            className="mt-0.5 inline-flex rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700 lg:hidden"
            onClick={onMenuToggle}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
