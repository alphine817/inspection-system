import { useMemo } from 'react'
import { History } from 'lucide-react'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import ErrorState from '../../components/ui/ErrorState'
import StatusBadge from '../../components/ui/StatusBadge'
import { ListSkeleton } from '../../components/ui/Skeleton'
import useAuth from '../../hooks/useAuth'
import { usePortalWorkspace } from '../../hooks/usePortalWorkspace'
import { enrichInspection, filterInspectionsForInspector } from '../../utils/portalHelpers'

export default function InspectorHistoryPage() {
  const { user } = useAuth()
  const { data, lookups, loading, error, refetch } = usePortalWorkspace()

  const history = useMemo(() => {
    if (!data?.inspections || !lookups || !user?.id) return []

    return filterInspectionsForInspector(data.inspections, user.id)
      .filter((inspection) => inspection.status === 'completed' || inspection.status === 'cancelled')
      .map((inspection) => enrichInspection(inspection, lookups))
  }, [data?.inspections, lookups, user?.id])

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Inspection history"
        description="Browse completed and cancelled walkthroughs you have conducted."
        action={
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {history.length} record{history.length === 1 ? '' : 's'}
          </span>
        }
      />

      {loading || !data ? (
        <ListSkeleton rows={5} />
      ) : history.length ? (
        <ul className="space-y-3">
          {history.map((inspection) => (
            <li
              key={inspection.id}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={inspection.status} />
                    {inspection.overdue && inspection.status === 'completed' && (
                      <StatusBadge status="overdue" label="Completed late" />
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">
                    {inspection.propertyName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{inspection.unitLabel}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {inspection.formattedDateTime}
                  </p>
                  {inspection.notes && (
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      {inspection.notes}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <History className="h-10 w-10 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">No history yet</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Completed walkthroughs will appear here after you finish them.
          </p>
        </div>
      )}
    </div>
  )
}
