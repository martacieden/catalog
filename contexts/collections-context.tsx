"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react"
import type { 
  Collection, 
  CollectionItem, 
  CollectionStats,
  BulkOperation,
  BulkOperationResult,
  SyncHistory,
  SyncPreview
} from "@/types/collection"
import type { Dependency, DependencyGroup } from "@/types/dependency"
import type { FilterRule, ValidationResult } from "@/types/rule"
import type { User } from "@/types/user"
import { createSyncPreview, createSyncHistory, getAvailableItems as getAvailableItemsUtil } from "@/lib/auto-sync-engine"
import type { AIRecommendation } from "@/lib/ai-recommendations"
import { getAllRecommendations } from "@/lib/ai-recommendations"
import { DEMO_DEPENDENCIES } from "@/lib/mock-data"
import { applyHighValueAssetsFilter } from "@/lib/collection-filters"
import { MOCK_CATALOG_ITEMS } from "@/lib/mock-data"

// Mock current user - in real app, get from auth context
const currentUser: User = {
  id: 'user-1',
  name: 'Current User',
  email: 'user@example.com',
  avatar: '/placeholder-user.jpg'
}

// Re-export types for backward compatibility
export type { Collection, CollectionItem, FilterRule }

// Constants for localStorage
const COLLECTIONS_KEY = 'way2bi_collections'
const AI_RECOMMENDATIONS_KEY = 'way2bi_ai_recommendations'
const AI_BANNER_STATE_KEY = 'way2bi_show_ai_banner'

/**
 * STABLE RULE FOR COLLECTION CREATION:
 * ====================================
 * 
 * ВСІ операції з колекціями ОБОВ'ЯЗКОВО повинні зберігатися в localStorage!
 * 
 * Це правило застосовується до:
 * - addCollection() - створення нової колекції
 * - addAICollection() - створення AI колекції  
 * - acceptRecommendation() - створення колекції з AI рекомендації
 * - updateCollection() - оновлення колекції
 * - removeCollection() - видалення колекції
 * - duplicateCollection() - дублювання колекції
 * 
 * Кожна функція повинна викликати saveCollectionsToStorage(updated) після setCollections()
 */
const saveCollectionsToStorage = (collections: Collection[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
    console.log('💾 Collections saved to localStorage:', collections.length, 'collections')
  }
}

// Demo collections with subcollections
const createDemoCollections = (): Collection[] => {
  const now = new Date()
  
  // Aviation items for main collection and subcollections
  const aviationItems = [
    {
      id: 'avi-item-1',
      name: 'Gulfstream G650',
      type: 'Aircraft',
      category: 'Private Jets',
      status: 'Available',
      location: 'Miami International',
      idCode: 'AVI-001',
      tags: ['private-jet', 'gulfstream', 'luxury'],
      value: 65000000,
      guestRating: 5.0,
      createdAt: now,
    },
    {
      id: 'avi-item-2', 
      name: 'Bell 429 Helicopter',
      type: 'Helicopter',
      category: 'Corporate Helicopters',
      status: 'Maintenance',
      location: 'Los Angeles',
      idCode: 'AVI-002',
      tags: ['helicopter', 'bell', 'corporate'],
      value: 5500000,
      guestRating: 4.8,
      createdAt: now,
    },
    {
      id: 'avi-item-3',
      name: 'Citation X Business Jet',
      type: 'Aircraft', 
      category: 'Business Jets',
      status: 'Available',
      location: 'Dallas, TX',
      idCode: 'AVI-003',
      tags: ['business-jet', 'citation', 'fast'],
      value: 22000000,
      guestRating: 4.9,
      createdAt: now,
    }
  ]

  const fleetItems = [
    {
      id: 'fleet-item-1',
      name: 'Gulfstream G650',
      type: 'Aircraft',
      category: 'Private Jets',
      status: 'Active',
      location: 'Miami International',
      idCode: 'FLT-001',
      tags: ['active', 'gulfstream'],
      value: 65000000,
      guestRating: 5.0,
      createdAt: now,
    },
    {
      id: 'fleet-item-2',
      name: 'Bell 429 Helicopter',
      type: 'Helicopter',
      category: 'Corporate Helicopters',
      status: 'Active',
      location: 'Los Angeles',
      idCode: 'FLT-002',
      tags: ['active', 'helicopter'],
      value: 5500000,
      guestRating: 4.8,
      createdAt: now,
    }
  ]

  const maintenanceItems = [
    {
      id: 'maint-item-1',
      name: 'Citation X - Engine Overhaul',
      type: 'Maintenance',
      category: 'Engine Work',
      status: 'In Progress',
      location: 'Dallas Maintenance Facility',
      idCode: 'MNT-001',
      tags: ['engine', 'overhaul', 'in-progress'],
      value: 500000,
      guestRating: 0,
      createdAt: now,
    },
    {
      id: 'maint-item-2',
      name: 'Bell 429 - Annual Inspection',
      type: 'Maintenance',
      category: 'Inspections',
      status: 'Scheduled',
      location: 'Los Angeles',
      idCode: 'MNT-002',
      tags: ['inspection', 'annual', 'scheduled'],
      value: 25000,
      guestRating: 0,
      createdAt: now,
    }
  ]

  const legalItems = [
    {
      id: 'legal-item-1',
      name: 'Aviation License',
      type: 'Document',
      category: 'Licenses',
      status: 'Active',
      location: 'FAA Records',
      idCode: 'LEG-001',
      tags: ['license', 'faa', 'active'],
      value: 0,
      guestRating: 0,
      createdAt: now,
    },
    {
      id: 'legal-item-2',
      name: 'Operating Certificate',
      type: 'Document',
      category: 'Certificates',
      status: 'Active',
      location: 'FAA Records',
      idCode: 'LEG-002',
      tags: ['certificate', 'operating', 'active'],
      value: 0,
      guestRating: 0,
      createdAt: now,
    }
  ]

  const insuranceItems = [
    {
      id: 'ins-item-1',
      name: 'Aircraft Liability Insurance',
      type: 'Insurance',
      category: 'Liability',
      status: 'Active',
      location: 'Insurance Provider',
      idCode: 'INS-001',
      tags: ['liability', 'aircraft', 'active'],
      value: 0,
      guestRating: 0,
      createdAt: now,
    },
    {
      id: 'ins-item-2',
      name: 'Hull Insurance',
      type: 'Insurance',
      category: 'Hull Coverage',
      status: 'Active',
      location: 'Insurance Provider',
      idCode: 'INS-002',
      tags: ['hull', 'coverage', 'active'],
      value: 0,
      guestRating: 0,
      createdAt: now,
    }
  ]

  return [
    // Main High Value Assets Collection
    {
      id: 'high-value-assets',
      name: 'High Value Assets',
      description: 'Premium assets worth over $1M with high ratings and active status. This smart collection automatically includes properties, aviation, and maritime assets that meet our premium criteria.',
      icon: '💎',
      type: 'smart' as const,
      category: 'Premium Assets',
      tags: ['high-value', 'premium', 'assets'],
      items: aviationItems,
      filters: [],
      autoSync: true,
      parentId: null,
      subcollections: [],
      depth: 0,
      isSubcollection: false,
      subcollectionCount: 2,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser,
      itemCount: aviationItems.length,
      viewCount: 0,
    },
    // Fleet Subcollection
    {
      id: 'fleet-subcollection',
      name: 'Fleet',
      description: 'Aviation fleet management and operations',
      icon: '✈️',
      type: 'manual' as const,
      category: 'Aviation',
      tags: ['fleet', 'aviation', 'operations'],
      items: fleetItems,
      filters: [],
      autoSync: false,
      parentId: 'high-value-assets',
      subcollections: [],
      depth: 1,
      isSubcollection: true,
      subcollectionCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser,
      itemCount: fleetItems.length,
      viewCount: 0,
    },
    // Maintenance Subcollection
    {
      id: 'maintenance-subcollection',
      name: 'Maintenance',
      description: 'Aircraft maintenance and inspection records',
      icon: '🔧',
      type: 'manual' as const,
      category: 'Maintenance',
      tags: ['maintenance', 'inspection', 'records'],
      items: maintenanceItems,
      filters: [],
      autoSync: false,
      parentId: 'high-value-assets',
      subcollections: [],
      depth: 1,
      isSubcollection: true,
      subcollectionCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser,
      itemCount: maintenanceItems.length,
      viewCount: 0,
    }
  ]
}

// High-value assets filter rules
const highValueAssetsRules: FilterRule[] = [
  {
    id: "rule-1",
    field: "value",
    operator: "greater_than",
    value: "1000000"
  },
  {
    id: "rule-2",
    field: "category", 
    operator: "in",
    value: ["Properties", "Vehicles", "Aviation", "Maritime"]
  },
  {
    id: "rule-3",
    field: "status",
    operator: "in", 
    value: ["Available", "Active", "Maintenance"]
  },
  {
    id: "rule-4",
    field: "rating",
    operator: "greater_than_or_equal",
    value: "4"
  }
]

interface CollectionsContextType {
  // Core State
  collections: Collection[]
  allItems: CollectionItem[] // Всі доступні елементи в системі
  
  // AI Recommendations
  aiRecommendations: AIRecommendation[]
  showAIBanner: boolean
  dismissRecommendation: (id: string) => void
  acceptRecommendation: (id: string) => string | null
  toggleAIBanner: (show: boolean) => void
  
  // Collection CRUD
  addCollection: (collection: Omit<Collection, "id" | "createdAt" | "itemCount">) => Collection
  addAICollection: (name: string, description: string, items: CollectionItem[]) => Collection
  updateCollection: (id: string, updates: Partial<Collection>) => void
  removeCollection: (id: string) => void
  getCollectionById: (id: string) => Collection | undefined
  duplicateCollection: (id: string) => Collection | null
  archiveCollection: (id: string) => void
  
  // Subcollections Management
  createSubcollection: (parentId: string, data: Omit<Collection, "id" | "createdAt" | "itemCount" | "parentId" | "depth">) => Collection
  getSubcollections: (parentId: string) => Collection[]
  getParentCollection: (subcollectionId: string) => Collection | null
  getCollectionPath: (collectionId: string) => Collection[]
  moveItemsToSubcollection: (itemIds: string[], fromCollectionId: string, toCollectionId: string) => void
  
  // Dependencies Management
  getDependencies: (collectionId: string) => Dependency[]
  getDependencyGroups: (collectionId: string) => DependencyGroup[]
  addDependency: (dependency: Omit<Dependency, "id" | "createdAt">) => Dependency
  removeDependency: (dependencyId: string) => void
  getDependenciesForCollection: (collectionId: string) => Dependency[]
  
  // Items Management
  addNewItem: (item: Omit<CollectionItem, "id">) => CollectionItem
  addItemToCollection: (collectionId: string, item: CollectionItem) => void
  removeItemFromCollection: (collectionId: string, itemId: string) => void
  updateItemInCollection: (collectionId: string, itemId: string, updates: Partial<CollectionItem>) => void
  reorderItems: (collectionId: string, itemIds: string[]) => void
  bulkAddItems: (collectionId: string, items: CollectionItem[]) => void
  bulkRemoveItems: (collectionId: string, itemIds: string[]) => void
  bulkOperateOnItems: (collectionId: string, operation: BulkOperation) => BulkOperationResult
  getAvailableItems: (collectionId: string) => CollectionItem[]
  
  // Rules & Automation
  toggleAutoSync: (collectionId: string) => void
  updateRules: (collectionId: string, rules: FilterRule[]) => void
  validateRules: (rules: FilterRule[]) => ValidationResult
  syncCollection: (collectionId: string) => Promise<void>
  previewSync: (collectionId: string) => SyncPreview | null
  getSyncHistory: (collectionId: string) => SyncHistory[]
  
  // Stats & Analytics
  updateCollectionItemCount: (collectionId: string, allItems: any[]) => void
  getCollectionStats: (collectionId: string) => CollectionStats | null
  
  // Utility
  searchCollections: (query: string) => Collection[]
  filterCollections: (filter: (c: Collection) => boolean) => Collection[]
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined)

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage after component mounts
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COLLECTIONS_KEY)
      const savedCollections = saved ? JSON.parse(saved) : []
      
      // If no collections exist, create demo collections with subcollections
      if (savedCollections.length === 0) {
        const demoCollections = createDemoCollections()
        setCollections(demoCollections)
        saveCollectionsToStorage(demoCollections)
      } else {
        setCollections(savedCollections)
      }
      
      setIsHydrated(true)
    }
  }, [])
  const [syncHistoryMap, setSyncHistoryMap] = useState<Map<string, SyncHistory[]>>(new Map())
  
  // AI Recommendations state
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(getAllRecommendations())
  const [showAIBanner, setShowAIBanner] = useState<boolean>(true)
  
  // Dependencies state
  const [dependencies, setDependencies] = useState<Dependency[]>(DEMO_DEPENDENCIES)

  // Hydrate AI recommendations from localStorage after component mounts
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRecommendations = localStorage.getItem(AI_RECOMMENDATIONS_KEY)
      const savedBannerState = localStorage.getItem(AI_BANNER_STATE_KEY)
      
      if (savedRecommendations) {
        setAiRecommendations(JSON.parse(savedRecommendations))
      }
      if (savedBannerState) {
        setShowAIBanner(JSON.parse(savedBannerState))
      }
    }
  }, [])


  // Mock all available items in the system - now as state
  const [allItems, setAllItems] = useState<CollectionItem[]>([
    {
      id: 'item-1',
      name: 'Villa Sunset',
      type: 'Properties',
      category: 'Real Estate',
      status: 'Available',
      location: 'Malibu, CA',
      idCode: 'RE-001',
      tags: ['luxury', 'beachfront'],
      value: 5000000,
      guestRating: 4.8,
    },
    {
      id: 'item-2',
      name: 'Tesla Model S',
      type: 'Vehicles',
      category: 'Electric Cars',
      status: 'Available',
      location: 'Los Angeles, CA',
      idCode: 'VH-001',
      tags: ['electric', 'luxury'],
      value: 95000,
      guestRating: 4.6,
    },
    {
      id: 'item-3',
      name: 'Gulfstream G650',
      type: 'Aviation',
      category: 'Private Jets',
      status: 'Maintenance',
      location: 'LAX Airport',
      idCode: 'AV-001',
      tags: ['private', 'luxury'],
      value: 65000000,
      guestRating: 5.0,
    },
    {
      id: 'item-4',
      name: 'Luxury Yacht',
      type: 'Maritime',
      category: 'Yachts',
      status: 'Available',
      location: 'Marina del Rey',
      idCode: 'MA-001',
      tags: ['luxury', 'ocean'],
      value: 12000000,
      guestRating: 4.9,
    },
    {
      id: 'item-5',
      name: 'Penthouse Suite',
      type: 'Properties',
      category: 'Real Estate',
      status: 'Occupied',
      location: 'New York, NY',
      idCode: 'RE-002',
      tags: ['luxury', 'city'],
      value: 8500000,
      guestRating: 4.7,
    },
    {
      id: 'item-6',
      name: 'Lamborghini Aventador',
      type: 'Vehicles',
      category: 'Sports Cars',
      status: 'Available',
      location: 'Miami, FL',
      idCode: 'VH-002',
      tags: ['sports', 'luxury'],
      value: 500000,
      guestRating: 4.9,
    },
    {
      id: 'item-7',
      name: 'Beach House',
      type: 'Properties',
      category: 'Real Estate',
      status: 'Available',
      location: 'Hawaii',
      idCode: 'RE-003',
      tags: ['beach', 'vacation'],
      value: 3500000,
      guestRating: 4.5,
    },
    {
      id: 'item-8',
      name: 'Cessna Citation',
      type: 'Aviation',
      category: 'Private Jets',
      status: 'Available',
      location: 'San Francisco',
      idCode: 'AV-002',
      tags: ['business', 'private'],
      value: 8500000,
      guestRating: 4.4,
    },
  ])

  // ==================== Items Management ====================
  
  const addNewItem = useCallback((itemData: Omit<CollectionItem, "id">) => {
    const now = new Date()
    const newItem: CollectionItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: now,
      lastUpdated: now.toISOString(),
    }
    setAllItems(prev => [...prev, newItem])
    return newItem
  }, [])

  // ==================== Collection CRUD ====================
  
  const addCollection = useCallback((collectionData: Omit<Collection, "id" | "createdAt" | "itemCount">): Collection => {
    const now = new Date()
    const newCollection: Collection = {
      ...collectionData,
      id: `collection-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      itemCount: collectionData.items?.length || 0,
      items: collectionData.items,
      tags: collectionData.tags,
      autoSync: collectionData.autoSync,
      sharedWith: collectionData.sharedWith,
      isPublic: collectionData.isPublic,
      viewCount: 0,
      createdBy: currentUser,
      version: 1,
    } as Collection
    setCollections(prev => {
      const updated = [...prev, newCollection]
      saveCollectionsToStorage(updated) // STABLE RULE: Always save to localStorage
      return updated
    })
    return newCollection
  }, [currentUser])

  const addAICollection = useCallback((name: string, description: string, items: CollectionItem[]) => {
    const now = new Date()
    const newCollection: Collection = {
      id: `ai-collection-${Date.now()}`,
      name,
      description,
      icon: "sparkles",
      type: 'ai-generated',
      filters: [],
      createdAt: now,
      updatedAt: now,
      itemCount: items.length,
      items: items,
      tags: ['AI Generated'],
      autoSync: false,
      sharedWith: [],
      isPublic: false,
      viewCount: 0,
      createdBy: currentUser,
      version: 1,
    }
    setCollections(prev => {
      const updated = [newCollection, ...prev] // Add to beginning for newest first
      saveCollectionsToStorage(updated) // STABLE RULE: Always save to localStorage
      return updated
    })
    return newCollection
  }, [currentUser])

  // Function to update item count for a collection based on its actual items
  const updateCollectionItemCount = (collectionId: string, allItems: any[]) => {
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) return

    // For manual collections, count actual items in the collection
    if (collection.type === 'manual' || collection.type === 'ai-generated') {
      const actualItemCount = collection.items ? collection.items.length : 0
      updateCollection(collectionId, { itemCount: actualItemCount })
      return
    }

    // For smart collections, apply filters to calculate item count
    const filteredItems = allItems.filter(item => {
      return (collection.filters || []).every(filter => {
        const { field, operator, value } = filter

        switch (field) {
          case "category":
            return operator === "equals" && item.category === value
          case "pinned":
            return operator === "equals" && item.pinned === (value === "true")
          case "sharedWith":
            if (operator === "is_not_empty") {
              return item.sharedWith && item.sharedWith.length > 0
            }
            return false
          case "createdOn":
            if (operator === "contains") {
              return item.createdOn.includes(value)
            }
            return false
          case "createdBy":
            if (operator === "equals") {
              return item.createdBy.name === value
            }
            return false
          default:
            return true
        }
      })
    })

    updateCollection(collectionId, { itemCount: filteredItems.length })
  }

  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    setCollections(prev => {
      const updated = prev.map(collection => 
        collection.id === id 
          ? { 
              ...collection, 
              ...updates, 
              updatedAt: new Date(),
              updatedBy: currentUser,
              version: (collection.version || 1) + 1
            } 
          : collection
      )
      saveCollectionsToStorage(updated) // STABLE RULE: Always save to localStorage
      return updated
    })
  }, [currentUser])

  const removeCollection = useCallback((id: string) => {
    setCollections(prev => {
      const updated = prev.filter(collection => collection.id !== id)
      saveCollectionsToStorage(updated) // STABLE RULE: Always save to localStorage
      return updated
    })
  }, [])

  const getCollectionById = useCallback((id: string) => {
    console.log('🔍 getCollectionById called with ID:', id)
    console.log('🔍 Collections array length:', collections.length)
    console.log('🔍 All collection IDs:', collections.map(c => ({ id: c.id, name: c.name })))
    
    const found = collections.find(collection => collection.id === id)
    console.log('🔍 Found collection:', found ? { 
      id: found.id, 
      name: found.name, 
      itemCount: found.itemCount,
      type: found.type 
    } : 'null')
    
    return found
  }, [collections])

  const duplicateCollection = useCallback((id: string): Collection | null => {
    const original = getCollectionById(id)
    if (!original) return null

    const now = new Date()
    const duplicate: Collection = {
      ...original,
      id: `collection-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser,
      updatedBy: undefined,
      viewCount: 0,
      version: 1,
      // Deep clone items
      items: (original.items || []).map(item => ({ ...item })),
      // Keep same rules and settings
      filters: (original.filters || []).map(f => ({ ...f })),
    }

    setCollections(prev => {
      const updated = [duplicate, ...prev]
      saveCollectionsToStorage(updated) // STABLE RULE: Always save to localStorage
      return updated
    })
    return duplicate
  }, [getCollectionById, currentUser])

  const archiveCollection = useCallback((id: string) => {
    updateCollection(id, { 
      tags: [...(getCollectionById(id)?.tags || []), 'Archived']
    })
  }, [updateCollection, getCollectionById])

  // ==================== Items Management ====================

  const addItemToCollection = useCallback((collectionId: string, item: CollectionItem) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id !== collectionId) return collection
      
      // Check for duplicate - if item already in collection, don't add
      const existingIds = new Set((collection.items || []).map(i => i.id))
      if (existingIds.has(item.id)) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Item ${item.id} already exists in collection ${collectionId}`)
        }
        return collection // Return without changes
      }
      
      const newItems = [...(collection.items || []), { 
        ...item, 
        addedAt: new Date(),
        addedBy: currentUser,
        order: (collection.items || []).length
      }]
      
      return {
        ...collection,
        items: newItems,
        itemCount: newItems.length,
        updatedAt: new Date(),
        updatedBy: currentUser
      }
    }))
  }, [currentUser])

  const removeItemFromCollection = useCallback((collectionId: string, itemId: string) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id !== collectionId) return collection
      
      const newItems = (collection.items || []).filter(item => item.id !== itemId)
      
      return {
        ...collection,
        items: newItems,
        itemCount: newItems.length,
        updatedAt: new Date(),
        updatedBy: currentUser
      }
    }))
  }, [currentUser])

  const updateItemInCollection = useCallback((
    collectionId: string, 
    itemId: string, 
    updates: Partial<CollectionItem>
  ) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id !== collectionId) return collection
      
      const newItems = (collection.items || []).map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
      
      return {
        ...collection,
        items: newItems,
        updatedAt: new Date(),
        updatedBy: currentUser
      }
    }))
  }, [currentUser])

  const reorderItems = useCallback((collectionId: string, itemIds: string[]) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id !== collectionId) return collection
      
      // Create a map for quick lookup
      const itemMap = new Map((collection.items || []).map(item => [item.id, item]))
      
      // Reorder based on itemIds array
      const reorderedItems = itemIds
        .map(id => itemMap.get(id))
        .filter((item): item is CollectionItem => item !== undefined)
        .map((item, index) => ({ ...item, order: index }))
      
      return {
        ...collection,
        items: reorderedItems,
        updatedAt: new Date(),
        updatedBy: currentUser
      }
    }))
  }, [currentUser])

  const bulkAddItems = useCallback((collectionId: string, items: CollectionItem[]) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id !== collectionId) return collection
      
      // Create Set of existing IDs for quick duplicate checking
      const existingIds = new Set((collection.items || []).map(i => i.id))
      
      // Filter only new items (not yet in collection)
      const uniqueNewItems = items.filter(item => !existingIds.has(item.id))
      
      if (uniqueNewItems.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`All items already exist in collection ${collectionId}`)
        }
        return collection // No new items to add
      }
      
      const startOrder = (collection.items || []).length
      const processedNewItems = uniqueNewItems.map((item, index) => ({
        ...item,
        addedAt: new Date(),
        addedBy: currentUser,
        order: startOrder + index
      }))
      
      const allItems = [...(collection.items || []), ...processedNewItems]
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Added ${processedNewItems.length} unique items to collection ${collectionId}. Skipped ${items.length - uniqueNewItems.length} duplicates.`)
      }
      
      return {
        ...collection,
        items: allItems,
        itemCount: allItems.length,
        updatedAt: new Date(),
        updatedBy: currentUser
      }
    }))
  }, [currentUser])

  const bulkRemoveItems = useCallback((collectionId: string, itemIds: string[]) => {
    const itemIdSet = new Set(itemIds)
    
    setCollections(prev => prev.map(collection => {
      if (collection.id !== collectionId) return collection
      
      const newItems = (collection.items || []).filter(item => !itemIdSet.has(item.id))
      
      return {
        ...collection,
        items: newItems,
        itemCount: newItems.length,
        updatedAt: new Date(),
        updatedBy: currentUser
      }
    }))
  }, [currentUser])

  const bulkOperateOnItems = useCallback((
    collectionId: string, 
    operation: BulkOperation
  ): BulkOperationResult => {
    const collection = getCollectionById(collectionId)
    if (!collection) {
      return {
        success: false,
        affectedCount: 0,
        errors: [{ itemId: collectionId, error: 'Collection not found' }]
      }
    }

    const itemIdSet = new Set(operation.itemIds)
    let affectedCount = 0
    const errors: Array<{ itemId: string; error: string }> = []

    if (operation.dryRun) {
      // Just count what would be affected
      affectedCount = (collection.items || []).filter(item => itemIdSet.has(item.id)).length
      return { success: true, affectedCount }
    }

    switch (operation.type) {
      case 'remove':
        bulkRemoveItems(collectionId, operation.itemIds)
        affectedCount = operation.itemIds.length
        break
      
      case 'tag':
        setCollections(prev => prev.map(c => {
          if (c.id !== collectionId) return c
          return {
            ...c,
            items: (c.items || []).map(item => {
              if (!itemIdSet.has(item.id)) return item
              affectedCount++
              return {
                ...item,
                tags: [...new Set([...(item.tags || []), ...(operation.params?.tags || [])])]
              }
            }),
            updatedAt: new Date(),
            updatedBy: currentUser
          }
        }))
        break

      case 'pin':
      case 'unpin':
        setCollections(prev => prev.map(c => {
          if (c.id !== collectionId) return c
          return {
            ...c,
            items: (c.items || []).map(item => {
              if (!itemIdSet.has(item.id)) return item
              affectedCount++
              return { ...item, pinned: operation.type === 'pin' }
            }),
            updatedAt: new Date(),
            updatedBy: currentUser
          }
        }))
        break

      default:
        return {
          success: false,
          affectedCount: 0,
          errors: [{ itemId: '', error: `Unknown operation type: ${operation.type}` }]
        }
    }

    return { success: true, affectedCount, errors: errors.length > 0 ? errors : undefined }
  }, [getCollectionById, bulkRemoveItems, currentUser])

  // ==================== Rules & Automation ====================

  const toggleAutoSync = useCallback((collectionId: string) => {
    const collection = getCollectionById(collectionId)
    if (!collection) return

    updateCollection(collectionId, { 
      autoSync: !collection.autoSync,
      lastSyncedAt: collection.autoSync ? undefined : new Date()
    })
  }, [getCollectionById, updateCollection])

  const updateRules = useCallback((collectionId: string, rules: FilterRule[]) => {
    updateCollection(collectionId, { filters: rules })
  }, [updateCollection])

  const validateRules = useCallback((rules: FilterRule[]): ValidationResult => {
    const errors: Array<{ ruleId: string; field: string; message: string }> = []
    const warnings: Array<{ ruleId: string; field: string; message: string }> = []

    rules.forEach(rule => {
      if (!rule.field) {
        errors.push({ ruleId: rule.id, field: 'field', message: 'Field is required' })
      }
      if (!rule.operator) {
        errors.push({ ruleId: rule.id, field: 'operator', message: 'Operator is required' })
      }
      if (rule.value === undefined || rule.value === '') {
        const needsValue = !['is_empty', 'is_not_empty'].includes(rule.operator)
        if (needsValue) {
          warnings.push({ ruleId: rule.id, field: 'value', message: 'Value is recommended for this operator' })
        }
      }
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }, [])

  const syncCollection = useCallback((collectionId: string) => {
    const collection = getCollectionById(collectionId)
    if (!collection || !collection.autoSync) return

    // TODO: Implement actual sync logic with rule engine
    updateCollection(collectionId, { 
      lastSyncedAt: new Date() 
    })
  }, [getCollectionById, updateCollection])

  // ==================== Stats & Analytics ====================

  const getCollectionStats = useCallback((collectionId: string): CollectionStats | null => {
    const collection = getCollectionById(collectionId)
    if (!collection) return null

    const itemsByCategory: Record<string, number> = {}
    const itemsByStatus: Record<string, number> = {}
    let totalValue = 0
    let totalRating = 0
    let ratedCount = 0

    const items = collection.items || []
    items.forEach((item: CollectionItem) => {
      // Count by category
      itemsByCategory[item.category] = (itemsByCategory[item.category] || 0) + 1
      
      // Count by status
      if (item.status) {
        itemsByStatus[item.status] = (itemsByStatus[item.status] || 0) + 1
      }
      
      // Sum values
      if (item.value) totalValue += item.value
      
      // Average rating
      if (item.guestRating) {
        totalRating += item.guestRating
        ratedCount++
      }
    })

    return {
      totalItems: collection.itemCount,
      itemsByCategory,
      itemsByStatus,
      totalValue: totalValue > 0 ? totalValue : undefined,
      averageRating: ratedCount > 0 ? totalRating / ratedCount : undefined,
      lastActivity: collection.updatedAt,
    }
  }, [getCollectionById])

  // ==================== Available Items ====================

  const getAvailableItems = useCallback((collectionId: string): CollectionItem[] => {
    const collection = getCollectionById(collectionId)
    if (!collection) return []
    
    return getAvailableItemsUtil(allItems, collection.items || [])
  }, [getCollectionById, allItems])

  // ==================== Sync & Rules ====================

  const previewSync = useCallback((collectionId: string): SyncPreview | null => {
    const collection = getCollectionById(collectionId)
    if (!collection) return null
    
    return createSyncPreview(collection, allItems)
  }, [getCollectionById, allItems])

  const getSyncHistory = useCallback((collectionId: string): SyncHistory[] => {
    return syncHistoryMap.get(collectionId) || []
  }, [syncHistoryMap])

  const syncCollectionAsync = useCallback(async (collectionId: string): Promise<void> => {
    const collection = getCollectionById(collectionId)
    if (!collection) return
    
    // Створити preview
    const preview = createSyncPreview(collection, allItems)
    
    if (preview.changes.added === 0 && preview.changes.removed === 0) {
      return // Немає змін
    }
    
    // Застосувати зміни
    setCollections(prev => prev.map(c => {
      if (c.id !== collectionId) return c
      
      // Додати нові елементи
      const newItems = [...(c.items || []), ...preview.itemsToAdd.map(item => ({
        ...item,
        addedAt: new Date(),
        addedBy: currentUser,
        order: (c.items || []).length
      }))]
      
      // Видалити елементи що не відповідають правилам (якщо потрібно)
      const itemIdsToRemove = new Set(preview.itemsToRemove.map(item => item.id))
      const finalItems = newItems.filter(item => !itemIdsToRemove.has(item.id))
      
      return {
        ...c,
        items: finalItems,
        itemCount: finalItems.length,
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: currentUser
      }
    }))
    
    // Зберегти історію
    const history = createSyncHistory(
      preview,
      collection.filters || [],
      'manual',
      currentUser.id
    )
    
    setSyncHistoryMap(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(collectionId) || []
      newMap.set(collectionId, [history, ...existing])
      return newMap
    })
  }, [getCollectionById, allItems, currentUser])

  // ==================== Utility ====================

  const searchCollections = useCallback((query: string): Collection[] => {
    const lowerQuery = query.toLowerCase()
    return collections.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description?.toLowerCase().includes(lowerQuery) ||
      (c.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }, [collections])

  const filterCollections = useCallback((filter: (c: Collection) => boolean): Collection[] => {
    return collections.filter(filter)
  }, [collections])

  // ==================== AI Recommendations ====================

  const dismissRecommendation = useCallback((id: string) => {
    setAiRecommendations(prev => prev.filter(rec => rec.id !== id))
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const updated = aiRecommendations.filter(rec => rec.id !== id)
      localStorage.setItem(AI_RECOMMENDATIONS_KEY, JSON.stringify(updated))
    }
  }, [aiRecommendations])

  const acceptRecommendation = useCallback((id: string): string | null => {
    console.log('🔍 acceptRecommendation called with ID:', id);
    console.log('🔍 Available AI Recommendations:', aiRecommendations.map(rec => rec.id));
    const recommendation = aiRecommendations.find(rec => rec.id === id)
    if (!recommendation) {
      console.error('❌ Recommendation not found for ID:', id);
      return null;
    }

    // Get objects for this specific recommendation
    const filteredObjects = MOCK_CATALOG_ITEMS.filter(item => 
      recommendation.objects.includes(item.id)
    )
    console.log('🔍 Context Debug - Recommendation ID:', recommendation.id);
    console.log('🔍 Context Debug - Total catalog items:', MOCK_CATALOG_ITEMS.length);
    console.log('🔍 Context Debug - Filtered objects:', filteredObjects.length);
    console.log('🔍 Context Debug - Filtered IDs:', filteredObjects.map(obj => obj.id));
    
    // Convert to CollectionItem format
    const recommendationObjects: CollectionItem[] = filteredObjects.map(obj => ({
      id: obj.id,
      name: obj.name,
      type: obj.type,
      category: obj.category,
      idCode: obj.idCode,
      status: obj.status,
      location: obj.location,
      value: obj.value,
      currency: obj.currency,
      tags: obj.tags,
      lastUpdated: obj.lastUpdated,
      createdAt: obj.createdAt,
      people: obj.people?.map(person => ({
        id: person.id,
        name: person.name,
        role: person.role as "owner" | "editor" | "viewer"
      })),
      createdOn: obj.createdOn,
      lastUpdate: obj.lastUpdate,
      date: obj.date,
      createdBy: obj.createdBy ? {
        id: obj.createdBy.name.toLowerCase().replace(/\s+/g, '-'),
        name: obj.createdBy.name,
        role: "owner" as const
      } : undefined,
      sharedWith: obj.sharedWith,
      pinned: obj.pinned
    }))

    // Create collection with AI rules and objects
    const now = new Date()
    const collectionId = `ai-collection-${Date.now()}`
    console.log('🔍 Creating collection with ID:', collectionId)
    const newCollection: Collection = {
      id: collectionId,
      name: recommendation.name,
      description: recommendation.description,
      icon: 'Sparkles',
      filters: recommendation.id === 'high-value-assets' ? highValueAssetsRules : [],
      type: 'ai-generated',
      tags: ['ai-generated', 'high-value'],
      items: recommendationObjects,
      autoSync: true,
      isPublic: false,
      sharedWith: [],
      viewCount: 0,
      createdAt: now,
      createdBy: currentUser,
      updatedAt: now,
      itemCount: recommendationObjects.length
    }

    // Add collection
    setCollections(prev => {
      const updated = [...prev, newCollection]
      console.log('🔍 Added collection:', newCollection.id, 'Total collections:', updated.length)
      console.log('🔍 New collection details:', { 
        id: newCollection.id, 
        name: newCollection.name, 
        itemCount: newCollection.itemCount,
        items: newCollection.items?.length || 0
      })
      saveCollectionsToStorage(updated) // STABLE RULE: Always save to localStorage
      return updated
    })

    // Remove recommendation
    dismissRecommendation(id)
    
    // Return the new collection ID
    return collectionId
  }, [aiRecommendations, dismissRecommendation, currentUser])

  const toggleAIBanner = useCallback((show: boolean) => {
    setShowAIBanner(show)
    if (typeof window !== 'undefined') {
      localStorage.setItem(AI_BANNER_STATE_KEY, JSON.stringify(show))
    }
  }, [])

  // ==================== Subcollections Management ====================
  
  const createSubcollection = useCallback((parentId: string, data: Omit<Collection, "id" | "createdAt" | "itemCount" | "parentId" | "depth">): Collection => {
    const parent = collections.find(c => c.id === parentId)
    if (!parent) {
      throw new Error(`Parent collection ${parentId} not found`)
    }

    // Validate depth (only 1 level allowed)
    if (parent.depth && parent.depth >= 1) {
      throw new Error('Maximum subcollection depth reached. Cannot create subcollection.')
    }

    const now = new Date()
    const newSubcollection: Collection = {
      ...data,
      id: `subcollection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      parentId,
      depth: 1,
      isSubcollection: true,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser,
      itemCount: data.items?.length || 0,
    }

    setCollections(prev => {
      const updated = [...prev, newSubcollection]
      
      // Update parent's subcollection count
      const updatedParent = updated.find(c => c.id === parentId)
      if (updatedParent) {
        updatedParent.subcollectionCount = (updatedParent.subcollectionCount || 0) + 1
      }
      
      saveCollectionsToStorage(updated)
      return updated
    })

    return newSubcollection
  }, [collections, currentUser])

  const getSubcollections = useCallback((parentId: string): Collection[] => {
    return collections.filter(c => c.parentId === parentId)
  }, [collections])

  const getParentCollection = useCallback((subcollectionId: string): Collection | null => {
    const subcollection = collections.find(c => c.id === subcollectionId)
    if (!subcollection || !subcollection.parentId) return null
    
    return collections.find(c => c.id === subcollection.parentId) || null
  }, [collections])

  const getCollectionPath = useCallback((collectionId: string): Collection[] => {
    const path: Collection[] = []
    let current: Collection | undefined = collections.find(c => c.id === collectionId)
    
    if (!current) return path
    
    path.unshift(current)
    
    // Traverse up to root
    while (current?.parentId) {
      const parent = collections.find(c => c.id === current?.parentId)
      if (!parent) break
      path.unshift(parent)
      current = parent
    }
    
    return path
  }, [collections])

  const moveItemsToSubcollection = useCallback((
    itemIds: string[],
    fromCollectionId: string,
    toCollectionId: string
  ) => {
    setCollections(prev => {
      const fromCollection = prev.find(c => c.id === fromCollectionId)
      const toCollection = prev.find(c => c.id === toCollectionId)
      
      if (!fromCollection || !toCollection) {
        console.error('Collections not found')
        return prev
      }

      // Get items to move
      const itemsToMove = fromCollection.items?.filter(item => itemIds.includes(item.id)) || []
      
      // Remove from source
      const updatedFrom = {
        ...fromCollection,
        items: fromCollection.items?.filter(item => !itemIds.includes(item.id)) || [],
        itemCount: (fromCollection.items?.length || 0) - itemsToMove.length,
      }
      
      // Add to destination
      const updatedTo = {
        ...toCollection,
        items: [...(toCollection.items || []), ...itemsToMove],
        itemCount: (toCollection.items?.length || 0) + itemsToMove.length,
      }
      
      // Update collections array
      const updated = prev.map(c => {
        if (c.id === fromCollectionId) return updatedFrom
        if (c.id === toCollectionId) return updatedTo
        return c
      })
      
      saveCollectionsToStorage(updated)
      return updated
    })
  }, [])

  // ==================== Dependencies Management ====================
  
  const getDependencies = useCallback((collectionId: string): Dependency[] => {
    return dependencies.filter(dep => dep.sourceId === collectionId)
  }, [dependencies])

  const getDependencyGroups = useCallback((collectionId: string): DependencyGroup[] => {
    const collectionDeps = getDependencies(collectionId)
    
    // Групуємо залежності за типом
    const groups = new Map<string, DependencyGroup>()
    
    collectionDeps.forEach(dep => {
      if (!groups.has(dep.type)) {
        groups.set(dep.type, {
          id: dep.type,
          name: dep.type,
          type: dep.type,
          dependencies: [],
          sourceCollectionId: collectionId,
          targetCollectionIds: [],
          itemCount: 0
        })
      }
      
      const group = groups.get(dep.type)!
      group.dependencies.push(dep)
      group.itemCount++
      
      if (dep.targetType === 'collection' && !group.targetCollectionIds.includes(dep.targetId)) {
        group.targetCollectionIds.push(dep.targetId)
      }
    })
    
    return Array.from(groups.values())
  }, [getDependencies])

  const addDependency = useCallback((dependencyData: Omit<Dependency, "id" | "createdAt">): Dependency => {
    const now = new Date()
    const newDependency: Dependency = {
      ...dependencyData,
      id: `dep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    }

    setDependencies(prev => {
      const updated = [...prev, newDependency]
      saveDependenciesToStorage(updated)
      return updated
    })

    return newDependency
  }, [])

  const removeDependency = useCallback((dependencyId: string) => {
    setDependencies(prev => {
      const updated = prev.filter(dep => dep.id !== dependencyId)
      saveDependenciesToStorage(updated)
      return updated
    })
  }, [])

  const getDependenciesForCollection = useCallback((collectionId: string): Dependency[] => {
    return dependencies.filter(dep => 
      dep.sourceId === collectionId || dep.targetId === collectionId
    )
  }, [dependencies])

  const saveDependenciesToStorage = (deps: Dependency[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('way2bi_dependencies', JSON.stringify(deps))
    }
  }

  // Hydrate dependencies from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('way2bi_dependencies')
      if (saved) {
        try {
          setDependencies(JSON.parse(saved))
        } catch (error) {
          console.error('Error parsing dependencies from localStorage:', error)
        }
      }
    }
  }, [])

  return (
    <CollectionsContext.Provider value={{
      // Core State
      collections,
      allItems,
      
      // AI Recommendations
      aiRecommendations,
      showAIBanner,
      dismissRecommendation,
      acceptRecommendation,
      toggleAIBanner,
      
      // Collection CRUD
      addCollection,
      addAICollection,
      updateCollection,
      removeCollection,
      getCollectionById,
      duplicateCollection,
      archiveCollection,
      
      // Subcollections Management
      createSubcollection,
      getSubcollections,
      getParentCollection,
      getCollectionPath,
      moveItemsToSubcollection,
      
      // Dependencies Management
      getDependencies,
      getDependencyGroups,
      addDependency,
      removeDependency,
      getDependenciesForCollection,
      
      // Items Management
      addNewItem,
      addItemToCollection,
      removeItemFromCollection,
      updateItemInCollection,
      reorderItems,
      bulkAddItems,
      bulkRemoveItems,
      bulkOperateOnItems,
      getAvailableItems,
      
      // Rules & Automation
      toggleAutoSync,
      updateRules,
      validateRules,
      syncCollection: syncCollectionAsync,
      previewSync,
      getSyncHistory,
      
      // Stats & Analytics
      updateCollectionItemCount,
      getCollectionStats,
      
      // Utility
      searchCollections,
      filterCollections,
    }}>
      {children}
    </CollectionsContext.Provider>
  )
}

export function useCollections() {
  const context = useContext(CollectionsContext)
  if (context === undefined) {
    throw new Error("useCollections must be used within a CollectionsProvider")
  }
  return context
}
