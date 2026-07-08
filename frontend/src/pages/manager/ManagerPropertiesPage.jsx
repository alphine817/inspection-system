import { Building2, Home, Users } from 'lucide-react'
import PropertyCard from '../../components/properties/PropertyCard'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import ErrorState from '../../components/ui/ErrorState'
import { ListSkeleton } from '../../components/ui/Skeleton'
import { usePortalWorkspace } from '../../hooks/usePortalWorkspace'
import { formatNumber } from '../../utils/formatters'

function SummaryStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default function ManagerPropertiesPage() {
  const { data, loading, error, refetch } = usePortalWorkspace()

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  const properties = data?.properties ?? []
  const units = data?.units ?? []
  const occupiedUnits = units.filter((unit) => unit.tenant_id).length
  const occupancyRate = units.length
    ? Math.round((occupiedUnits / units.length) * 100)
    : 0

  const unitsByProperty = properties.reduce((acc, property) => {
    acc[property.id] = units.filter((unit) => unit.property_id === property.id)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Property overview"
        description="Portfolio occupancy, unit distribution, and property health across your managed buildings."
      />

      {loading || !data ? (
        <ListSkeleton rows={3} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryStat label="Properties" value={formatNumber(properties.length)} icon={Building2} />
            <SummaryStat label="Total units" value={formatNumber(units.length)} icon={Home} />
            <SummaryStat label="Occupancy" value={`${occupancyRate}%`} icon={Users} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                units={unitsByProperty[property.id] ?? []}
              />
            ))}
          </div>

          {!properties.length && (
            <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No properties in the portfolio yet.
            </p>
          )}
        </>
      )}
    </div>
  )
}
