import { Building2, Plus } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import SearchInput from '../ui/SearchInput'
import { ListSkeleton } from '../ui/Skeleton'
import PropertyCard from './PropertyCard'

export default function PropertiesGrid({
  properties,
  unitsByProperty,
  loading,
  onAddProperty,
  hasSearch = false,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5">
            <ListSkeleton rows={2} />
          </div>
        ))}
      </div>
    )
  }

  if (!properties.length) {
    return (
      <EmptyState
        icon={Building2}
        title={hasSearch ? 'No matching properties' : 'No properties found'}
        description={
          hasSearch
            ? 'Try a different search term or clear the search to see all properties.'
            : 'Add rental properties to your portfolio to start managing units and scheduling inspections.'
        }
        actionLabel={hasSearch ? undefined : 'Add property'}
        onAction={hasSearch ? undefined : onAddProperty}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          units={unitsByProperty[property.id] ?? []}
        />
      ))}
    </div>
  )
}

export function PropertiesToolbar({ search, onSearchChange, onAddProperty, resultCount }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-md">
        <SearchInput
          id="properties-search"
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name, city, or address…"
        />
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{resultCount}</span> properties
        </p>
        <button
          type="button"
          onClick={onAddProperty}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 active:bg-brand-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add property
        </button>
      </div>
    </div>
  )
}
