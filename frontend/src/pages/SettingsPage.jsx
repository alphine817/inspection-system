import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Plug, RotateCcw, Save } from 'lucide-react'
import { api } from '../api/client'
import SettingsSection from '../components/settings/SettingsSection'
import SettingsToggle from '../components/settings/SettingsToggle'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import StatusBadge from '../components/ui/StatusBadge'
import { ListSkeleton } from '../components/ui/Skeleton'
import useTheme from '../hooks/useTheme'
import { useRegisterRefetch } from '../hooks/useRegisterRefetch'
import { THEMES } from '../utils/theme'
import { hasValidationErrors } from '../utils/validation'
import {
  DATE_FORMAT_OPTIONS,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  TIMEZONE_OPTIONS,
  validateSettings,
} from '../utils/settings'

export default function SettingsPage() {
  const [values, setValues] = useState(loadSettings)
  const [touched, setTouched] = useState({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [healthLoading, setHealthLoading] = useState(true)
  const [healthError, setHealthError] = useState(null)
  const [healthOk, setHealthOk] = useState(false)

  const errors = useMemo(() => validateSettings(values), [values])
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field]),
  )

  const apiBaseUrl = import.meta.env.VITE_API_URL || '(Vite proxy → localhost:5000)'

  const checkHealth = useCallback(async () => {
    setHealthLoading(true)
    setHealthError(null)

    try {
      await api.health()
      setHealthOk(true)
    } catch (err) {
      setHealthOk(false)
      setHealthError(err.message || 'Unable to reach the API.')
    } finally {
      setHealthLoading(false)
    }
  }, [])

  useRegisterRefetch(checkHealth)

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  function updateField(field, value) {
    setSaved(false)
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleBlur(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setTouched({ workspaceName: true, timezone: true, dateFormat: true })

    if (hasValidationErrors(errors)) return

    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    saveSettings(values)
    window.dispatchEvent(new CustomEvent('settings:updated'))
    setSaving(false)
    setSaved(true)
  }

  function handleReset() {
    setValues({ ...DEFAULT_SETTINGS })
    setTouched({})
    setSaved(false)
  }

  if (healthError && !healthLoading && !healthOk) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="API connection issue"
          message={`${healthError} Settings are still editable locally, but live data requires the backend.`}
          onRetry={checkHealth}
        />
        <SettingsForm
          values={values}
          visibleErrors={visibleErrors}
          updateField={updateField}
          handleBlur={handleBlur}
          handleSave={handleSave}
          handleReset={handleReset}
          saving={saving}
          saved={saved}
          apiBaseUrl={apiBaseUrl}
          healthLoading={healthLoading}
          healthOk={healthOk}
          checkHealth={checkHealth}
        />
      </div>
    )
  }

  return (
    <SettingsForm
      values={values}
      visibleErrors={visibleErrors}
      updateField={updateField}
      handleBlur={handleBlur}
      handleSave={handleSave}
      handleReset={handleReset}
      saving={saving}
      saved={saved}
      apiBaseUrl={apiBaseUrl}
      healthLoading={healthLoading}
      healthOk={healthOk}
      checkHealth={checkHealth}
    />
  )
}

function SettingsForm({
  values,
  visibleErrors,
  updateField,
  handleBlur,
  handleSave,
  handleReset,
  saving,
  saved,
  apiBaseUrl,
  healthLoading,
  healthOk,
  checkHealth,
}) {
  const { theme, setTheme, isDark } = useTheme()

  function handleThemeToggle(checked) {
    if (checked) {
      setTheme(THEMES.DARK)
      return
    }

    setTheme(THEMES.LIGHT)
  }

  function handleSystemPreferenceToggle(checked) {
    if (checked) {
      setTheme(THEMES.SYSTEM)
      return
    }

    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT)
  }

  return (
    <form className="space-y-6" onSubmit={handleSave} noValidate>
      {saved && (
        <div
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold">Settings saved to this browser.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingsSection
          title="Workspace"
          description="Customize how your portfolio appears across the app"
        >
          <div className="space-y-4">
            <Input
              name="workspaceName"
              label="Workspace name"
              placeholder="Kenya Portfolio"
              value={values.workspaceName}
              onChange={(event) => updateField('workspaceName', event.target.value)}
              onBlur={() => handleBlur('workspaceName')}
              error={visibleErrors.workspaceName}
            />
            <Select
              name="timezone"
              label="Timezone"
              options={TIMEZONE_OPTIONS}
              value={values.timezone}
              onChange={(event) => updateField('timezone', event.target.value)}
              onBlur={() => handleBlur('timezone')}
              error={visibleErrors.timezone}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="API Connection"
          description="Backend status for your Flask inspection API"
        >
          {healthLoading ? (
            <ListSkeleton rows={2} />
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Base URL
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200">{apiBaseUrl}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Plug className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</span>
                  <StatusBadge
                    status={healthOk ? 'good' : 'failed'}
                    label={healthOk ? 'Connected' : 'Disconnected'}
                  />
                </div>
                <button
                  type="button"
                  onClick={checkHealth}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 active:bg-brand-100 dark:text-brand-400 dark:hover:bg-brand-950/50 dark:active:bg-brand-900/40"
                >
                  Test connection
                </button>
              </div>
            </div>
          )}
        </SettingsSection>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingsSection
          title="Notifications"
          description="Control which alerts you receive (stored locally until email is wired)"
        >
          <div className="space-y-3">
            <SettingsToggle
              id="emailNotifications"
              label="Email notifications"
              description="Receive summary emails for inspection activity"
              checked={values.emailNotifications}
              onChange={(checked) => updateField('emailNotifications', checked)}
            />
            <SettingsToggle
              id="inspectionReminders"
              label="Inspection reminders"
              description="Get reminded before scheduled inspections"
              checked={values.inspectionReminders}
              onChange={(checked) => updateField('inspectionReminders', checked)}
            />
            <SettingsToggle
              id="overdueAlerts"
              label="Overdue alerts"
              description="Highlight overdue inspections on the dashboard"
              checked={values.overdueAlerts}
              onChange={(checked) => updateField('overdueAlerts', checked)}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Display"
          description="Adjust how dates and tables appear in the interface"
        >
          <div className="space-y-4">
            <Select
              name="dateFormat"
              label="Date format"
              options={DATE_FORMAT_OPTIONS}
              value={values.dateFormat}
              onChange={(event) => updateField('dateFormat', event.target.value)}
              onBlur={() => handleBlur('dateFormat')}
              error={visibleErrors.dateFormat}
            />
            <SettingsToggle
              id="compactTables"
              label="Compact tables"
              description="Reduce row padding on desktop data tables"
              checked={values.compactTables}
              onChange={(checked) => updateField('compactTables', checked)}
            />
            <SettingsToggle
              id="darkMode"
              label="Dark mode"
              description="Switch the interface to the darker color palette"
              checked={isDark}
              onChange={handleThemeToggle}
            />
            <SettingsToggle
              id="systemPreference"
              label="Use system preference"
              description="Follow your device's light or dark appearance setting"
              checked={theme === THEMES.SYSTEM}
              onChange={handleSystemPreferenceToggle}
            />
          </div>
        </SettingsSection>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? 'Saving…' : 'Save settings'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset to defaults
        </Button>
      </div>
    </form>
  )
}
