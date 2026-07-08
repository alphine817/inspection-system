import { CalendarPlus, ClipboardList } from 'lucide-react'
import {
  formatDateTime,
  getInspectorName,
  getUnitLabel,
  resolveInspectionStatus,
} from '../../utils/formatters'
import EmptyState from '../ui/EmptyState'
import FilterChips from '../ui/FilterChips'
import SearchInput from '../ui/SearchInput'
import StatusBadge from '../ui/StatusBadge'
import { TableSkeleton } from '../ui/Skeleton'

export default function InspectionsList({
  inspections,
  unitsById,
  propertiesById,
  usersById,
  loading,
  onSchedule,
  emptyTitle = 'No inspections found',
  emptyDescription = 'Try adjusting your filters or schedule a new inspection.',
}) {
  if (loading) {
    return <TableSkeleton rows={8} />
  }

  if (!inspections.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Schedule inspection"
        onAction={onSchedule}
      />
    )
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 lg:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Unit / Property</th>
              <th className="px-4 py-3">Inspector</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="hidden px-4 py-3 xl:table-cell">Completed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {inspections.map((inspection) => {
              const unit = unitsById[inspection.unit_id]
              const inspector = usersById[inspection.inspector_id]
              const status = resolveInspectionStatus(inspection)

              return (
                <tr
                  key={inspection.id}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="max-w-[240px] px-4 py-3">
                    <p className="truncate font-semibold text-slate-900">
                      {getUnitLabel(unit, propertiesById)}
                    </p>
                    {inspection.notes && (
                      <p className="mt-0.5 truncate text-xs text-slate-500">{inspection.notes}</p>
                    )}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-slate-600">
                    {getInspectorName(inspector)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDateTime(inspection.scheduled_date)}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-slate-600 xl:table-cell">
                    {formatDateTime(inspection.completed_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {inspections.map((inspection) => {
          const unit = unitsById[inspection.unit_id]
          const inspector = usersById[inspection.inspector_id]
          const status = resolveInspectionStatus(inspection)

          return (
            <article
              key={inspection.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {getUnitLabel(unit, propertiesById)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(inspection.scheduled_date)}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Inspector</dt>
                  <dd className="truncate font-medium text-slate-700">
                    {getInspectorName(inspector)}
                  </dd>
                </div>
                {inspection.completed_at && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Completed</dt>
                    <dd className="truncate font-medium text-slate-700">
                      {formatDateTime(inspection.completed_at)}
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          )
        })}
      </div>
    </>
  )
}

export function InspectionsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  onSchedule,
  resultCount,
}) {
  const filterOptions = [
    { value: 'all', label: 'All', count: statusCounts.all },
    { value: 'scheduled', label: 'Scheduled', count: statusCounts.scheduled },
    { value: 'in_progress', label: 'In Progress', count: statusCounts.in_progress },
    { value: 'completed', label: 'Completed', count: statusCounts.completed },
    { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
    { value: 'overdue', label: 'Overdue', count: statusCounts.overdue },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-md">
          <SearchInput
            id="inspections-search"
            value={search}
            onChange={onSearchChange}
            placeholder="Search unit, property, or inspector…"
          />
        </div>
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{resultCount}</span> results
          </p>
          <button
            type="button"
            onClick={onSchedule}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 active:bg-brand-700"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Schedule
          </button>
        </div>
      </div>

      <FilterChips options={filterOptions} value={statusFilter} onChange={onStatusFilterChange} />
    </div>
  )
}
