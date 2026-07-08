const STORAGE_KEY = 'rentalinspect_settings'

export const DEFAULT_SETTINGS = {
  workspaceName: 'Kenya Portfolio',
  timezone: 'Africa/Nairobi',
  emailNotifications: true,
  inspectionReminders: true,
  overdueAlerts: true,
  dateFormat: 'medium',
  compactTables: false,
}

export const TIMEZONE_OPTIONS = [
  { value: 'Africa/Nairobi', label: 'East Africa (Nairobi)' },
  { value: 'Africa/Lagos', label: 'West Africa (Lagos)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'Europe/London', label: 'London' },
]

export const DATE_FORMAT_OPTIONS = [
  { value: 'short', label: 'Short (Jan 6, 2026)' },
  { value: 'medium', label: 'Medium (January 6, 2026)' },
  { value: 'long', label: 'Long (Monday, January 6, 2026)' },
]

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function validateSettings(values) {
  const errors = {}

  if (!values.workspaceName.trim()) {
    errors.workspaceName = 'Workspace name is required.'
  } else if (values.workspaceName.trim().length > 80) {
    errors.workspaceName = 'Workspace name must be 80 characters or fewer.'
  }

  if (!values.timezone) {
    errors.timezone = 'Select a timezone.'
  }

  if (!values.dateFormat) {
    errors.dateFormat = 'Select a date format.'
  }

  return errors
}
