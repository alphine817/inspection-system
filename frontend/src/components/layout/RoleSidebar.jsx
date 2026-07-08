import { LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ROLE_LABELS, ROLE_PORTAL_LABELS, getNavItemsForRole } from '../../constants/rbac'
import useAuth from '../../hooks/useAuth'
import { useSettings } from '../../hooks/useSettings'
import Button from '../ui/Button'

function NavItem({ item, onNavigate }) {
  const Icon = item.icon

  if (item.disabled) {
    return (
      <span
        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 dark:text-slate-500"
        title="Coming soon"
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="truncate">{item.label}</span>
        <span className="ml-auto hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400 lg:inline">
          Soon
        </span>
      </span>
    )
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
          isActive
            ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:active:bg-slate-700',
        ].join(' ')
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

export default function RoleSidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const settings = useSettings()
  const navigate = useNavigate()

  const navItems = getNavItemsForRole(user?.role)
  const portalLabel = ROLE_PORTAL_LABELS[user?.role] ?? 'Workspace'
  const roleLabel = ROLE_LABELS[user?.role] ?? 'User'

  function handleLogout() {
    logout()
    onNavigate?.()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <span className="text-sm font-bold">RI</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">RentalInspect</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{portalLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Signed in as
          </p>
          <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
            {user?.displayName ?? 'User'}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">{roleLabel}</p>
          {settings.workspaceName && (
            <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">{settings.workspaceName}</p>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
