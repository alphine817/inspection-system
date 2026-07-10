export function validateBookingRequest(values) {
  const errors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!/^[+\d\s()-]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.'
  }

  if (!values.preferredMoveInDate) {
    errors.preferredMoveInDate = 'Preferred move-in date is required.'
  } else {
    const selected = new Date(values.preferredMoveInDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (Number.isNaN(selected.getTime())) {
      errors.preferredMoveInDate = 'Enter a valid date.'
    } else if (selected < today) {
      errors.preferredMoveInDate = 'Move-in date cannot be in the past.'
    }
  }

  return errors
}
