import { Bath, BedDouble, Building2, MapPin, Ruler } from 'lucide-react'
import { formatPropertyAddress } from '../../utils/formatters'
import StatusBadge from '../ui/StatusBadge'

function UnitRow({ unit }) {
  const occupied = Boolean(unit.tenant_id)

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-100 dark:bg-slate-950/40 dark:ring-slate-700/40">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">Unit {unit.unit_number}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {unit.bedrooms != null && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
              {unit.bedrooms} bed
            </span>
          )}
          {unit.bathrooms != null && (
            <span className="inline-flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" aria-hidden="true" />
              {unit.bathrooms} bath
            </span>
          )}
          {unit.square_feet != null && (
            <span className="hidden items-center gap-1 sm:inline-flex">
              <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
              {unit.square_feet} sq ft
            </span>
          )}
        </div>
      </div>
      <StatusBadge
        status={occupied ? 'good' : 'scheduled'}
        label={occupied ? 'Occupied' : 'Vacant'}
      />
    </li>
  )
}

export default function PropertyCard({ property, units }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:border-brand-800/60">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="truncate text-base font-bold text-slate-900 dark:text-slate-100">{property.name}</h3>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="line-clamp-2">{formatPropertyAddress(property)}</span>
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700/40">
            {units.length} {units.length === 1 ? 'unit' : 'units'}
          </span>
        </div>
      </div>

      <div className="flex-1 p-5">
        {units.length ? (
          <ul className="space-y-2">
            {units.map((unit) => (
              <UnitRow key={unit.id} unit={unit} />
            ))}
          </ul>
        ) : (
          <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-500 ring-1 ring-slate-100 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-slate-700/40">
            No units assigned to this property yet.
          </p>
        )}
      </div>
    </article>
  )
}
