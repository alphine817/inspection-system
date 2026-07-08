const statusStyles = {
  scheduled: {
    label: 'Scheduled',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-sky-50 text-sky-800 ring-sky-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-50 text-red-700 ring-red-200',
  },
  good: {
    label: 'Good',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-50 text-red-700 ring-red-200',
  },
}

export default function StatusBadge({ status, label, className = '' }) {
  const config = statusStyles[status] || statusStyles.scheduled

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        config.className,
        className,
      ].join(' ')}
    >
      {label || config.label}
    </span>
  )
}
