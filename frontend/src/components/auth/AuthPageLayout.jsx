export default function AuthPageLayout({ details, visual }) {
  return (
    <div className="min-h-svh bg-slate-100">
      <div className="grid min-h-svh lg:grid-cols-2">
        <aside
          className="order-2 flex flex-col justify-center bg-white px-5 py-10 sm:px-8 lg:order-1 lg:px-12 lg:py-14 xl:px-16"
          aria-label="Product information"
        >
          {details}
        </aside>

        <section className="order-1 lg:order-2" aria-label="Authentication">
          {visual}
        </section>
      </div>
    </div>
  )
}
