import { useState } from 'react'
import { Home, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#rent-automation', label: 'Rent Automation' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:ring-brand-500"
          onClick={closeMenu}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/20">
            <Home className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-ink">PropStat Pro</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Landing navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative rounded-lg py-1 text-sm font-medium tracking-[0.01em] text-slate-700 transition-colors hover:text-brand-600 focus-visible:ring-brand-500"
            >
              {link.label}
              <span
                className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-brand-600 transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-600 focus-visible:ring-brand-500"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-[#109E16] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e8613] focus-visible:ring-brand-500"
          >
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={[
          'border-t border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden',
          menuOpen ? 'block' : 'hidden',
        ].join(' ')}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile landing navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-[#109E16] px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0e8613] focus-visible:ring-brand-500"
            onClick={closeMenu}
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  )
}
