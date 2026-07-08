import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppLayout({ title, subtitle, onRefresh, refreshing, outletContext }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[260px_1fr]">
      <div
        className={[
          'fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={[
          'fixed inset-y-0 left-0 z-40 w-[min(85vw,260px)] transform transition-transform duration-300 lg:static lg:translate-x-0',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar onNavigate={() => setMenuOpen(false)} />
      </div>

      <div className="min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  )
}
