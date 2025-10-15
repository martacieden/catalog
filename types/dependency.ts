/**
 * Dependency Types
 * Types for managing relationships between collections and items
 */

import { User } from './user'

export interface Dependency {
  id: string
  type: string              // Користувач може називати як завгодно
  sourceId: string          // ID джерела залежності
  sourceType: 'collection' | 'item'
  targetId: string          // ID цільового елемента
  targetType: 'collection' | 'item'
  relationship: string      // Користувач може називати як завгодно
  description?: string      // Опис залежності
  createdAt: Date
  createdBy: User
}

export interface DependencyGroup {
  id: string
  name: string
  type: string
  dependencies: Dependency[]
  sourceCollectionId: string
  targetCollectionIds: string[]
  itemCount: number
}

export interface DependencyStats {
  totalDependencies: number
  dependenciesByType: Record<string, number>
  collectionsWithDependencies: number
  mostConnectedCollection?: string
}

// Приклади користувацьких типів:
// "Legal Documents", "Insurance Policies", "Maintenance Records"
// "Related Properties", "Financial Reports", "Contracts"
// "Dependencies", "References", "Links"

