import { useCallback, useEffect, useState } from 'react'
import { CalendarDays, FileText, Home, MapPin } from 'lucide-react'
import { ApiError, api } from '../../api/client'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import ErrorState from '../../components/ui/ErrorState'
import StatusBadge from '../../components/ui/StatusBadge'
import { ListSkeleton } from '../../components/ui/Skeleton'

function formatStreetAddress(lease) {
  const parts = [lease.street_address]
  if (lease.address_line2) parts.push(lease.address_line2)
  parts.push(`${lease.city}, ${lease.state} ${lease.postal_code}`)
  return parts.join(', ')
}

function formatLeaseTerms(terms) {
  if (!terms) return '—'

  const parts = []
  if (terms.bedrooms != null) {
    parts.push(`${terms.bedrooms} bed${terms.bedrooms === 1 ? '' : 's'}`)
  }
  if (terms.bathrooms != null) {
    parts.push(`${terms.bathrooms} bath${terms.bathrooms === 1 ? '' : 's'}`)
  }
  if (terms.square_feet != null) {
    parts.push(`${terms.square_feet} sq ft`)
  }

  return parts.length ? parts.join(' · ') : '—'
}

export default function TenantLeasePage() {
  const [leases, setLeases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLease = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.getTenantLease()
      setLeases(response?.leases ?? [])
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Unable to load lease details.'
      setError(message)
      setLeases([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLease()
  }, [fetchLease])

  if (error) {
    return <ErrorState message={error} onRetry={fetchLease} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="My lease"
        description="View your active unit assignment, property details, and lease summary."
      />

      {loading ? (
        <ListSkeleton rows={3} />
      ) : leases.length ? (
        <ul className="space-y-4">
          {leases.map((lease) => (
            <li
              key={lease.unit_id}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status="good" label="Active lease" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Unit {lease.unit_number}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                {lease.property_name}
              </h3>

              <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {formatStreetAddress(lease)}
              </p>

              <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <Home className="h-3.5 w-3.5" aria-hidden="true" />
                    Property
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {lease.property_name}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Unit number
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {lease.unit_number}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Lease terms
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {formatLeaseTerms(lease.lease_terms)}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No active lease is linked to your account yet. Contact your property manager if this looks incorrect.
        </p>
      )}
    </div>
  )
}
