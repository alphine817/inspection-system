const REPORTS_KEY = 'propstat-tenant-reports'
const MAINTENANCE_KEY = 'propstat-tenant-maintenance'
const APPROVALS_KEY = 'propstat-manager-approvals'
const COMMUNICATIONS_KEY = 'propstat-manager-communications'

function readStore(key, userId) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed[userId]) ? parsed[userId] : []
  } catch {
    return []
  }
}

function writeStore(key, userId, items) {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed[userId] = items
    localStorage.setItem(key, JSON.stringify(parsed))
  } catch {
    /* localStorage unavailable */
  }
}

export function getTenantReports(userId) {
  return readStore(REPORTS_KEY, userId)
}

export function addTenantReport(userId, report) {
  const items = readStore(REPORTS_KEY, userId)
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'submitted',
    ...report,
  }
  writeStore(REPORTS_KEY, userId, [entry, ...items])
  return entry
}

export function getMaintenanceRequests(userId) {
  return readStore(MAINTENANCE_KEY, userId)
}

export function addMaintenanceRequest(userId, request) {
  const items = readStore(MAINTENANCE_KEY, userId)
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'open',
    ...request,
  }
  writeStore(MAINTENANCE_KEY, userId, [entry, ...items])
  return entry
}

export function getApprovedInspectionIds(userId) {
  return new Set(readStore(APPROVALS_KEY, userId).map((item) => item.inspectionId))
}

export function approveInspection(userId, inspectionId) {
  const items = readStore(APPROVALS_KEY, userId)
  if (items.some((item) => item.inspectionId === inspectionId)) return

  writeStore(APPROVALS_KEY, userId, [
    { inspectionId, approvedAt: new Date().toISOString() },
    ...items,
  ])
}

export function getManagerCommunications(userId) {
  return readStore(COMMUNICATIONS_KEY, userId)
}

export function addManagerCommunication(userId, message) {
  const items = readStore(COMMUNICATIONS_KEY, userId)
  const entry = {
    id: crypto.randomUUID(),
    sentAt: new Date().toISOString(),
    status: 'sent',
    ...message,
  }
  writeStore(COMMUNICATIONS_KEY, userId, [entry, ...items])
  return entry
}

export function updateInspectorProfile(userId, profile) {
  try {
    const key = 'propstat-inspector-profiles'
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed[userId] = { ...parsed[userId], ...profile, updatedAt: new Date().toISOString() }
    localStorage.setItem(key, JSON.stringify(parsed))
    return parsed[userId]
  } catch {
    return profile
  }
}

export function getInspectorProfile(userId) {
  try {
    const raw = localStorage.getItem('propstat-inspector-profiles')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed[userId] ?? null
  } catch {
    return null
  }
}
