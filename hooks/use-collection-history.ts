/**
 * Collection History Hook
 * Provides undo/redo functionality for collection changes
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Collection, CollectionSnapshot } from '@/types/collection'

interface HistoryState {
  past: CollectionSnapshot[]
  present: CollectionSnapshot | null
  future: CollectionSnapshot[]
}

interface HistoryOptions {
  maxHistorySize?: number
  debounceMs?: number
  autoSnapshot?: boolean
}

const DEFAULT_OPTIONS: Required<HistoryOptions> = {
  maxHistorySize: 50,
  debounceMs: 500,
  autoSnapshot: true,
}

export function useCollectionHistory(
  collection: Collection | null | undefined,
  options: HistoryOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: null,
    future: [],
  })

  const debounceTimer = useRef<NodeJS.Timeout>()
  const lastSnapshotRef = useRef<string>('')

  // Create snapshot from collection
  const createSnapshot = useCallback((col: Collection): CollectionSnapshot => {
    return {
      id: `snapshot-${Date.now()}`,
      collectionId: col.id,
      timestamp: new Date(),
      data: JSON.parse(JSON.stringify(col)), // Deep clone
      version: col.version || 1,
      createdBy: col.updatedBy || col.createdBy,
    }
  }, [])

  // Check if collection has changed significantly
  const hasSignificantChanges = useCallback((col: Collection): boolean => {
    const currentHash = JSON.stringify({
      name: col.name,
      items: col.items.map(i => ({ id: i.id, name: i.name, order: i.order })),
      filters: col.filters,
      tags: col.tags,
    })
    
    if (currentHash === lastSnapshotRef.current) {
      return false
    }
    
    lastSnapshotRef.current = currentHash
    return true
  }, [])

  // Take a snapshot (manual or auto)
  const snapshot = useCallback((force: boolean = false) => {
    if (!collection) return

    if (!force && !hasSignificantChanges(collection)) {
      return
    }

    const newSnapshot = createSnapshot(collection)

    setHistory(prev => {
      const newPast = [...prev.past]
      
      // Add current state to past if it exists
      if (prev.present) {
        newPast.push(prev.present)
      }

      // Limit history size
      if (newPast.length > opts.maxHistorySize) {
        newPast.shift()
      }

      return {
        past: newPast,
        present: newSnapshot,
        future: [], // Clear future when new action is taken
      }
    })
  }, [collection, createSnapshot, hasSignificantChanges, opts.maxHistorySize])

  // Debounced snapshot for auto-snapshots
  const debouncedSnapshot = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      snapshot()
    }, opts.debounceMs)
  }, [snapshot, opts.debounceMs])

  // Auto-snapshot when collection changes
  useEffect(() => {
    if (!collection || !opts.autoSnapshot) return

    debouncedSnapshot()

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [collection, opts.autoSnapshot, debouncedSnapshot])

  // Initialize history with current collection
  useEffect(() => {
    if (collection && !history.present) {
      const initialSnapshot = createSnapshot(collection)
      setHistory({
        past: [],
        present: initialSnapshot,
        future: [],
      })
      lastSnapshotRef.current = JSON.stringify({
        name: collection.name,
        items: collection.items.map(i => ({ id: i.id, name: i.name, order: i.order })),
        filters: collection.filters,
        tags: collection.tags,
      })
    }
  }, [collection, history.present, createSnapshot])

  // Undo action
  const undo = useCallback((): CollectionSnapshot | null => {
    if (history.past.length === 0) return null

    const newPast = [...history.past]
    const previousState = newPast.pop()!

    setHistory({
      past: newPast,
      present: previousState,
      future: history.present ? [history.present, ...history.future] : history.future,
    })

    return previousState
  }, [history])

  // Redo action
  const redo = useCallback((): CollectionSnapshot | null => {
    if (history.future.length === 0) return null

    const newFuture = [...history.future]
    const nextState = newFuture.shift()!

    setHistory({
      past: history.present ? [...history.past, history.present] : history.past,
      present: nextState,
      future: newFuture,
    })

    return nextState
  }, [history])

  // Go to specific snapshot
  const goToSnapshot = useCallback((snapshotId: string): CollectionSnapshot | null => {
    const allSnapshots = [...history.past, history.present, ...history.future].filter(Boolean) as CollectionSnapshot[]
    const targetIndex = allSnapshots.findIndex(s => s.id === snapshotId)
    
    if (targetIndex === -1) return null

    const currentIndex = history.past.length
    const target = allSnapshots[targetIndex]

    if (targetIndex < currentIndex) {
      // Go back
      const stepsBack = currentIndex - targetIndex
      for (let i = 0; i < stepsBack; i++) {
        undo()
      }
    } else if (targetIndex > currentIndex) {
      // Go forward
      const stepsForward = targetIndex - currentIndex
      for (let i = 0; i < stepsForward; i++) {
        redo()
      }
    }

    return target
  }, [history, undo, redo])

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory({
      past: [],
      present: collection ? createSnapshot(collection) : null,
      future: [],
    })
  }, [collection, createSnapshot])

  // Get all snapshots
  const getAllSnapshots = useCallback((): CollectionSnapshot[] => {
    return [...history.past, history.present, ...history.future].filter(Boolean) as CollectionSnapshot[]
  }, [history])

  return {
    // State
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    historySize: history.past.length + (history.present ? 1 : 0) + history.future.length,
    currentSnapshot: history.present,
    
    // Actions
    undo,
    redo,
    snapshot,
    goToSnapshot,
    clearHistory,
    getAllSnapshots,
  }
}

// Simpler hook for basic undo/redo without snapshots
export function useSimpleHistory<T>(initialState: T, maxSize: number = 50) {
  const [history, setHistory] = useState({
    past: [] as T[],
    present: initialState,
    future: [] as T[],
  })

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory(prev => {
      const resolvedState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev.present)
        : newState

      const newPast = [...prev.past, prev.present]
      
      if (newPast.length > maxSize) {
        newPast.shift()
      }

      return {
        past: newPast,
        present: resolvedState,
        future: [],
      }
    })
  }, [maxSize])

  const undo = useCallback(() => {
    if (history.past.length === 0) return

    setHistory(prev => {
      const newPast = [...prev.past]
      const previousState = newPast.pop()!

      return {
        past: newPast,
        present: previousState,
        future: [prev.present, ...prev.future],
      }
    })
  }, [history.past.length])

  const redo = useCallback(() => {
    if (history.future.length === 0) return

    setHistory(prev => {
      const newFuture = [...prev.future]
      const nextState = newFuture.shift()!

      return {
        past: [...prev.past, prev.present],
        present: nextState,
        future: newFuture,
      }
    })
  }, [history.future.length])

  const reset = useCallback((newState?: T) => {
    setHistory({
      past: [],
      present: newState ?? initialState,
      future: [],
    })
  }, [initialState])

  return {
    state: history.present,
    setState,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}


