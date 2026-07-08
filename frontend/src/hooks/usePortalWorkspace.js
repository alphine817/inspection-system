import { useMemo } from 'react'
import { getInspectionsPageData } from '../api/client'
import { buildPortalLookups } from '../utils/portalHelpers'
import { useAsyncData } from './useAsyncData'

export function usePortalWorkspace() {
  const { data, loading, error, refetch } = useAsyncData(getInspectionsPageData, [])

  const lookups = useMemo(
    () => (data ? buildPortalLookups(data) : null),
    [data],
  )

  return { data, lookups, loading, error, refetch }
}
