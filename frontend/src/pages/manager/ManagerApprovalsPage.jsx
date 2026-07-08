import { useMemo, useState } from 'react'
import { CheckCircle2, FileCheck } from 'lucide-react'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import StatusBadge from '../../components/ui/StatusBadge'
import { ListSkeleton } from '../../components/ui/Skeleton'
import useAuth from '../../hooks/useAuth'
import { usePortalWorkspace } from '../../hooks/usePortalWorkspace'
import { enrichInspection } from '../../utils/portalHelpers'
import { approveInspection, getApprovedInspectionIds } from '../../utils/tenantStorage'

export default function ManagerApprovalsPage() {
  const { user } = useAuth()
  const { data, lookups, loading, error, refetch } = usePortalWorkspace()
  const [approvedIds, setApprovedIds] = useState(() => getApprovedInspectionIds(user?.id))

  const pendingApprovals = useMemo(() => {
    if (!data?.inspections || !lookups) return []

    return data.inspections
      .filter((inspection) => inspection.status === 'completed' && !approvedIds.has(inspection.id))
      .map((inspection) => enrichInspection(inspection, lookups))
  }, [data?.inspections, lookups, approvedIds])

  function handleApprove(inspectionId) {
    approveInspection(user.id, inspectionId)
    setApprovedIds(getApprovedInspectionIds(user.id))
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Approvals"
        description="Review completed inspection reports and sign off before closing the work order."
        action={
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-900/50 dark:text-violet-300">
            {pendingApprovals.length} awaiting review
          </span>
        }
      />

      {loading || !data ? (
        <ListSkeleton rows={4} />
      ) : pendingApprovals.length ? (
        <ul className="space-y-4">
          {pendingApprovals.map((inspection) => (
            <li
              key={inspection.id}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status="completed" />
                    {inspection.overdue && <StatusBadge status="overdue" label="Was overdue" />}
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
                    {inspection.propertyName}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{inspection.unitLabel}</p>
                  <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">Inspector</dt>
                      <dd className="font-medium text-slate-800 dark:text-slate-200">{inspection.inspectorName}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">Submitted</dt>
                      <dd className="font-medium text-slate-800 dark:text-slate-200">{inspection.formattedDateTime}</dd>
                    </div>
                  </dl>
                  {inspection.notes && (
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      {inspection.notes}
                    </p>
                  )}
                </div>
                <Button size="sm" onClick={() => handleApprove(inspection.id)} className="shrink-0">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Approve report
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <FileCheck className="h-10 w-10 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">All caught up</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            No completed inspections are waiting for your approval.
          </p>
        </div>
      )}
    </div>
  )
}
