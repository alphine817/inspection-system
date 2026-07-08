import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, UserRound } from 'lucide-react'
import PortalPageHeader from '../components/portal/PortalPageHeader'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import { ListSkeleton } from '../components/ui/Skeleton'
import useAuth from '../hooks/useAuth'
import { usePortalWorkspace } from '../hooks/usePortalWorkspace'
import { groupInspectionsForTaskBoard } from '../utils/portalHelpers'
import { getApprovedInspectionIds } from '../utils/tenantStorage'

const COLUMN_META = {
  pending: {
    title: 'Pending Assignment',
    tone: 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  },
  active: {
    title: 'Active in Field',
    tone: 'border-brand-500/30 bg-brand-50/40 dark:bg-brand-950/20',
    badge: 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300',
  },
  review: {
    title: 'Awaiting Review',
    tone: 'border-violet-500/30 bg-violet-50/40 dark:bg-violet-950/20',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  },
}

function TaskCard({ inspection, columnId }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{inspection.propertyName}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{inspection.unitLabel}</p>
        </div>
        {inspection.overdue && (
          <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700 dark:bg-red-900/50 dark:text-red-300">
            Overdue
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        {columnId === 'pending' && (
          <p className="flex items-center gap-1.5">
            <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Due {inspection.formattedDate}
          </p>
        )}
        {(columnId === 'active' || columnId === 'review') && (
          <>
            <p className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {inspection.inspectorName}
            </p>
            <p>{columnId === 'active' ? `Scheduled ${inspection.formattedDateTime}` : `Submitted ${inspection.formattedDateTime}`}</p>
          </>
        )}
      </div>

      <div className="mt-4">
        {columnId === 'pending' && (
          <Link to="/manager/assign">
            <Button size="sm" className="w-full">
              Assign inspector
            </Button>
          </Link>
        )}
        {columnId === 'active' && (
          <Button size="sm" variant="secondary" className="w-full" disabled>
            In progress
          </Button>
        )}
        {columnId === 'review' && (
          <Link to="/manager/approvals">
            <Button size="sm" variant="secondary" className="w-full">
              Review report
            </Button>
          </Link>
        )}
      </div>
    </article>
  )
}

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { data, lookups, loading, error, refetch } = usePortalWorkspace()
  const [approvedIds] = useState(() => getApprovedInspectionIds(user?.id))

  const taskBoard = useMemo(() => {
    if (!data?.inspections || !lookups) {
      return { pending: [], active: [], review: [] }
    }
    return groupInspectionsForTaskBoard(data.inspections, lookups, approvedIds)
  }, [data?.inspections, lookups, approvedIds])

  const totalItems = taskBoard.pending.length + taskBoard.active.length + taskBoard.review.length

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Inspection task board"
        description="Track assignments from scheduling through field work and final approval."
        action={
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {loading ? 'Loading…' : `${totalItems} active item${totalItems === 1 ? '' : 's'}`}
          </p>
        }
      />

      {loading || !data ? (
        <ListSkeleton rows={3} />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {Object.entries(taskBoard).map(([columnId, items]) => {
            const meta = COLUMN_META[columnId]
            return (
              <section
                key={columnId}
                className={['rounded-2xl border p-4 dark:border-slate-800', meta.tone].join(' ')}
                aria-label={meta.title}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{meta.title}</h3>
                  <span className={['rounded-full px-2.5 py-0.5 text-xs font-semibold', meta.badge].join(' ')}>
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length ? (
                    items.map((inspection) => (
                      <TaskCard key={inspection.id} inspection={inspection} columnId={columnId} />
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
                      No items in this column.
                    </p>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
