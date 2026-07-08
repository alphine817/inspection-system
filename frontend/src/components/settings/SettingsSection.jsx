export default function SettingsSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-6">
      <div className="mb-5 border-b border-slate-100 pb-4 dark:border-slate-800/60">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {children}
    </section>
  )
}
