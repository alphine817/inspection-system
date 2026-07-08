import { Plus, UserPlus, Users } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import FilterChips from '../ui/FilterChips'
import SearchInput from '../ui/SearchInput'
import StatusBadge from '../ui/StatusBadge'
import { TableSkeleton } from '../ui/Skeleton'
import UserRoleBadge from './UserRoleBadge'
import { getInspectorName } from '../../utils/formatters'

function UserAvatar({ user }) {
  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 ring-2 ring-white dark:ring-slate-900/50">
      {initials || '?'}
    </div>
  )
}

export default function UsersList({
  users,
  loading,
  onAddUser,
  emptyTitle = 'No users found',
  emptyDescription = 'Add team members to manage properties and inspections.',
}) {
  if (loading) {
    return <TableSkeleton rows={6} />
  }

  if (!users.length) {
    return (
      <EmptyState
        icon={Users}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Add user"
        onAction={onAddUser}
      />
    )
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/60 md:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800/60">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="hidden px-4 py-3 lg:table-cell">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800/60 dark:bg-slate-900/30">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {getInspectorName(user)}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400 lg:hidden">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden max-w-[220px] truncate px-4 py-3 text-slate-600 dark:text-slate-400 lg:table-cell">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={user.is_active ? 'good' : 'failed'}
                    label={user.is_active ? 'Active' : 'Inactive'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/40"
          >
            <div className="flex items-start gap-3">
              <UserAvatar user={user} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {getInspectorName(user)}
                  </p>
                  <StatusBadge
                    status={user.is_active ? 'good' : 'failed'}
                    label={user.is_active ? 'Active' : 'Inactive'}
                  />
                </div>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                <div className="mt-3">
                  <UserRoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export function UsersToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  roleCounts,
  onAddUser,
  resultCount,
}) {
  const filterOptions = [
    { value: 'all', label: 'All', count: roleCounts.all },
    { value: 'admin', label: 'Admin', count: roleCounts.admin },
    { value: 'property_manager', label: 'Managers', count: roleCounts.property_manager },
    { value: 'inspector', label: 'Inspectors', count: roleCounts.inspector },
    { value: 'tenant', label: 'Tenants', count: roleCounts.tenant },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-md">
          <SearchInput
            id="users-search"
            value={search}
            onChange={onSearchChange}
            placeholder="Search by name or email…"
          />
        </div>
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{resultCount}</span> users
          </p>
          <button
            type="button"
            onClick={onAddUser}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 active:bg-brand-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add user
          </button>
        </div>
      </div>

      <FilterChips options={filterOptions} value={roleFilter} onChange={onRoleFilterChange} />
    </div>
  )
}
