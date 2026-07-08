export function validateScheduleInspection(values) {
  const errors = {}

  if (!values.propertyId) {
    errors.propertyId = 'Select a property.'
  }

  if (!values.unitId) {
    errors.unitId = 'Select a unit.'
  }

  if (!values.inspectorId) {
    errors.inspectorId = 'Select an inspector.'
  }

  if (!values.scheduledDate) {
    errors.scheduledDate = 'Choose a scheduled date.'
  } else {
    const selected = new Date(values.scheduledDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (Number.isNaN(selected.getTime())) {
      errors.scheduledDate = 'Enter a valid date.'
    } else if (selected < today) {
      errors.scheduledDate = 'Date cannot be in the past.'
    }
  }

  if (!values.scheduledTime) {
    errors.scheduledTime = 'Choose a scheduled time.'
  }

  if (values.notes && values.notes.length > 500) {
    errors.notes = 'Notes must be 500 characters or fewer.'
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0
}
