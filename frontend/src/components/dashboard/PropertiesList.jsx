import { Building2, Plus } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { ListSkeleton } from '../ui/Skeleton'

function formatAddress(property) {
  const parts = [property.address_line1]
  if (property.address_line2) parts.push(property.address_line2)
  parts.push(`${property.city}, ${property.state}`)
  return parts.join(', ')
}

export default function PropertiesList({ properties, units, loading, onAddProperty }) {
  if (loading) {
    return <ListSkeleton rows={3} />
  }

  if (!properties.length) {
    return (
      <EmptyState
        icon={Building2}
        title="No properties in portfolio"
        description="Add your first rental property to begin assigning units and scheduling inspections."
        actionLabel="Add property"
        onAction={onAddProperty}
      />
    )
  }

  const unitsByProperty = units.reduce((acc, unit) => {
    acc[unit.property_id] = (acc[unit.property_id] || 0) + 1
    return acc
  }, {})

  return (
    <ul className="space-y-3">
      {properties.map((property) => (
        <li
          key={property.id}
          className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition-all duration-200 hover:border-brand-200 hover:bg-white hover:shadow-sm dark:border-slate-800/60 dark:bg-slate-950/30 dark:hover:border-brand-800/60 dark:hover:bg-slate-900/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{property.name}</p>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{formatAddress(property)}</p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
              {unitsByProperty[property.id] || 0} units
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function PropertiesPanel({ properties, units, loading, onAddProperty }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Properties</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Active buildings in your portfolio</p>
        </div>
        <button
          type="button"
          onClick={onAddProperty}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 active:bg-brand-100 dark:text-brand-400 dark:hover:bg-brand-950 dark:active:bg-brand-900"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
      </div>
      <PropertiesList
        properties={properties}
        units={units}
        loading={loading}
        onAddProperty={onAddProperty}
      />
    </section>
  )
}
