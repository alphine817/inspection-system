import { useCallback, useRef, useState } from 'react'
import { createBrowserRouter, Navigate, useMatches } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { ProtectedRoute, RoleGuard } from './components/routing/ProtectedRoute'
import RoleHomeRedirect from './components/routing/RoleHomeRedirect'
import { ROLES } from './constants/rbac'
import DashboardPage from './pages/DashboardPage'
import InspectionsPage from './pages/InspectionsPage'
import InspectorDashboard from './pages/InspectorDashboard'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ManagerDashboard from './pages/ManagerDashboard'
import PropertiesPage from './pages/PropertiesPage'
import SettingsPage from './pages/SettingsPage'
import SignUpPage from './pages/SignUpPage'
import TenantDashboard from './pages/TenantDashboard'
import UsersPage from './pages/UsersPage'
import {
  InspectorHistoryPage,
  InspectorProfilePage,
  ManagerApprovalsPage,
  ManagerAssignPage,
  ManagerCommunicationsPage,
  ManagerPropertiesPage,
  TenantLeasePage,
  TenantMaintenancePage,
  TenantReportsPage,
} from './pages/portal/PortalPages'

const DEFAULT_META = {
  title: 'Inspection Dashboard',
  subtitle: 'Monitor properties, units, and inspection activity across your portfolio',
}

function DashboardLayoutRoute() {
  const refetchRef = useRef(null)
  const [refreshing, setRefreshing] = useState(false)
  const matches = useMatches()
  const meta = matches.at(-1)?.handle ?? DEFAULT_META

  const handleRefresh = useCallback(async () => {
    if (!refetchRef.current) return

    setRefreshing(true)
    try {
      await refetchRef.current()
    } finally {
      setRefreshing(false)
    }
  }, [])

  const registerRefetch = useCallback((refetch) => {
    refetchRef.current = refetch
  }, [])

  return (
    <DashboardLayout
      title={meta.title}
      subtitle={meta.subtitle}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      outletContext={{ registerRefetch }}
    />
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayoutRoute />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'admin',
        element: <RoleGuard allowedRoles={[ROLES.ADMIN]} />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
            handle: {
              title: 'Inspection Dashboard',
              subtitle: 'Monitor properties, units, and inspection activity across your portfolio',
            },
          },
          {
            path: 'properties',
            element: <PropertiesPage />,
            handle: {
              title: 'Properties',
              subtitle: 'Browse your rental portfolio, units, and occupancy at a glance',
            },
          },
          {
            path: 'inspections',
            element: <InspectionsPage />,
            handle: {
              title: 'Inspections',
              subtitle: 'Track scheduled visits, overdue work, and completed inspections',
            },
          },
          {
            path: 'users',
            element: <UsersPage />,
            handle: {
              title: 'Users',
              subtitle: 'Manage team members, roles, and account access',
            },
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            handle: {
              title: 'Settings',
              subtitle: 'Configure workspace preferences, notifications, and API connection',
            },
          },
        ],
      },
      {
        path: 'manager',
        element: <RoleGuard allowedRoles={[ROLES.MANAGER]} />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <ManagerDashboard />,
            handle: {
              title: 'Manager Portal',
              subtitle: 'Assign inspections, track field progress, and review completed reports',
            },
          },
          {
            path: 'properties',
            element: <ManagerPropertiesPage />,
            handle: {
              title: 'Property Overview',
              subtitle: 'Portfolio snapshot for your managed properties',
            },
          },
          {
            path: 'assign',
            element: <ManagerAssignPage />,
            handle: {
              title: 'Assign Tasks',
              subtitle: 'Match inspectors to upcoming property walkthroughs',
            },
          },
          {
            path: 'approvals',
            element: <ManagerApprovalsPage />,
            handle: {
              title: 'Approvals',
              subtitle: 'Sign off on submitted inspection reports',
            },
          },
          {
            path: 'communications',
            element: <ManagerCommunicationsPage />,
            handle: {
              title: 'Tenant Communications',
              subtitle: 'Notices, reminders, and tenant messaging',
            },
          },
        ],
      },
      {
        path: 'inspector',
        element: <RoleGuard allowedRoles={[ROLES.INSPECTOR]} />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <InspectorDashboard />,
            handle: {
              title: 'Inspector Portal',
              subtitle: "Today's assigned property walkthroughs and field checklist",
            },
          },
          {
            path: 'history',
            element: <InspectorHistoryPage />,
            handle: {
              title: 'Inspection History',
              subtitle: 'Past walkthroughs and submitted reports',
            },
          },
          {
            path: 'profile',
            element: <InspectorProfilePage />,
            handle: {
              title: 'Profile',
              subtitle: 'Your inspector account and preferences',
            },
          },
        ],
      },
      {
        path: 'tenant',
        element: <RoleGuard allowedRoles={[ROLES.TENANT]} />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <TenantDashboard />,
            handle: {
              title: 'Tenant Portal',
              subtitle: 'Upcoming visits, lease info, and maintenance requests',
            },
          },
          {
            path: 'lease',
            element: <TenantLeasePage />,
            handle: {
              title: 'My Lease',
              subtitle: 'Lease terms, dates, and documents',
            },
          },
          {
            path: 'reports',
            element: <TenantReportsPage />,
            handle: {
              title: 'Report History',
              subtitle: 'Damage reports and maintenance submissions',
            },
          },
          {
            path: 'maintenance',
            element: <TenantMaintenancePage />,
            handle: {
              title: 'Request Maintenance',
              subtitle: 'Open and track maintenance tickets',
            },
          },
        ],
      },
      {
        path: '*',
        element: <RoleHomeRedirect />,
      },
    ],
  },
])

export default function App() {
  return null
}
