export default function AuthVisualPanel({ backgroundSrc, backgroundAlt, children }) {
  return (
    <div className="relative flex min-h-[34rem] items-center justify-center px-4 py-10 sm:px-6 lg:min-h-svh lg:px-10 lg:py-12">
      <img
        src={backgroundSrc}
        alt={backgroundAlt}
        className="absolute inset-0 h-full w-full object-cover lg:h-screen"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">{children}</div>
      </div>
    </div>
  )
}
