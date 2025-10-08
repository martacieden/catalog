/**
 * Collection and Item Types
 * Core data structures for Smart Collections
 */

import { User, AccessControl } from './user'
import { Document } from './document'
import { FilterRule, JSONLogicRule } from './rule'

export interface Collection {
  // Identity
  id: string
  name: string
  description?: string
  
  // Visual
  icon: string
  customImage?: string
  color?: string
  
  // Type & Classification
  type: CollectionType
  category?: string
  tags?: string[]
  
  // Core Data
  items?: CollectionItem[]
  filters?: FilterRule[]
  
  // Automation
  autoSync: boolean
  syncRules?: JSONLogicRule
  lastSyncedAt?: Date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: User
  updatedBy?: User
  
  // Sharing
  sharedWith?: AccessControl[]
  isPublic?: boolean
  shareLink?: string
  
  // Stats
  itemCount: number
  viewCount: number
  favoriteCount?: number
  
  // AI Context
  aiContext?: string
  aiPrompt?: string
  aiSuggestions?: string[]
  
  // Version Control
  version?: number
  changeLog?: CollectionChange[]
}

export type CollectionType = 'ai-generated' | 'manual' | 'smart' | 'shared'

export interface CollectionItem {
  // Identity
  id: string
  name: string
  type: string
  category: string
  
  // Visual
  icon?: string
  image?: string
  thumbnail?: string
  color?: string
  
  // Core Data
  idCode?: string
  status?: string
  location?: string
  
  // Classification
  tags?: string[]
  labels?: string[]
  
  // Relationships
  people?: User[]
  documents?: Document[]
  relatedItems?: string[]
  
  // Financial
  value?: number
  currency?: string
  hasFinancialDocs?: boolean
  
  // Quality & Rating
  guestRating?: number
  internalRating?: number
  
  // Metadata
  lastUpdated?: string
  createdAt?: Date
  createdBy?: User
  
  // Flags & Status
  flagged?: boolean
  pinned?: boolean
  archived?: boolean
  
  // Collection-specific
  order?: number
  addedAt?: Date
  addedBy?: User
  notes?: string
  customFields?: Record<string, any>
}

export interface CollectionChange {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: CollectionChangeAction
  details: string
  previousValue?: any
  newValue?: any
}

export type CollectionChangeAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'renamed'
  | 'item_added'
  | 'item_removed'
  | 'items_reordered'
  | 'rule_added'
  | 'rule_removed'
  | 'rule_updated'
  | 'shared'
  | 'unshared'
  | 'duplicated'

export interface CollectionSnapshot {
  id: string
  collectionId: string
  timestamp: Date
  data: Collection
  version: number
  createdBy: User
}

export interface CollectionStats {
  totalItems: number
  itemsByCategory: Record<string, number>
  itemsByStatus: Record<string, number>
  totalValue?: number
  averageRating?: number
  lastActivity?: Date
  activeUsers?: number
}

export interface CollectionFilter {
  categories?: string[]
  tags?: string[]
  status?: string[]
  dateRange?: {
    from?: Date
    to?: Date
  }
  value?: {
    min?: number
    max?: number
  }
  rating?: {
    min?: number
    max?: number
  }
  search?: string
}

export interface CollectionSortOption {
  field: CollectionSortField
  direction: 'asc' | 'desc'
}

export type CollectionSortField =
  | 'name'
  | 'createdAt'
  | 'updatedAt'
  | 'itemCount'
  | 'viewCount'
  | 'value'
  | 'rating'
  | 'status'

export interface CollectionViewOptions {
  layout: 'grid' | 'list' | 'table'
  groupBy?: string
  sortBy: CollectionSortOption
  filters: CollectionFilter
  showArchived: boolean
  showPinned: boolean
}

export interface BulkOperation {
  type: BulkOperationType
  itemIds: string[]
  params?: Record<string, any>
  dryRun?: boolean
}

export type BulkOperationType =
  | 'add'
  | 'remove'
  | 'update'
  | 'tag'
  | 'untag'
  | 'archive'
  | 'unarchive'
  | 'pin'
  | 'unpin'
  | 'flag'
  | 'unflag'

export interface BulkOperationResult {
  success: boolean
  affectedCount: number
  errors?: Array<{
    itemId: string
    error: string
  }>
  warnings?: string[]
}

export interface SyncHistory {
  id: string
  timestamp: Date
  itemsAdded: number
  itemsRemoved: number
  rulesApplied: FilterRule[]
  triggeredBy: 'auto' | 'manual' | 'rule-change'
  userId?: string
}

export interface SyncPreview {
  itemsToAdd: CollectionItem[]
  itemsToRemove: CollectionItem[]
  currentCount: number
  newCount: number
  changes: {
    added: number
    removed: number
    unchanged: number
  }
}

export interface AIInsight {
  id: string
  type: 'suggestion' | 'warning' | 'info' | 'success'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  createdAt: Date
}

