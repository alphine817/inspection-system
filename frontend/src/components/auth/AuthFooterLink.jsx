import { Link } from 'react-router-dom'

export default function AuthFooterLink({ prompt, linkText, to }) {
  return (
    <p className="mt-8 text-center text-sm text-slate-600">
      {prompt}{' '}
      <Link
        to={to}
        className="font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:rounded-sm focus-visible:ring-brand-500"
      >
        {linkText}
      </Link>
    </p>
  )
}
