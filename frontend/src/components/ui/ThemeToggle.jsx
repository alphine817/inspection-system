import { Moon, Sun } from 'lucide-react'
import useTheme from '../../hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        'inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors duration-200',
        'hover:bg-slate-100 active:bg-slate-200',
        'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
        'focus-visible:ring-brand-500',
        className,
      ].join(' ')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )
}
