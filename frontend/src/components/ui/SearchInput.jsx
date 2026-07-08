import { Search, X } from 'lucide-react'

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
  id = 'search-input',
}) {
  return (
    <div className={['relative', className].join(' ')}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={[
          'w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-800 shadow-sm',
          'placeholder:text-slate-400',
          'transition-all duration-200 hover:border-slate-300',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none',
        ].join(' ')}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:bg-slate-200"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
