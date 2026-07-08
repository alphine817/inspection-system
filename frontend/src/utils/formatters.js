const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDate(isoString) {
  if (!isoString) return '—'
  return dateFormatter.format(new Date(isoString))
}

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`
}

export function formatNumber(value) {
  return new Intl.NumberFormat().format(value ?? 0)
}

export function getPropertyLabel(property) {
  if (!property) return 'Unknown property'
  return property.name
}

export function getUnitLabel(unit, propertiesById) {
  if (!unit) return 'Unknown unit'
  const propertyName = propertiesById?.[unit.property_id]?.name
  return propertyName ? `${propertyName} · Unit ${unit.unit_number}` : `Unit ${unit.unit_number}`
}

export function getInspectorName(user) {
  if (!user) return 'Unassigned'
  return `${user.first_name} ${user.last_name}`
}

export function buildLookup(items, key = 'id') {
  return Object.fromEntries(items.map((item) => [item[key], item]))
}

export function isOverdue(scheduledDate, status) {
  if (!scheduledDate) return false
  if (status === 'completed' || status === 'cancelled') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(scheduledDate) < today
}

export function resolveInspectionStatus(inspection) {
  if (isOverdue(inspection.scheduled_date, inspection.status)) {
    return 'overdue'
  }
  return inspection.status
}

export function formatPropertyAddress(property) {
  if (!property) return '—'
  const parts = [property.address_line1]
  if (property.address_line2) parts.push(property.address_line2)
  parts.push(`${property.city}, ${property.state} ${property.postal_code}`)
  return parts.join(', ')
}

export function matchesSearch(text, query) {
  if (!query.trim()) return true
  return text.toLowerCase().includes(query.trim().toLowerCase())
}
