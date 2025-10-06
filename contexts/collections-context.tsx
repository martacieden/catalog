"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface CollectionItem {
  id: string
  name: string
  type: string
  location: string
  status: string
  idCode: string
  people: number
  date: string
  value?: number
  guestRating?: number
  lastUpdated?: string
  flagged?: boolean
  hasFinancialDocs?: boolean
  documents?: Array<{ type: string; name: string }>
}

export interface Collection {
  id: string
  name: string
  icon: string
  customImage?: string
  filters: FilterRule[]
  createdAt: Date
  itemCount: number
  description?: string
  type: 'ai-generated' | 'manual'
  items?: CollectionItem[] // For AI-generated collections
}

export interface FilterRule {
  id: string
  field: string
  operator: string
  value: string
}

interface CollectionsContextType {
  collections: Collection[]
  addCollection: (collection: Omit<Collection, "id" | "createdAt" | "itemCount">) => void
  addAICollection: (name: string, description: string, items: CollectionItem[]) => void
  updateCollection: (id: string, updates: Partial<Collection>) => void
  removeCollection: (id: string) => void
  getCollectionById: (id: string) => Collection | undefined
  updateCollectionItemCount: (collectionId: string, allItems: any[]) => void
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined)

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([])

  const addCollection = (collectionData: Omit<Collection, "id" | "createdAt" | "itemCount">) => {
    const newCollection: Collection = {
      ...collectionData,
      id: `collection-${Date.now()}`,
      createdAt: new Date(),
      itemCount: 0, // Will be calculated based on filters
    }
    setCollections(prev => [...prev, newCollection])
  }

  const addAICollection = (name: string, description: string, items: CollectionItem[]) => {
    const newCollection: Collection = {
      id: `ai-collection-${Date.now()}`,
      name,
      description,
      icon: "sparkles",
      type: 'ai-generated',
      filters: [],
      createdAt: new Date(),
      itemCount: items.length,
      items: items
    }
    setCollections(prev => [newCollection, ...prev]) // Add to beginning for newest first
  }

  // Function to update item count for a collection based on its filters
  const updateCollectionItemCount = (collectionId: string, allItems: any[]) => {
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) return

    // Apply collection filters to calculate item count
    const filteredItems = allItems.filter(item => {
      return collection.filters.every(filter => {
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

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === id ? { ...collection, ...updates } : collection
      )
    )
  }

  const removeCollection = (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id))
  }

  const getCollectionById = (id: string) => {
    return collections.find(collection => collection.id === id)
  }

  return (
    <CollectionsContext.Provider value={{
      collections,
      addCollection,
      addAICollection,
      updateCollection,
      removeCollection,
      getCollectionById,
      updateCollectionItemCount,
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
