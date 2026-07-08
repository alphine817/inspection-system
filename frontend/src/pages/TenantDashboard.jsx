import { useMemo, useState } from 'react'
import { Bell, CalendarDays, CheckCircle2, ImagePlus, Upload } from 'lucide-react'
import PortalPageHeader from '../components/portal/PortalPageHeader'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import Input from '../components/ui/Input'
import { ListSkeleton } from '../components/ui/Skeleton'
import useAuth from '../hooks/useAuth'
import { usePortalWorkspace } from '../hooks/usePortalWorkspace'
import { enrichInspection, filterInspectionsForTenant } from '../utils/portalHelpers'
import { addTenantReport } from '../utils/tenantStorage'

export default function TenantDashboard() {
  const { user } = useAuth()
  const { data, lookups, loading, error, refetch } = usePortalWorkspace()
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const upcomingAppointments = useMemo(() => {
    if (!data?.inspections || !lookups || !user?.id) return []

    return filterInspectionsForTenant(data.inspections, data.units, user.id)
      .filter((inspection) => inspection.status === 'scheduled' || inspection.status === 'in_progress')
      .map((inspection) => enrichInspection(inspection, lookups))
      .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
  }, [data?.inspections, data?.units, lookups, user?.id])

  function handleFileChange(event) {
    setSelectedFiles(Array.from(event.target.files ?? []))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!location.trim() || !description.trim()) return

    addTenantReport(user.id, {
      location: location.trim(),
      description: description.trim(),
      fileNames: selectedFiles.map((file) => file.name),
    })

    setDescription('')
    setLocation('')
    setSelectedFiles([])
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Upcoming appointments"
        description="Stay informed about scheduled inspections and property visits for your unit."
      />

      {loading || !data ? (
        <ListSkeleton rows={2} />
      ) : upcomingAppointments.length ? (
        <ul className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <li
              key={appointment.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {appointment.status === 'in_progress' ? 'Inspection in progress' : 'Scheduled inspection'}
                </p>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                  {appointment.propertyName} · {appointment.unitLabel}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {appointment.formattedDateTime}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Inspector: {appointment.inspectorName}
                </p>
              </div>
              <span className="shrink-0 self-start rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 sm:self-center">
                {appointment.status === 'in_progress' ? 'In progress' : 'Confirmed'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming inspections scheduled for your unit.</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6">
        <div className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Report property damage</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Flag an issue in your unit and attach photos for your property manager to review.
        </p>

        {submitted && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Damage report submitted. View it in Report History.
          </p>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <Input
            name="location"
            label="Location in unit"
            placeholder="e.g. Kitchen — ceiling near window"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <div>
            <label
              htmlFor="damage-description"
              className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Description
            </label>
            <textarea
              id="damage-description"
              name="description"
              rows={4}
              placeholder="Describe the damage, when you noticed it, and any safety concerns..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600"
            />
          </div>

          <div>
            <label
              htmlFor="damage-photos"
              className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Upload photos
            </label>
            <label
              htmlFor="damage-photos"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center transition-colors hover:border-brand-500 hover:bg-brand-50/30 dark:border-slate-600 dark:bg-slate-800/40 dark:hover:border-brand-500 dark:hover:bg-brand-950/20"
            >
              <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              <span className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Click to upload images
              </span>
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">PNG, JPG up to 10 MB each</span>
              <input
                id="damage-photos"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            {selectedFiles.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                {selectedFiles.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            Submit damage report
          </Button>
        </form>
      </section>
    </div>
  )
}
