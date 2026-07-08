import {
  Building2,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UserCircle,
  Users,
  Wrench,
} from 'lucide-react'

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'property_manager',
  INSPECTOR: 'inspector',
  TENANT: 'tenant',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.INSPECTOR]: 'Inspector',
  [ROLES.TENANT]: 'Tenant',
}

export const SIGNUP_ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Admin' },
  { value: ROLES.MANAGER, label: 'Manager' },
  { value: ROLES.INSPECTOR, label: 'Inspector' },
  { value: ROLES.TENANT, label: 'Tenant' },
]

export const ROLE_DASHBOARD_PATHS = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.MANAGER]: '/manager/dashboard',
  [ROLES.INSPECTOR]: '/inspector/dashboard',
  [ROLES.TENANT]: '/tenant/dashboard',
}

export const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
  { to: '/admin/inspections', label: 'Inspections', icon: ClipboardCheck },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export const MANAGER_NAV = [
  { to: '/manager/dashboard', label: 'Task Board', icon: LayoutDashboard, end: true },
  { to: '/manager/properties', label: 'Property Overview', icon: Building2 },
  { to: '/manager/assign', label: 'Assign Tasks', icon: ClipboardList },
  { to: '/manager/approvals', label: 'Approvals', icon: CheckSquare },
  { to: '/manager/communications', label: 'Tenant Communications', icon: MessageSquare },
]

export const INSPECTOR_NAV = [
  { to: '/inspector/dashboard', label: "Today's Schedule", icon: CalendarDays, end: true },
  { to: '/inspector/history', label: 'Inspection History', icon: History },
  { to: '/inspector/profile', label: 'Profile', icon: UserCircle },
]

export const TENANT_NAV = [
  { to: '/tenant/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tenant/lease', label: 'My Lease', icon: FileText },
  { to: '/tenant/reports', label: 'Report History', icon: History },
  { to: '/tenant/maintenance', label: 'Request Maintenance', icon: Wrench },
]

export const ROLE_NAV_CONFIG = {
  [ROLES.ADMIN]: ADMIN_NAV,
  [ROLES.MANAGER]: MANAGER_NAV,
  [ROLES.INSPECTOR]: INSPECTOR_NAV,
  [ROLES.TENANT]: TENANT_NAV,
}

export const ROLE_PORTAL_LABELS = {
  [ROLES.ADMIN]: 'Admin dashboard',
  [ROLES.MANAGER]: 'Manager portal',
  [ROLES.INSPECTOR]: 'Inspector portal',
  [ROLES.TENANT]: 'Tenant portal',
}

export function getDashboardPathForRole(role) {
  return ROLE_DASHBOARD_PATHS[role] ?? ROLE_DASHBOARD_PATHS[ROLES.ADMIN]
}

export function getNavItemsForRole(role) {
  return ROLE_NAV_CONFIG[role] ?? ADMIN_NAV
}

export const PROTECTED_ROUTE_PREFIXES = [
  '/admin',
  '/manager',
  '/inspector',
  '/tenant',
]

export function isProtectedPath(pathname) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
