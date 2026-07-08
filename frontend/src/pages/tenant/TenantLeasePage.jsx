import { useMemo } from 'react'
import { CalendarDays, FileText, Home, MapPin } from 'lucide-react'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import ErrorState from '../../components/ui/ErrorState'
import StatusBadge from '../../components/ui/StatusBadge'
import { ListSkeleton } from '../../components/ui/Skeleton'
import useAuth from '../../hooks/useAuth'
import { usePortalWorkspace } from '../../hooks/usePortalWorkspace'
import { formatPropertyAddress } from '../../utils/formatters'
import { getTenantUnits } from '../../utils/portalHelpers'

export default function TenantLeasePage() {
  const { user } = useAuth()
  const { data, lookups, loading, error, refetch } = usePortalWorkspace()

  const myUnits = useMemo(() => {
    if (!data?.units || !user?.id) return []
    return getTenantUnits(data.units, user.id)
  }, [data?.units, user?.id])

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="My lease"
        description="View your active unit assignment, property details, and lease summary."
      />

      {loading || !data ? (
        <ListSkeleton rows={3} />
      ) : myUnits.length ? (
        <ul className="space-y-4">
          {myUnits.map((unit) => {
            const property = lookups?.propertiesById[unit.property_id]

            return (
              <li
                key={unit.id}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status="good" label="Active lease" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Unit {unit.unit_number}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {property?.name ?? 'Assigned property'}
                </h3>

                {property && (
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {formatPropertyAddress(property)}
                  </p>
                )}

                <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <Home className="h-3.5 w-3.5" aria-hidden="true" />
                      Bedrooms
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {unit.bedrooms ?? '—'}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      Bathrooms
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {unit.bathrooms ?? '—'}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      Square feet
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {unit.square_feet ? `${unit.square_feet} sq ft` : '—'}
                    </dd>
                  </div>
                </dl>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No active lease is linked to your account yet. Contact your property manager if this looks incorrect.
        </p>
      )}
    </div>
  )
}
