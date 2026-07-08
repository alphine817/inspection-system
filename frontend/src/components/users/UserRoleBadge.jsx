const roleStyles = {
  admin: {
    label: 'Admin',
    className: 'bg-violet-50 text-violet-800 ring-violet-200',
  },
  property_manager: {
    label: 'Property Manager',
    className: 'bg-sky-50 text-sky-800 ring-sky-200',
  },
  inspector: {
    label: 'Inspector',
    className: 'bg-teal-50 text-teal-800 ring-teal-200',
  },
  tenant: {
    label: 'Tenant',
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
}

export default function UserRoleBadge({ role, className = '' }) {
  const config = roleStyles[role] || roleStyles.tenant

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        config.className,
        className,
      ].join(' ')}
    >
      {config.label}
    </span>
  )
}

export function getRoleLabel(role) {
  return roleStyles[role]?.label ?? role
}
