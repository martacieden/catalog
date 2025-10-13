/**
 * Auto-Sync Hook
 * Handles automatic synchronization of collections based on rules
 */

import { useEffect, useRef, useCallback } from "react"
import { Collection, CollectionItem } from "@/types/collection"
import { applyFilterRules } from "@/lib/rule-engine"

interface AutoSyncOptions {
  enabled?: boolean
  interval?: number // milliseconds
  onSync?: (matchedItems: CollectionItem[]) => void
  onError?: (error: Error) => void
}

const DEFAULT_OPTIONS: Required<Omit<AutoSyncOptions, "onSync" | "onError">> = {
  enabled: true,
  interval: 30000, // 30 seconds
}

/**
 * Hook for automatic collection synchronization
 */
export function useAutoSync(
  collection: Collection | null | undefined,
  allItems: CollectionItem[],
  options: AutoSyncOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const intervalRef = useRef<NodeJS.Timeout>()
  const lastSyncRef = useRef<Date>()

  const syncNow = useCallback(() => {
    if (!collection || !collection.autoSync || !collection.filters) {
      return
    }

    try {
      // Apply rules to all available items
      const matchedItems = applyFilterRules(
        allItems,
        collection.filters,
        { caseSensitive: false }
      )

      // Update last sync time
      lastSyncRef.current = new Date()

      // Notify callback
      if (opts.onSync) {
        opts.onSync(matchedItems)
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[AutoSync] Collection "${collection.name}" synced: ${matchedItems.length} items matched`
        )
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("[AutoSync] Sync error:", error)
      }
      if (opts.onError) {
        opts.onError(error as Error)
      }
    }
  }, [collection, allItems, opts])

  // Set up interval-based sync
  useEffect(() => {
    if (!opts.enabled || !collection?.autoSync) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
      return
    }

    // Initial sync
    syncNow()

    // Set up recurring sync
    intervalRef.current = setInterval(() => {
      syncNow()
    }, opts.interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [opts.enabled, opts.interval, collection?.autoSync, syncNow])

  return {
    syncNow,
    lastSync: lastSyncRef.current,
    isEnabled: opts.enabled && collection?.autoSync,
  }
}

/**
 * Hook for manual sync trigger with loading state
 */
export function useManualSync(
  collection: Collection | null | undefined,
  allItems: CollectionItem[]
) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const sync = useCallback(async () => {
    if (!collection) return []

    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate async operation

      const matchedItems = applyFilterRules(
        allItems,
        collection.filters || [],
        { caseSensitive: false }
      )

      setIsLoading(false)
      return matchedItems
    } catch (err) {
      const error = err as Error
      setError(error)
      setIsLoading(false)
      throw error
    }
  }, [collection, allItems])

  return {
    sync,
    isLoading,
    error,
  }
}

// Note: React import for useState
import * as React from "react"

