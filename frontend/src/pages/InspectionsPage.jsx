import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInspectionsPageData } from '../api/client'
import InspectionsList, { InspectionsToolbar } from '../components/inspections/InspectionsList'
import ErrorState from '../components/ui/ErrorState'
import { useAsyncData } from '../hooks/useAsyncData'
import { useRegisterRefetch } from '../hooks/useRegisterRefetch'
import {
  buildLookup,
  getInspectorName,
  getUnitLabel,
  matchesSearch,
  resolveInspectionStatus,
} from '../utils/formatters'

function buildStatusCounts(inspections) {
  const counts = {
    all: inspections.length,
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
  }

  inspections.forEach((inspection) => {
    const status = resolveInspectionStatus(inspection)
    if (status === 'overdue') {
      counts.overdue += 1
    } else if (counts[status] != null) {
      counts[status] += 1
    }
  })

  return counts
}

export default function InspectionsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { data, loading, error, refetch } = useAsyncData(getInspectionsPageData, [])

  useRegisterRefetch(refetch)

  const lookups = useMemo(() => {
    if (!data) {
      return { propertiesById: {}, unitsById: {}, usersById: {} }
    }

    return {
      propertiesById: buildLookup(data.properties),
      unitsById: buildLookup(data.units),
      usersById: buildLookup(data.users),
    }
  }, [data])

  const statusCounts = useMemo(
    () => buildStatusCounts(data?.inspections ?? []),
    [data?.inspections],
  )

  const filteredInspections = useMemo(() => {
    if (!data?.inspections) return []

    return data.inspections.filter((inspection) => {
      const unit = lookups.unitsById[inspection.unit_id]
      const inspector = lookups.usersById[inspection.inspector_id]
      const resolvedStatus = resolveInspectionStatus(inspection)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'overdue'
          ? resolvedStatus === 'overdue'
          : inspection.status === statusFilter && resolvedStatus !== 'overdue')

      if (!matchesStatus) return false

      const haystack = [
        getUnitLabel(unit, lookups.propertiesById),
        getInspectorName(inspector),
        inspection.notes,
        inspection.status,
      ]
        .filter(Boolean)
        .join(' ')

      return matchesSearch(haystack, search)
    })
  }, [data?.inspections, lookups, search, statusFilter])

  function handleSchedule() {
    navigate('/admin/dashboard', { state: { scrollToSchedule: true } })
  }

  if (error) {
    return (
      <ErrorState
        message={`${error} Make sure the Flask backend is running on port 5000.`}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-6">
        <InspectionsToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusCounts={statusCounts}
          onSchedule={handleSchedule}
          resultCount={filteredInspections.length}
        />

        <div className="mt-6">
          <InspectionsList
            inspections={filteredInspections}
            unitsById={lookups.unitsById}
            propertiesById={lookups.propertiesById}
            usersById={lookups.usersById}
            loading={loading}
            onSchedule={handleSchedule}
            emptyTitle={
              search || statusFilter !== 'all'
                ? 'No inspections match your filters'
                : 'No inspections yet'
            }
            emptyDescription={
              search || statusFilter !== 'all'
                ? 'Clear your search or try a different status filter to see more results.'
                : 'Schedule your first inspection to start tracking unit conditions and inspector assignments.'
            }
          />
        </div>
      </section>
    </div>
  )
}
