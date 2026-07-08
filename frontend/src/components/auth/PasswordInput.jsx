import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({
  id,
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  ...props
}) {
  const [visible, setVisible] = useState(false)
  const inputId = id || props.name

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={[
            'w-full rounded-xl border bg-white py-3 pr-12 pl-4 text-sm text-ink shadow-sm transition-all duration-200',
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

        <button
          type="button"
          className="absolute top-1/2 right-2 inline-flex -translate-y-1/2 touch-manipulation rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-brand-500 active:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-300 dark:active:bg-slate-600"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

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
