import { useMemo, useRef, useState } from 'react'
import { Shield, UserCheck, Users, UserX } from 'lucide-react'
import { getUsersPageData } from '../api/client'
import AddUserForm from '../components/users/AddUserForm'
import UsersList, { UsersToolbar } from '../components/users/UsersList'
import ErrorState from '../components/ui/ErrorState'
import { StatCardSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { useRegisterRefetch } from '../hooks/useRegisterRefetch'
import { formatNumber, getInspectorName, matchesSearch } from '../utils/formatters'

function SummaryStat({ label, value, icon: Icon, tone = 'neutral' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-100',
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatNumber(value)}</p>
        </div>
        <div
          className={[
            'flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset',
            tones[tone],
          ].join(' ')}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

function buildRoleCounts(users) {
  return users.reduce(
    (acc, user) => {
      acc.all += 1
      if (acc[user.role] != null) acc[user.role] += 1
      if (user.is_active) acc.active += 1
      else acc.inactive += 1
      return acc
    },
    {
      all: 0,
      admin: 0,
      property_manager: 0,
      inspector: 0,
      tenant: 0,
      active: 0,
      inactive: 0,
    },
  )
}

export default function UsersPage() {
  const formRef = useRef(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const { data, loading, error, refetch } = useAsyncData(getUsersPageData, [])

  useRegisterRefetch(refetch)

  const roleCounts = useMemo(
    () => buildRoleCounts(data?.users ?? []),
    [data?.users],
  )

  const filteredUsers = useMemo(() => {
    if (!data?.users) return []

    return data.users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      if (!matchesRole) return false

      const haystack = [getInspectorName(user), user.email, user.role].join(' ')
      return matchesSearch(haystack, search)
    })
  }, [data?.users, roleFilter, search])

  function scrollToAddForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (error) {
    return (
      <ErrorState
        message={`${error} Make sure the Flask backend is running on port 5000.`}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryStat label="Total Users" value={roleCounts.all} icon={Users} tone="brand" />
          <SummaryStat label="Active" value={roleCounts.active} icon={UserCheck} tone="success" />
          <SummaryStat label="Inspectors" value={roleCounts.inspector} icon={Shield} />
          <SummaryStat
            label="Inactive"
            value={roleCounts.inactive}
            icon={UserX}
            tone={roleCounts.inactive > 0 ? 'warning' : 'neutral'}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
          <UsersToolbar
            search={search}
            onSearchChange={setSearch}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            roleCounts={roleCounts}
            onAddUser={scrollToAddForm}
            resultCount={filteredUsers.length}
          />

          <div className="mt-6">
            <UsersList
              users={filteredUsers}
              loading={loading}
              onAddUser={scrollToAddForm}
              emptyTitle={
                search || roleFilter !== 'all'
                  ? 'No users match your filters'
                  : 'No users yet'
              }
              emptyDescription={
                search || roleFilter !== 'all'
                  ? 'Clear your search or try a different role filter.'
                  : 'Add team members to manage properties, inspections, and tenant access.'
              }
            />
          </div>
        </section>

        <div ref={formRef}>
          <AddUserForm onSubmitted={refetch} />
        </div>
      </div>
    </div>
  )
}
