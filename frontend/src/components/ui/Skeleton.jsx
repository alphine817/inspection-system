export function Skeleton({ className = '' }) {
  return (
    <div
      className={['animate-shimmer rounded-lg bg-slate-200/70 dark:bg-slate-700/70', className].join(' ')}
      aria-hidden="true"
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="hidden h-10 w-24 md:block" />
          <Skeleton className="hidden h-10 w-28 lg:block" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800/60">
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      ))}
    </div>
  )
}
