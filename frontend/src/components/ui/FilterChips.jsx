export default function FilterChips({ options, value, onChange, className = '' }) {
  return (
    <div
      className={['flex flex-wrap gap-2', className].join(' ')}
      role="tablist"
      aria-label="Filter options"
    >
      {options.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={[
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm',
              'focus-visible:ring-brand-500',
              isActive
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 active:bg-brand-700'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:active:bg-slate-600',
            ].join(' ')}
          >
            {option.label}
            {option.count != null && (
              <span
                className={[
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                ].join(' ')}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
