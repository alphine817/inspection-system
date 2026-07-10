import { Bath, BedDouble, Building2, MapPin, Ruler } from 'lucide-react'
import { listingImages } from '../../constants/listingImages'
import { formatCurrency } from '../../utils/formatters'
import Button from '../ui/Button'
import StatusBadge from '../ui/StatusBadge'

function ListingCardImage({ imageUrl, alt }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className="h-48 w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60">
      <img
        src={listingImages.placeholder}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover opacity-70 dark:opacity-50"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/20 px-4 text-center dark:bg-slate-950/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-500 shadow-sm dark:bg-slate-900/90 dark:text-slate-400">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white drop-shadow-sm">
          Photo coming soon
        </p>
      </div>
    </div>
  )
}

export default function PublicListingCard({ listing, onBook }) {
  const imageAlt = `Unit ${listing.unit_number} at ${listing.property_name}`

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-brand-800/60">
      <ListingCardImage imageUrl={listing.image_url} alt={imageAlt} />

      <div className="border-b border-slate-100 p-5 dark:border-slate-800/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100 dark:bg-brand-950/50 dark:text-brand-400 dark:ring-brand-900/60">
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="truncate text-base font-bold text-slate-900 dark:text-slate-100">
                Unit {listing.unit_number}
              </h3>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {listing.property_name}
            </p>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="line-clamp-2">{listing.property_address}</span>
            </p>
          </div>
          <StatusBadge status="scheduled" label={listing.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
              Bedrooms
            </dt>
            <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
              {listing.bedrooms ?? '—'}
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Bath className="h-3.5 w-3.5" aria-hidden="true" />
              Bathrooms
            </dt>
            <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
              {listing.bathrooms ?? '—'}
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
              Square footage
            </dt>
            <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
              {listing.square_feet != null ? `${listing.square_feet} sq ft` : '—'}
            </dd>
          </div>
          <div className="rounded-xl bg-brand-50 p-3 dark:bg-brand-950/30">
            <dt className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-400">
              Monthly rent
            </dt>
            <dd className="mt-1 text-lg font-bold text-brand-700 dark:text-brand-400">
              {formatCurrency(listing.monthly_rent)}
            </dd>
          </div>
        </dl>

        <Button type="button" onClick={() => onBook(listing)} className="mt-5 w-full">
          Book This Room
        </Button>
      </div>
    </article>
  )
}
