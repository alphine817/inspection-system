import { useMemo, useState } from 'react'
import { CalendarPlus, CheckCircle2 } from 'lucide-react'
import { ApiError, api } from '../../api/client'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { ListSkeleton } from '../../components/ui/Skeleton'
import { usePortalWorkspace } from '../../hooks/usePortalWorkspace'
import { hasValidationErrors, validateScheduleInspection } from '../../utils/validation'

const initialValues = {
  propertyId: '',
  unitId: '',
  inspectorId: '',
  scheduledDate: '',
  scheduledTime: '',
  notes: '',
}

export default function ManagerAssignPage() {
  const { data, loading, error, refetch } = usePortalWorkspace()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const inspectors = useMemo(
    () => (data?.users ?? []).filter((user) => user.role === 'inspector' && user.is_active),
    [data?.users],
  )

  const propertyOptions = (data?.properties ?? []).map((property) => ({
    value: String(property.id),
    label: property.name,
  }))

  const unitOptions = (data?.units ?? [])
    .filter((unit) => String(unit.property_id) === values.propertyId)
    .map((unit) => ({
      value: String(unit.id),
      label: `Unit ${unit.unit_number}`,
    }))

  const inspectorOptions = inspectors.map((user) => ({
    value: String(user.id),
    label: `${user.first_name} ${user.last_name}`,
  }))

  const errors = useMemo(() => validateScheduleInspection(values), [values])
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field]),
  )

  function updateField(field, value) {
    setSubmitted(false)
    setSubmitError(null)
    setValues((current) => {
      const next = { ...current, [field]: value }
      if (field === 'propertyId') next.unitId = ''
      return next
    })
  }

  function handleBlur(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({
      propertyId: true,
      unitId: true,
      inspectorId: true,
      scheduledDate: true,
      scheduledTime: true,
    })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const scheduledDate = new Date(`${values.scheduledDate}T${values.scheduledTime}`)
      await api.createInspection({
        unit_id: Number(values.unitId),
        inspector_id: Number(values.inspectorId),
        scheduled_date: scheduledDate.toISOString(),
        notes: values.notes.trim() || undefined,
      })
      setSubmitted(true)
      setValues(initialValues)
      setTouched({})
      refetch()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to assign inspection.')
    } finally {
      setSubmitting(false)
    }
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Assign tasks"
        description="Schedule property walkthroughs and assign active inspectors to upcoming units."
      />

      {loading || !data ? (
        <ListSkeleton rows={4} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
        >
          <div className="mb-6 flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">New inspection assignment</h3>
          </div>

          {submitted && (
            <p
              className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              role="status"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Inspection assigned successfully.
            </p>
          )}

          {submitError && (
            <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
              {submitError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Select
              name="propertyId"
              label="Property"
              placeholder="Select property"
              options={propertyOptions}
              value={values.propertyId}
              onChange={(event) => updateField('propertyId', event.target.value)}
              onBlur={() => handleBlur('propertyId')}
              error={visibleErrors.propertyId}
            />
            <Select
              name="unitId"
              label="Unit"
              placeholder={values.propertyId ? 'Select unit' : 'Choose a property first'}
              options={unitOptions}
              value={values.unitId}
              onChange={(event) => updateField('unitId', event.target.value)}
              onBlur={() => handleBlur('unitId')}
              error={visibleErrors.unitId}
              disabled={!values.propertyId}
            />
            <Select
              name="inspectorId"
              label="Inspector"
              placeholder={inspectors.length ? 'Select inspector' : 'No inspectors available'}
              options={inspectorOptions}
              value={values.inspectorId}
              onChange={(event) => updateField('inspectorId', event.target.value)}
              onBlur={() => handleBlur('inspectorId')}
              error={visibleErrors.inspectorId}
              disabled={!inspectors.length}
            />
            <Input
              type="date"
              name="scheduledDate"
              label="Date"
              value={values.scheduledDate}
              onChange={(event) => updateField('scheduledDate', event.target.value)}
              onBlur={() => handleBlur('scheduledDate')}
              error={visibleErrors.scheduledDate}
            />
            <Input
              type="time"
              name="scheduledTime"
              label="Time"
              value={values.scheduledTime}
              onChange={(event) => updateField('scheduledTime', event.target.value)}
              onBlur={() => handleBlur('scheduledTime')}
              error={visibleErrors.scheduledTime}
            />
            <Input
              name="notes"
              label="Notes (optional)"
              placeholder="Access instructions, tenant presence, etc."
              value={values.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              containerClassName="md:col-span-2"
            />
          </div>

          <Button type="submit" disabled={submitting} className="mt-6">
            {submitting ? 'Assigning…' : 'Assign inspection'}
          </Button>
        </form>
      )}
    </div>
  )
}
