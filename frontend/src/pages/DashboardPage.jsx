import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDashboardData } from '../api/client'
import { InspectionsPanel } from '../components/dashboard/InspectionsTable'
import { PropertiesPanel } from '../components/dashboard/PropertiesList'
import ScheduleInspectionForm from '../components/dashboard/ScheduleInspectionForm'
import { StatsGrid } from '../components/dashboard/StatsGrid'
import ErrorState from '../components/ui/ErrorState'
import { StatCardSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { useRegisterRefetch } from '../hooks/useRegisterRefetch'
import { buildLookup } from '../utils/formatters'

export default function DashboardPage() {
  const formRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { data, loading, error, refetch } = useAsyncData(getDashboardData, [])

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

  function scrollToScheduleForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (location.state?.scrollToSchedule) {
      scrollToScheduleForm()
      navigate('/dashboard', { replace: true, state: {} })
    }
  }, [location.state, navigate])

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
      {loading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <StatsGrid stats={data.stats} />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InspectionsPanel
            inspections={data?.inspections ?? []}
            unitsById={lookups.unitsById}
            propertiesById={lookups.propertiesById}
            usersById={lookups.usersById}
            loading={loading}
            onSchedule={scrollToScheduleForm}
          />
        </div>

        <div className="space-y-6">
          <PropertiesPanel
            properties={data?.properties ?? []}
            units={data?.units ?? []}
            loading={loading}
            onAddProperty={() => navigate('/properties')}
          />

          <div ref={formRef}>
            <ScheduleInspectionForm
              properties={data?.properties ?? []}
              units={data?.units ?? []}
              users={data?.users ?? []}
              onSubmitted={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
