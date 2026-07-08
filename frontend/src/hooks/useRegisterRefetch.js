import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export function useRegisterRefetch(refetch) {
  const { registerRefetch } = useOutletContext()

  useEffect(() => {
    registerRefetch?.(refetch)
  }, [registerRefetch, refetch])
}
