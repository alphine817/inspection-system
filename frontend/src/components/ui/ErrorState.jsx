import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ title = 'Unable to load data', message, onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/70 px-6 py-10 text-center"
      role="alert"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-red-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-red-700/90">{message}</p>
      {onRetry && (
        <Button variant="danger" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
