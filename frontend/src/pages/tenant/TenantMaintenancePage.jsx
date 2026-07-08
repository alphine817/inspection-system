import { useState } from 'react'
import { CheckCircle2, Wrench } from 'lucide-react'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import StatusBadge from '../../components/ui/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { formatDateTime } from '../../utils/formatters'
import { addMaintenanceRequest, getMaintenanceRequests } from '../../utils/tenantStorage'

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low — can wait a few days' },
  { value: 'medium', label: 'Medium — within 48 hours' },
  { value: 'high', label: 'High — urgent / safety concern' },
]

const CATEGORY_OPTIONS = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'structural', label: 'Structural' },
  { value: 'other', label: 'Other' },
]

export default function TenantMaintenancePage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(() => getMaintenanceRequests(user?.id))
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('medium')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!category || !location.trim() || !description.trim()) return

    const entry = addMaintenanceRequest(user.id, {
      category,
      priority,
      location: location.trim(),
      description: description.trim(),
    })

    setRequests((current) => [entry, ...current])
    setCategory('')
    setPriority('medium')
    setLocation('')
    setDescription('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Request maintenance"
        description="Open non-emergency maintenance tickets and track progress updates from your manager."
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
      >
        <div className="mb-5 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">New maintenance request</h3>
        </div>

        {submitted && (
          <p className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Maintenance request submitted.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select
            name="category"
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          <Select
            name="priority"
            label="Priority"
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          />
          <Input
            name="location"
            label="Location in unit"
            placeholder="e.g. Bathroom — shower drain"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            containerClassName="md:col-span-2"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="maintenance-description" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            id="maintenance-description"
            rows={4}
            placeholder="Describe the issue and when it started..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <Button type="submit" className="mt-5">
          Submit request
        </Button>
      </form>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Your requests</h3>

        {requests.length ? (
          <ul className="mt-4 space-y-3">
            {requests.map((request) => (
              <li
                key={request.id}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={request.priority === 'high' ? 'overdue' : 'scheduled'} label={request.status} />
                  <span className="text-xs font-medium capitalize text-slate-500 dark:text-slate-400">
                    {request.category} · {request.priority} priority
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{request.location}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{request.description}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Opened {formatDateTime(request.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No maintenance requests yet.</p>
        )}
      </section>
    </div>
  )
}
