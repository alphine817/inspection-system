export function validateAddUser(values) {
  const errors = {}

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.'
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.role) {
    errors.role = 'Select a role.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (values.phone && !/^\+?[\d\s()-]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.'
  }

  return errors
}
