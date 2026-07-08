export default function AuthInput({
  id,
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  ...props
}) {
  const inputId = id || props.name

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink shadow-sm transition-all duration-200',
          'placeholder:text-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
          'hover:border-slate-300 dark:hover:border-slate-600',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-500',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-700',
          className,
        ].join(' ')}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
