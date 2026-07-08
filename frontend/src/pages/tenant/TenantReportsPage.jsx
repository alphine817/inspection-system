import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import StatusBadge from '../../components/ui/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { formatDateTime } from '../../utils/formatters'
import { getTenantReports } from '../../utils/tenantStorage'

const statusTone = {
  submitted: 'scheduled',
  in_review: 'in_progress',
  resolved: 'completed',
}

export default function TenantReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState(() => getTenantReports(user?.id))

  function refreshReports() {
    setReports(getTenantReports(user?.id))
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Report history"
        description="Track damage reports you have submitted and their review status."
        action={
          <button
            type="button"
            onClick={refreshReports}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Refresh
          </button>
        }
      />

      {reports.length ? (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li
              key={report.id}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={statusTone[report.status] ?? 'scheduled'} label={report.status.replace(/_/g, ' ')} />
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{report.location}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{report.description}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Submitted {formatDateTime(report.createdAt)}
                  </p>
                  {report.fileNames?.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {report.fileNames.length} photo{report.fileNames.length === 1 ? '' : 's'} attached
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <ClipboardList className="h-10 w-10 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">No reports yet</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Damage reports submitted from your dashboard will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
