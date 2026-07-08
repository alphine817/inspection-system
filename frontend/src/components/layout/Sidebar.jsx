import {
  Building2,
  ClipboardCheck,
  Home,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/properties', label: 'Properties', icon: Building2 },
  { to: '/inspections', label: 'Inspections', icon: ClipboardCheck },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function NavItem({ item, onNavigate }) {
  const Icon = item.icon

  if (item.disabled) {
    return (
      <span
        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400"
        title="Coming soon"
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="truncate">{item.label}</span>
        <span className="ml-auto hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 lg:inline">
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
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
        ].join(' ')
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ onNavigate }) {
  const settings = useSettings()

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <Home className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">RentalInspect</p>
          <p className="truncate text-xs text-slate-500">Property Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavItem key={item.label} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-800">{settings.workspaceName}</p>
          <p className="mt-0.5 text-xs text-slate-500">Admin dashboard</p>
        </div>
      </div>
    </aside>
  )
}
