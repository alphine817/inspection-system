import { useMemo, useRef, useState } from 'react'
import { Building2, Home, Users } from 'lucide-react'
import { getPropertiesPageData } from '../api/client'
import AddPropertyForm from '../components/properties/AddPropertyForm'
import PropertiesGrid, { PropertiesToolbar } from '../components/properties/PropertiesGrid'
import ErrorState from '../components/ui/ErrorState'
import { StatCardSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { useRegisterRefetch } from '../hooks/useRegisterRefetch'
import { formatNumber, formatPropertyAddress, matchesSearch } from '../utils/formatters'

function SummaryStat({ label, value, icon: Icon, tone = 'neutral' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-100',
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatNumber(value)}</p>
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

  function scrollToAddForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
          <PropertiesToolbar
            search={search}
            onSearchChange={setSearch}
            onAddProperty={scrollToAddForm}
            resultCount={filteredProperties.length}
          />

          <div className="mt-6">
            <PropertiesGrid
              properties={filteredProperties}
              unitsByProperty={unitsByProperty}
              loading={loading}
              onAddProperty={scrollToAddForm}
              hasSearch={Boolean(search.trim())}
            />
          </div>
        </section>

        <div ref={formRef}>
          <AddPropertyForm onSubmitted={refetch} />
        </div>
      </div>
    </div>
  )
}
