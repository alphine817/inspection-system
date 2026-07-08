import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthBrandLogo({ showName = true, className = '', inline = false }) {
  return (
    <Link
      to="/"
      className={['inline-flex items-center gap-3 rounded-lg focus-visible:ring-brand-500', className].join(' ')}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/20">
        <Home className="h-5 w-5" aria-hidden="true" />
      </div>
      {showName && !inline && (
        <div className="min-w-0 text-left">
          <p className="text-base font-bold text-ink">PropStat Pro</p>
          <p className="text-xs text-slate-500">Property Management</p>
        </div>
      )}
    </Link>
  )
}
