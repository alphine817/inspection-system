export default function SettingsToggle({ id, label, description, checked, onChange, disabled = false }) {
  return (
    <label
      htmlFor={id}
      className={[
        'flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 transition-colors',
        disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-slate-300 hover:bg-slate-50/80',
      ].join(' ')}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className={[
          'mt-0.5 h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-slate-200',
          'transition-colors duration-200',
          'checked:bg-brand-600',
          'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed',
          'relative',
          "after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-['']",
          'checked:after:translate-x-4',
        ].join(' ')}
      />
    </label>
  )
}
