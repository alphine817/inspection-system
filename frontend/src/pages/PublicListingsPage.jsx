import { useCallback, useState } from 'react'
import { Home } from 'lucide-react'
import { api } from '../api/client'
import LandingNavbar from '../components/landing/LandingNavbar'
import BookingModal from '../components/listings/BookingModal'
import PublicListingCard from '../components/listings/PublicListingCard'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { ListSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'

export default function PublicListingsPage() {
  const [selectedUnit, setSelectedUnit] = useState(null)
  const fetchListings = useCallback(() => api.getPublicListings(), [])
  const { data: listings, loading, error, refetch } = useAsyncData(fetchListings, [])

  const vacantListings = (listings ?? []).filter(
    (listing) => listing.status === 'Vacant',
  )

  return (
    <div className="min-h-svh bg-slate-50 dark:bg-slate-950">
      <LandingNavbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-[105px] sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-100 dark:bg-brand-950/50 dark:text-brand-400 dark:ring-brand-900/60">
            Available now
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Find your next rental
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Browse vacant units across our portfolio. No login required — submit a booking
            request and we will set up your tenant portal account automatically.
          </p>
        </div>

        {error ? (
          <ErrorState
            message={`${error} Make sure the Flask backend is running on port 5000.`}
            onRetry={refetch}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900/50"
              >
                <ListSkeleton rows={3} />
              </div>
            ))}
          </div>
        ) : vacantListings.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vacantListings.map((listing) => (
              <PublicListingCard
                key={listing.id}
                listing={listing}
                onBook={setSelectedUnit}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Home}
            title="No vacant units right now"
            description="Check back soon — new listings are added as units become available."
          />
        )}
      </main>

      {selectedUnit && (
        <BookingModal unit={selectedUnit} onClose={() => setSelectedUnit(null)} />
      )}
    </div>
  )
}
