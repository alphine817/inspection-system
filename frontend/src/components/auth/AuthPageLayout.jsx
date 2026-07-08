export default function AuthPageLayout({ visual }) {
  return (
    <div className="min-h-svh overflow-hidden bg-slate-100 dark:bg-slate-950">
      <section className="min-h-svh" aria-label="Authentication">
        {visual}
      </section>
    </div>
  )
}
