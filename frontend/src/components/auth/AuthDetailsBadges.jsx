import { authImages } from '../../constants/authImages'

export default function AuthDetailsBadges() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
        <img
          src={authImages.avatarInspector}
          alt=""
          className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-50"
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="text-sm font-semibold text-ink">Jane Mwangi</p>
          <p className="text-xs text-slate-500">Lead Inspector</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
        <img
          src={authImages.blueprint}
          alt="Architectural blueprint preview"
          className="h-20 w-28 object-cover"
          loading="lazy"
          decoding="async"
        />
        <p className="px-3 py-2 text-[10px] font-bold tracking-wide text-brand-600 uppercase">
          Blueprint
        </p>
      </div>
    </div>
  )
}
