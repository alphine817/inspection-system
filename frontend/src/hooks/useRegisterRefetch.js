import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export function useRegisterRefetch(refetch) {
  const context = useOutletContext() ?? {}
  const { registerRefetch } = context

  useEffect(() => {
    registerRefetch?.(refetch)
  }, [registerRefetch, refetch])
}
