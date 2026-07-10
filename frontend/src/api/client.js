import { getAuthToken } from '../utils/auth'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request(path, { body, headers, auth = true, ...options } = {}) {
  const authHeaders =
    auth && getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...authHeaders,
      ...(body != null ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const payload = await response.json()
      message = payload.message || payload.error || message
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  health: () => request('/api/health', { auth: false }),
  login: (payload) =>
    request('/api/auth/login', { method: 'POST', body: payload, auth: false }),
  register: (payload) =>
    request('/api/auth/register', { method: 'POST', body: payload, auth: false }),
  getDashboardStats: () => request('/api/dashboard'),
  getProperties: () => request('/api/properties'),
  getUnits: (propertyId) =>
    request(propertyId ? `/api/units?property_id=${propertyId}` : '/api/units'),
  getUsers: () => request('/api/users'),
  getInspections: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        query.set(key, value)
      }
    })
    const qs = query.toString()
    return request(`/api/inspections${qs ? `?${qs}` : ''}`)
  },
  createUser: (payload) => request('/api/users', { method: 'POST', body: payload }),
  createProperty: (payload) => request('/api/properties', { method: 'POST', body: payload }),
  createUnit: (payload) => request('/api/units', { method: 'POST', body: payload }),
  createInspection: (payload) => request('/api/inspections', { method: 'POST', body: payload }),
  updateInspection: (id, payload) =>
    request(`/api/inspections/${id}`, { method: 'PATCH', body: payload }),
  getTenantLease: () => request('/api/tenant/lease'),
  getPublicListings: () => request('/api/listings', { auth: false }),
  createBooking: (payload) =>
    request('/api/bookings', { method: 'POST', body: payload, auth: false }),
}

const INSPECTION_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled']

async function mergeInspectionsByStatus(statuses) {
  const batches = await Promise.all(
    statuses.map((status) => api.getInspections({ status })),
  )

  const merged = batches.flat()
  const unique = new Map(merged.map((item) => [item.id, item]))

  return [...unique.values()].sort(
    (a, b) => new Date(b.scheduled_date) - new Date(a.scheduled_date),
  )
}

export async function getRecentInspections() {
  return mergeInspectionsByStatus(['scheduled', 'in_progress', 'completed'])
}

export async function getAllInspections() {
  return mergeInspectionsByStatus(INSPECTION_STATUSES)
}

export async function getPropertiesPageData() {
  const [properties, units] = await Promise.all([
    api.getProperties(),
    api.getUnits(),
  ])

  return { properties, units }
}

export async function getInspectionsPageData() {
  const [inspections, properties, units, users] = await Promise.all([
    getAllInspections(),
    api.getProperties(),
    api.getUnits(),
    api.getUsers(),
  ])

  return { inspections, properties, units, users }
}

export async function getUsersPageData() {
  const users = await api.getUsers()
  return { users }
}

export async function getDashboardData() {
  const [stats, properties, units, inspections, users] = await Promise.all([
    api.getDashboardStats(),
    api.getProperties(),
    api.getUnits(),
    getRecentInspections(),
    api.getUsers(),
  ])

  return { stats, properties, units, inspections, users }
}
