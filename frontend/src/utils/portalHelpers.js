import {
  buildLookup,
  formatDate,
  formatDateTime,
  getInspectorName,
  getUnitLabel,
  isOverdue,
} from './formatters'

export function groupInspectionsForTaskBoard(inspections, lookups, approvedIds = new Set()) {
  const pending = []
  const active = []
  const review = []

  inspections.forEach((inspection) => {
    const enriched = enrichInspection(inspection, lookups)

    if (inspection.status === 'scheduled') {
      pending.push(enriched)
    } else if (inspection.status === 'in_progress') {
      active.push(enriched)
    } else if (inspection.status === 'completed' && !approvedIds.has(inspection.id)) {
      review.push(enriched)
    }
  })

  const byDate = (a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date)

  return {
    pending: pending.sort(byDate),
    active: active.sort(byDate),
    review: review.sort((a, b) => new Date(b.scheduled_date) - new Date(a.scheduled_date)),
  }
}

export function enrichInspection(inspection, lookups) {
  const unit = lookups.unitsById[inspection.unit_id]
  const property = unit ? lookups.propertiesById[unit.property_id] : null
  const inspector = lookups.usersById[inspection.inspector_id]

  return {
    ...inspection,
    unit,
    property,
    inspector,
    propertyName: property?.name ?? 'Unknown property',
    unitLabel: unit ? `Unit ${unit.unit_number}` : 'Unknown unit',
    inspectorName: getInspectorName(inspector),
    formattedDate: formatDate(inspection.scheduled_date),
    formattedDateTime: formatDateTime(inspection.scheduled_date),
    overdue: isOverdue(inspection.scheduled_date, inspection.status),
  }
}

export function buildPortalLookups({ properties, units, users }) {
  return {
    propertiesById: buildLookup(properties),
    unitsById: buildLookup(units),
    usersById: buildLookup(users),
  }
}

export function filterInspectionsForInspector(inspections, inspectorId) {
  return inspections.filter((inspection) => inspection.inspector_id === inspectorId)
}

export function filterInspectionsForTenant(inspections, units, tenantId) {
  const unitIds = new Set(units.filter((unit) => unit.tenant_id === tenantId).map((unit) => unit.id))
  return inspections.filter((inspection) => unitIds.has(inspection.unit_id))
}

export function getTenantUnits(units, tenantId) {
  return units.filter((unit) => unit.tenant_id === tenantId)
}

export function isToday(isoString) {
  if (!isoString) return false
  const date = new Date(isoString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export function getUnitLabelFromLookups(unit, lookups) {
  return getUnitLabel(unit, lookups.propertiesById)
}
