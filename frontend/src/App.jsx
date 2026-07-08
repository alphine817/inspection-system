import { useCallback, useRef, useState } from 'react'
import { createBrowserRouter, useMatches } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import InspectionsPage from './pages/InspectionsPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import PropertiesPage from './pages/PropertiesPage'
import SettingsPage from './pages/SettingsPage'
import SignUpPage from './pages/SignUpPage'
import UsersPage from './pages/UsersPage'

const DEFAULT_META = {
  title: 'Inspection Dashboard',
  subtitle: 'Monitor properties, units, and inspection activity across your portfolio',
}

function AppLayoutRoute() {
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
    <AppLayout
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
    element: <AppLayoutRoute />,
    children: [
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
])

export default function App() {
  return null
}
