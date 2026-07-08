import { useMemo, useState } from 'react'
import { CalendarClock, ChevronRight, MapPin } from 'lucide-react'
import { ApiError, api } from '../api/client'
import PortalPageHeader from '../components/portal/PortalPageHeader'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import { ListSkeleton } from '../components/ui/Skeleton'
import useAuth from '../hooks/useAuth'
import { usePortalWorkspace } from '../hooks/usePortalWorkspace'
import { formatPropertyAddress } from '../utils/formatters'
import { enrichInspection, filterInspectionsForInspector, isToday } from '../utils/portalHelpers'

function WalkthroughCard({ walkthrough, onStart, onComplete, updating }) {
  const isActive = walkthrough.status === 'in_progress'

  return (
    <article
      className={[
        'rounded-2xl border p-5 shadow-sm transition-all duration-200',
        isActive
          ? 'border-brand-500/40 bg-brand-50/30 ring-1 ring-brand-500/20 dark:border-brand-600/40 dark:bg-brand-950/20 dark:ring-brand-600/20'
          : 'border-slate-200 bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700',
      ].join(' ')}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
              ].join(' ')}
            >
              {isActive ? 'In progress' : walkthrough.formattedDateTime}
            </span>
            <span className="text-xs font-medium capitalize text-slate-500 dark:text-slate-400">
              {walkthrough.status.replace(/_/g, ' ')}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{walkthrough.propertyName}</h3>
          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">{walkthrough.unitLabel}</p>

          {walkthrough.property && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {formatPropertyAddress(walkthrough.property)}
            </p>
          )}

          {!isActive && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Scheduled for {walkthrough.formattedDateTime}
            </p>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
          {isActive ? (
            <>
              <Button size="md" variant="primary" className="w-full sm:w-auto" disabled>
                Continue walkthrough
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={updating}
                onClick={() => onComplete(walkthrough.id)}
              >
                {updating ? 'Saving…' : 'Mark complete'}
              </Button>
            </>
          ) : (
            <Button
              size="md"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={updating}
              onClick={() => onStart(walkthrough.id)}
            >
              {updating ? 'Starting…' : 'Start walkthrough'}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function InspectorDashboard() {
  const { user } = useAuth()
  const { data, lookups, loading, error, refetch } = usePortalWorkspace()
  const [updatingId, setUpdatingId] = useState(null)
  const [actionError, setActionError] = useState('')

  const todaysWalkthroughs = useMemo(() => {
    if (!data?.inspections || !lookups || !user?.id) return []

    return filterInspectionsForInspector(data.inspections, user.id)
      .filter(
        (inspection) =>
          isToday(inspection.scheduled_date) &&
          (inspection.status === 'scheduled' || inspection.status === 'in_progress'),
      )
      .map((inspection) => enrichInspection(inspection, lookups))
      .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
  }, [data?.inspections, lookups, user?.id])

  async function updateStatus(inspectionId, status) {
    setUpdatingId(inspectionId)
    setActionError('')
    try {
      await api.updateInspection(inspectionId, { status })
      await refetch()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Unable to update walkthrough.')
    } finally {
      setUpdatingId(null)
    }
  }

  const upcomingCount = todaysWalkthroughs.filter((item) => item.status !== 'in_progress').length

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Today's schedule"
        description={
          loading
            ? 'Loading your assigned walkthroughs…'
            : `${todaysWalkthroughs.length} property walkthrough${todaysWalkthroughs.length === 1 ? '' : 's'} assigned${upcomingCount > 0 ? ` · ${upcomingCount} remaining` : ''}`
        }
      />

      {actionError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
          {actionError}
        </p>
      )}

      {loading || !data ? (
        <ListSkeleton rows={3} />
      ) : todaysWalkthroughs.length ? (
        <div className="space-y-4">
          {todaysWalkthroughs.map((walkthrough) => (
            <WalkthroughCard
              key={walkthrough.id}
              walkthrough={walkthrough}
              updating={updatingId === walkthrough.id}
              onStart={(id) => updateStatus(id, 'in_progress')}
              onComplete={(id) => updateStatus(id, 'completed')}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No walkthroughs scheduled for today.
        </p>
      )}
    </div>
  )
}
