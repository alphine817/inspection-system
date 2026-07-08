import { CalendarPlus, ClipboardList } from 'lucide-react'
import {
  formatDateTime,
  getInspectorName,
  getUnitLabel,
  resolveInspectionStatus,
} from '../../utils/formatters'
import EmptyState from '../ui/EmptyState'
import StatusBadge from '../ui/StatusBadge'
import { TableSkeleton } from '../ui/Skeleton'

export default function InspectionsTable({
  inspections,
  unitsById,
  propertiesById,
  usersById,
  loading,
  onSchedule,
}) {
  if (loading) {
    return <TableSkeleton rows={6} />
  }

  if (!inspections.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No inspections yet"
        description="Schedule your first property inspection to start tracking unit conditions, overdue work, and inspector assignments."
        actionLabel="Schedule inspection"
        onAction={onSchedule}
      />
    )
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/60 md:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800/60">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Unit</th>
              <th className="hidden px-4 py-3 lg:table-cell">Inspector</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800/60 dark:bg-slate-900/30">
            {inspections.map((inspection) => {
              const unit = unitsById[inspection.unit_id]
              const inspector = usersById[inspection.inspector_id]
              const status = resolveInspectionStatus(inspection)

              return (
                <tr
                  key={inspection.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                >
                  <td className="max-w-[220px] px-4 py-3">
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {getUnitLabel(unit, propertiesById)}
                    </p>
                    {inspection.notes && (
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{inspection.notes}</p>
                    )}
                  </td>
                  <td className="hidden max-w-[160px] truncate px-4 py-3 text-slate-600 dark:text-slate-400 lg:table-cell">
                    {getInspectorName(inspector)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                    {formatDateTime(inspection.scheduled_date)}
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

      <div className="space-y-3 md:hidden">
        {inspections.map((inspection) => {
          const unit = unitsById[inspection.unit_id]
          const inspector = usersById[inspection.inspector_id]
          const status = resolveInspectionStatus(inspection)

          return (
            <article
              key={inspection.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {getUnitLabel(unit, propertiesById)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatDateTime(inspection.scheduled_date)}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Inspector: <span className="font-medium">{getInspectorName(inspector)}</span>
              </p>
            </article>
          )
        })}
      </div>
    </>
  )
}

export function InspectionsPanel(props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Inspections</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled, in progress, and completed visits</p>
        </div>
        <button
          type="button"
          onClick={props.onSchedule}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 active:bg-brand-100 dark:text-brand-400 dark:hover:bg-brand-950 dark:active:bg-brand-900"
        >
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Schedule
        </button>
      </div>
      <InspectionsTable {...props} />
    </section>
  )
}
