import { useMemo, useRef, useState } from 'react'
import { Building2, Home, Users } from 'lucide-react'
import { getPropertiesPageData } from '../api/client'
import AddPropertyForm from '../components/properties/AddPropertyForm'
import AddUnitForm from '../components/properties/AddUnitForm'
import PropertiesGrid, { PropertiesToolbar } from '../components/properties/PropertiesGrid'
import ErrorState from '../components/ui/ErrorState'
import { StatCardSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { useRegisterRefetch } from '../hooks/useRegisterRefetch'
import { formatNumber, formatPropertyAddress, matchesSearch } from '../utils/formatters'

function SummaryStat({ label, value, icon: Icon, tone = 'neutral' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-100 dark:bg-brand-950/50 dark:text-brand-400 dark:ring-brand-900/60',
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700/40',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-900/60',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(value)}</p>
        </div>
        <div
          className={[
            'flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset',
            tones[tone],
          ].join(' ')}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  const formRef = useRef(null)
  const [search, setSearch] = useState('')
  const [sidebarMode, setSidebarMode] = useState('property')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const { data, loading, error, refetch } = useAsyncData(getPropertiesPageData, [])

  useRegisterRefetch(refetch)

  const unitsByProperty = useMemo(() => {
    if (!data?.units) return {}

    return data.units.reduce((acc, unit) => {
      if (!acc[unit.property_id]) acc[unit.property_id] = []
      acc[unit.property_id].push(unit)
      return acc
    }, {})
  }, [data?.units])

  const filteredProperties = useMemo(() => {
    if (!data?.properties) return []

    return data.properties.filter((property) => {
      const haystack = [
        property.name,
        property.city,
        property.state,
        property.address_line1,
        property.address_line2,
        formatPropertyAddress(property),
      ]
        .filter(Boolean)
        .join(' ')

      return matchesSearch(haystack, search)
    })
  }, [data?.properties, search])

  const summary = useMemo(() => {
    const units = data?.units ?? []
    const vacantUnits = units.filter((unit) => !unit.tenant_id).length

    return {
      properties: data?.properties.length ?? 0,
      units: units.length,
      vacantUnits,
    }
  }, [data])

  function scrollToSidebar() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function showAddPropertyForm() {
    setSidebarMode('property')
    setSelectedProperty(null)
    scrollToSidebar()
  }

  function showAddUnitForm(property) {
    setSidebarMode('unit')
    setSelectedProperty(property)
    scrollToSidebar()
  }

  function handleUnitSubmitted() {
    refetch()
    setSidebarMode('property')
    setSelectedProperty(null)
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
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryStat label="Properties" value={summary.properties} icon={Building2} tone="brand" />
          <SummaryStat label="Total Units" value={summary.units} icon={Home} />
          <SummaryStat
            label="Vacant Units"
            value={summary.vacantUnits}
            icon={Users}
            tone={summary.vacantUnits > 0 ? 'success' : 'neutral'}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-6 xl:col-span-2">
          <PropertiesToolbar
            search={search}
            onSearchChange={setSearch}
            onAddProperty={showAddPropertyForm}
            resultCount={filteredProperties.length}
          />

          <div className="mt-6">
            <PropertiesGrid
              properties={filteredProperties}
              unitsByProperty={unitsByProperty}
              loading={loading}
              onAddProperty={showAddPropertyForm}
              onAddUnit={showAddUnitForm}
              hasSearch={Boolean(search.trim())}
            />
          </div>
        </section>

        <div ref={formRef}>
          {sidebarMode === 'unit' && selectedProperty ? (
            <AddUnitForm
              key={selectedProperty.id}
              propertyId={selectedProperty.id}
              propertyName={selectedProperty.name}
              onSubmitted={handleUnitSubmitted}
              onCancel={showAddPropertyForm}
            />
          ) : (
            <AddPropertyForm onSubmitted={refetch} />
          )}
        </div>
      </div>
    </div>
  )
}
