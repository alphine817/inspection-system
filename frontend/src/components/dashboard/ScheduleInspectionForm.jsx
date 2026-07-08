import { useMemo, useState } from 'react'
import { CalendarPlus, CheckCircle2 } from 'lucide-react'
import { ApiError, api } from '../../api/client'
import { hasValidationErrors, validateScheduleInspection } from '../../utils/validation'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

const initialValues = {
  propertyId: '',
  unitId: '',
  inspectorId: '',
  scheduledDate: '',
  scheduledTime: '',
  notes: '',
}

export default function ScheduleInspectionForm({
  id = 'schedule-inspection-form',
  properties,
  units,
  users,
  onSubmitted,
}) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const inspectors = useMemo(
    () => users.filter((user) => user.role === 'inspector' && user.is_active),
    [users],
  )

  const propertyOptions = properties.map((property) => ({
    value: String(property.id),
    label: property.name,
  }))

  const unitOptions = units
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
      if (field === 'propertyId') {
        next.unitId = ''
      }
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
      notes: true,
    })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const scheduledDate = new Date(`${values.scheduledDate}T${values.scheduledTime}:00`)

      await api.createInspection({
        unit_id: Number(values.unitId),
        inspector_id: Number(values.inspectorId),
        scheduled_date: scheduledDate.toISOString(),
        notes: values.notes.trim() || undefined,
      })

      setSubmitted(true)
      setValues(initialValues)
      setTouched({})
      onSubmitted?.()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to schedule inspection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id={id}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Schedule Inspection</h2>
        <p className="text-sm text-slate-500">
          Assign an inspector and unit with real-time validation
        </p>
      </div>

      {submitted && (
        <div
          className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold">Inspection scheduled successfully.</p>
        </div>
      )}

      {submitError && (
        <div
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
          disabled={!values.propertyId}
          onChange={(event) => updateField('unitId', event.target.value)}
          onBlur={() => handleBlur('unitId')}
          error={visibleErrors.unitId}
        />

        <Select
          name="inspectorId"
          label="Inspector"
          placeholder={inspectors.length ? 'Select inspector' : 'No inspectors available'}
          options={inspectorOptions}
          value={values.inspectorId}
          disabled={!inspectors.length}
          onChange={(event) => updateField('inspectorId', event.target.value)}
          onBlur={() => handleBlur('inspectorId')}
          error={visibleErrors.inspectorId}
          hint={
            !inspectors.length
              ? 'Create an inspector user on the Users page to enable scheduling.'
              : undefined
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        <Input
          name="notes"
          label="Notes"
          placeholder="Optional access instructions or focus areas"
          value={values.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          onBlur={() => handleBlur('notes')}
          error={visibleErrors.notes}
          hint={`${values.notes.length}/500 characters`}
        />

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Scheduling…' : 'Schedule inspection'}
        </Button>
      </form>
    </section>
  )
}
