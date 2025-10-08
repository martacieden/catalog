/**
 * Collection Utility Functions
 * Helper functions for working with collections and items
 */

import type { 
  Collection, 
  CollectionItem, 
  CollectionStats, 
  CollectionFilter,
  CollectionSortOption 
} from '@/types/collection'
import type { FilterRule } from '@/types/rule'

// ==================== Filtering & Search ====================

/**
 * Filter items based on collection filter criteria
 */
export function filterItems(
  items: CollectionItem[],
  filter: CollectionFilter
): CollectionItem[] {
  return items.filter(item => {
    // Category filter
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(item.category)) return false
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const itemTags = item.tags || []
      if (!filter.tags.some(tag => itemTags.includes(tag))) return false
    }

    // Status filter
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(item.status || '')) return false
    }

    // Date range filter
    if (filter.dateRange) {
      const itemDate = item.createdAt ? new Date(item.createdAt) : null
      if (itemDate) {
        if (filter.dateRange.from && itemDate < filter.dateRange.from) return false
        if (filter.dateRange.to && itemDate > filter.dateRange.to) return false
      }
    }

    // Value range filter
    if (filter.value && item.value !== undefined) {
      if (filter.value.min !== undefined && item.value < filter.value.min) return false
      if (filter.value.max !== undefined && item.value > filter.value.max) return false
    }

    // Rating range filter
    if (filter.rating) {
      const rating = item.guestRating || item.internalRating
      if (rating !== undefined) {
        if (filter.rating.min !== undefined && rating < filter.rating.min) return false
        if (filter.rating.max !== undefined && rating > filter.rating.max) return false
      }
    }

    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      const matchesSearch = 
        item.name.toLowerCase().includes(searchLower) ||
        (item.idCode && item.idCode.toLowerCase().includes(searchLower)) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        (item.location && item.location.toLowerCase().includes(searchLower)) ||
        (item.notes && item.notes.toLowerCase().includes(searchLower))
      
      if (!matchesSearch) return false
    }

    return true
  })
}

/**
 * Sort items based on sort option
 */
export function sortItems(
  items: CollectionItem[],
  sortOption: CollectionSortOption
): CollectionItem[] {
  const sorted = [...items]
  const { field, direction } = sortOption
  const multiplier = direction === 'asc' ? 1 : -1

  sorted.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (field) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'createdAt':
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0
        break
      case 'updatedAt':
        aValue = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0
        bValue = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0
        break
      case 'value':
        aValue = a.value || 0
        bValue = b.value || 0
        break
      case 'rating':
        aValue = a.guestRating || a.internalRating || 0
        bValue = b.guestRating || b.internalRating || 0
        break
      case 'status':
        aValue = (a.status || '').toLowerCase()
        bValue = (b.status || '').toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) return -1 * multiplier
    if (aValue > bValue) return 1 * multiplier
    return 0
  })

  return sorted
}

/**
 * Search items by query
 */
export function searchItems(
  items: CollectionItem[],
  query: string
): CollectionItem[] {
  if (!query.trim()) return items

  const lowerQuery = query.toLowerCase()
  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    (item.idCode && item.idCode.toLowerCase().includes(lowerQuery)) ||
    item.type.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    (item.location && item.location.toLowerCase().includes(lowerQuery)) ||
    (item.notes && item.notes.toLowerCase().includes(lowerQuery)) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  )
}

// ==================== Statistics ====================

/**
 * Calculate collection statistics
 */
export function calculateCollectionStats(collection: Collection): CollectionStats {
  const items = collection.items || []

  const itemsByCategory: Record<string, number> = {}
  const itemsByStatus: Record<string, number> = {}
  let totalValue = 0
  let totalRating = 0
  let ratedCount = 0

  items.forEach(item => {
    // Count by category
    itemsByCategory[item.category] = (itemsByCategory[item.category] || 0) + 1
    
    // Count by status
    if (item.status) {
      itemsByStatus[item.status] = (itemsByStatus[item.status] || 0) + 1
    }
    
    // Sum values
    if (item.value) totalValue += item.value
    
    // Average rating
    const rating = item.guestRating || item.internalRating
    if (rating) {
      totalRating += rating
      ratedCount++
    }
  })

  return {
    totalItems: items.length,
    itemsByCategory,
    itemsByStatus,
    totalValue: totalValue > 0 ? totalValue : undefined,
    averageRating: ratedCount > 0 ? totalRating / ratedCount : undefined,
    lastActivity: collection.updatedAt,
  }
}

/**
 * Get unique values for a field across all items
 */
export function getUniqueFieldValues(
  items: CollectionItem[],
  field: keyof CollectionItem
): string[] {
  const values = new Set<string>()
  
  items.forEach(item => {
    const value = item[field]
    if (typeof value === 'string') {
      values.add(value)
    } else if (Array.isArray(value)) {
      value.forEach(v => {
        if (typeof v === 'string') values.add(v)
      })
    }
  })

  return Array.from(values).sort()
}

// ==================== Validation ====================

/**
 * Validate collection data
 */
export function validateCollection(collection: Partial<Collection>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!collection.name || collection.name.trim().length === 0) {
    errors.push('Collection name is required')
  }

  if (collection.name && collection.name.length > 100) {
    errors.push('Collection name must be less than 100 characters')
  }

  if (collection.description && collection.description.length > 500) {
    errors.push('Collection description must be less than 500 characters')
  }

  if (collection.tags && collection.tags.length > 20) {
    errors.push('Maximum 20 tags allowed')
  }

  if (collection.items && collection.items.length > 10000) {
    errors.push('Maximum 10000 items allowed per collection')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate collection item
 */
export function validateItem(item: Partial<CollectionItem>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!item.name || item.name.trim().length === 0) {
    errors.push('Item name is required')
  }

  if (!item.type) {
    errors.push('Item type is required')
  }

  if (!item.category) {
    errors.push('Item category is required')
  }

  if (!item.idCode) {
    errors.push('Item ID code is required')
  }

  if (item.value !== undefined && item.value < 0) {
    errors.push('Item value cannot be negative')
  }

  if (item.guestRating !== undefined && (item.guestRating < 0 || item.guestRating > 5)) {
    errors.push('Rating must be between 0 and 5')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// ==================== Transformations ====================

/**
 * Group items by field
 */
export function groupItemsBy(
  items: CollectionItem[],
  field: keyof CollectionItem
): Record<string, CollectionItem[]> {
  const groups: Record<string, CollectionItem[]> = {}

  items.forEach(item => {
    const value = item[field]
    const key = typeof value === 'string' ? value : 'Other'
    
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
  })

  return groups
}

/**
 * Export collection to CSV
 */
export function collectionToCSV(collection: Collection): string {
  const items = collection.items || []
  if (items.length === 0) return ''

  // Headers
  const headers = [
    'ID',
    'Name',
    'Type',
    'Category',
    'Status',
    'Location',
    'ID Code',
    'Tags',
    'Value',
    'Rating',
    'Last Updated',
  ]

  // Rows
  const rows = items.map(item => [
    item.id,
    item.name,
    item.type,
    item.category,
    item.status,
    item.location || '',
    item.idCode,
    (item.tags || []).join('; '),
    item.value?.toString() || '',
    (item.guestRating || item.internalRating)?.toString() || '',
    item.lastUpdated || '',
  ])

  // Combine
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

/**
 * Export collection to JSON
 */
export function collectionToJSON(collection: Collection): string {
  return JSON.stringify(collection, null, 2)
}

// ==================== Comparison ====================

/**
 * Compare two collections
 */
export function compareCollections(
  oldCollection: Collection,
  newCollection: Collection
): {
  hasChanges: boolean
  changes: string[]
} {
  const changes: string[] = []

  if (oldCollection.name !== newCollection.name) {
    changes.push(`Name changed from "${oldCollection.name}" to "${newCollection.name}"`)
  }

  if (oldCollection.description !== newCollection.description) {
    changes.push('Description changed')
  }

  if ((oldCollection.items?.length || 0) !== (newCollection.items?.length || 0)) {
    const diff = (newCollection.items?.length || 0) - (oldCollection.items?.length || 0)
    if (diff > 0) {
      changes.push(`${diff} item(s) added`)
    } else {
      changes.push(`${Math.abs(diff)} item(s) removed`)
    }
  }

  if ((oldCollection.filters?.length || 0) !== (newCollection.filters?.length || 0)) {
    changes.push('Rules changed')
  }

  if (oldCollection.autoSync !== newCollection.autoSync) {
    changes.push(`Auto-sync ${newCollection.autoSync ? 'enabled' : 'disabled'}`)
  }

  return {
    hasChanges: changes.length > 0,
    changes,
  }
}

/**
 * Find duplicate items in collection
 */
export function findDuplicateItems(
  items: CollectionItem[],
  compareBy: keyof CollectionItem = 'name'
): CollectionItem[][] {
  const groups = new Map<any, CollectionItem[]>()

  items.forEach(item => {
    const key = item[compareBy]
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(item)
  })

  // Return only groups with duplicates
  return Array.from(groups.values()).filter(group => group.length > 1)
}

// ==================== Formatting ====================

/**
 * Format collection name for display
 */
export function formatCollectionName(collection: Collection): string {
  return collection.name.trim()
}

/**
 * Format item count
 */
export function formatItemCount(count: number): string {
  if (count === 0) return 'No items'
  if (count === 1) return '1 item'
  return `${count.toLocaleString()} items`
}

/**
 * Format value as currency
 */
export function formatValue(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format rating
 */
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} ⭐`
}

/**
 * Get relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

// ==================== Color Utilities ====================

/**
 * Get color for category
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Legal entities': 'bg-blue-100 text-blue-700 border-blue-200',
    'Properties': 'bg-green-100 text-green-700 border-green-200',
    'Vehicles': 'bg-orange-100 text-orange-700 border-orange-200',
    'Aviation': 'bg-sky-100 text-sky-700 border-sky-200',
    'Maritime': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Organizations': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Events': 'bg-pink-100 text-pink-700 border-pink-200',
    'Pets': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Obligations': 'bg-red-100 text-red-700 border-red-200',
  }

  return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200'
}

/**
 * Get color for status
 */
export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase()
  
  if (statusLower.includes('available') || statusLower.includes('active')) {
    return 'bg-green-100 text-green-800'
  }
  if (statusLower.includes('maintenance') || statusLower.includes('attention')) {
    return 'bg-yellow-100 text-yellow-800'
  }
  if (statusLower.includes('repair') || statusLower.includes('expired')) {
    return 'bg-red-100 text-red-800'
  }
  if (statusLower.includes('inactive') || statusLower.includes('archived')) {
    return 'bg-gray-100 text-gray-800'
  }
  
  return 'bg-blue-100 text-blue-800'
}


