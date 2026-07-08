import { useMemo, useState } from 'react'
import { Mail, Send } from 'lucide-react'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { ListSkeleton } from '../../components/ui/Skeleton'
import useAuth from '../../hooks/useAuth'
import { usePortalWorkspace } from '../../hooks/usePortalWorkspace'
import { formatDateTime } from '../../utils/formatters'
import { addManagerCommunication, getManagerCommunications } from '../../utils/tenantStorage'

const MESSAGE_TYPES = [
  { value: 'inspection_notice', label: 'Inspection notice' },
  { value: 'maintenance_update', label: 'Maintenance update' },
  { value: 'lease_reminder', label: 'Lease reminder' },
  { value: 'general', label: 'General message' },
]

export default function ManagerCommunicationsPage() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = usePortalWorkspace()
  const [messages, setMessages] = useState(() => getManagerCommunications(user?.id))
  const [recipientId, setRecipientId] = useState('')
  const [messageType, setMessageType] = useState('inspection_notice')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const tenants = useMemo(
    () => (data?.users ?? []).filter((entry) => entry.role === 'tenant' && entry.is_active),
    [data?.users],
  )

  const tenantOptions = tenants.map((tenant) => ({
    value: String(tenant.id),
    label: `${tenant.first_name} ${tenant.last_name} (${tenant.email})`,
  }))

  const tenantsById = useMemo(
    () => Object.fromEntries(tenants.map((tenant) => [tenant.id, tenant])),
    [tenants],
  )

  async function handleSubmit(event) {
    event.preventDefault()
    if (!recipientId || !subject.trim() || !body.trim()) return

    setSubmitting(true)
    try {
      const tenant = tenantsById[Number(recipientId)]
      const entry = addManagerCommunication(user.id, {
        recipientId: Number(recipientId),
        recipientName: tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Tenant',
        recipientEmail: tenant?.email ?? '',
        messageType,
        subject: subject.trim(),
        body: body.trim(),
      })
      setMessages((current) => [entry, ...current])
      setRecipientId('')
      setSubject('')
      setBody('')
    } finally {
      setSubmitting(false)
    }
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Tenant communications"
        description="Send inspection notices, maintenance updates, and reminders to tenants in your portfolio."
      />

      {loading || !data ? (
        <ListSkeleton rows={4} />
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <Send className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Compose message</h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Select
                name="recipient"
                label="Recipient"
                placeholder={tenants.length ? 'Select tenant' : 'No tenants available'}
                options={tenantOptions}
                value={recipientId}
                onChange={(event) => setRecipientId(event.target.value)}
                disabled={!tenants.length}
              />
              <Select
                name="messageType"
                label="Message type"
                options={MESSAGE_TYPES}
                value={messageType}
                onChange={(event) => setMessageType(event.target.value)}
              />
              <Input
                name="subject"
                label="Subject"
                placeholder="Upcoming inspection — Unit 204"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                containerClassName="md:col-span-2"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="message-body" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                id="message-body"
                rows={4}
                placeholder="Write your message to the tenant..."
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <Button type="submit" disabled={submitting || !tenants.length} className="mt-5">
              {submitting ? 'Sending…' : 'Send message'}
            </Button>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Sent messages</h3>
            </div>

            {messages.length ? (
              <ul className="space-y-3">
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{message.subject}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          To {message.recipientName} · {formatDateTime(message.sentAt)}
                        </p>
                      </div>
                      <span className="shrink-0 self-start rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold capitalize text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
                        {message.messageType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{message.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No messages sent yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
