/**
 * Auto-Sync Engine
 * Автоматична синхронізація колекцій на основі правил
 */

import type { Collection, CollectionItem, SyncHistory, SyncPreview } from "@/types/collection"
import type { FilterRule } from "@/types/rule"
import { applyRulesToItems } from "./rule-engine"

/**
 * Знаходить елементи що відповідають правилам колекції
 */
export function findMatchingItems(
  allItems: CollectionItem[],
  rules: FilterRule[]
): CollectionItem[] {
  if (rules.length === 0) return []
  
  return applyRulesToItems(allItems, rules)
}

/**
 * Створює preview синхронізації без застосування змін
 */
export function createSyncPreview(
  collection: Collection,
  allAvailableItems: CollectionItem[]
): SyncPreview {
  const currentItems = collection.items || []
  const currentItemIds = new Set(currentItems.map(item => item.id))
  
  // Знайти всі елементи що відповідають правилам
  const matchingItems = findMatchingItems(allAvailableItems, collection.filters || [])
  const matchingItemIds = new Set(matchingItems.map(item => item.id))
  
  // Елементи для додавання (відповідають правилам але не в колекції)
  const itemsToAdd = matchingItems.filter(item => !currentItemIds.has(item.id))
  
  // Елементи для видалення (в колекції але не відповідають правилам)
  const itemsToRemove = currentItems.filter(item => !matchingItemIds.has(item.id))
  
  // Незмінені елементи (в колекції і відповідають правилам)
  const unchanged = currentItems.filter(item => matchingItemIds.has(item.id))
  
  return {
    itemsToAdd,
    itemsToRemove,
    currentCount: currentItems.length,
    newCount: currentItems.length + itemsToAdd.length - itemsToRemove.length,
    changes: {
      added: itemsToAdd.length,
      removed: itemsToRemove.length,
      unchanged: unchanged.length
    }
  }
}

/**
 * Перевіряє чи потрібна синхронізація
 */
export function needsSync(preview: SyncPreview): boolean {
  return preview.changes.added > 0 || preview.changes.removed > 0
}

/**
 * Генерує історію синхронізації
 */
export function createSyncHistory(
  preview: SyncPreview,
  rules: FilterRule[],
  triggeredBy: 'auto' | 'manual' | 'rule-change',
  userId?: string
): SyncHistory {
  return {
    id: `sync-${Date.now()}`,
    timestamp: new Date(),
    itemsAdded: preview.changes.added,
    itemsRemoved: preview.changes.removed,
    rulesApplied: rules,
    triggeredBy,
    userId
  }
}

/**
 * Обчислює статистику синхронізації
 */
export function getSyncStats(history: SyncHistory[]): {
  totalSyncs: number
  totalItemsAdded: number
  totalItemsRemoved: number
  lastSync?: Date
  mostActiveTrigger: 'auto' | 'manual' | 'rule-change'
} {
  if (history.length === 0) {
    return {
      totalSyncs: 0,
      totalItemsAdded: 0,
      totalItemsRemoved: 0,
      mostActiveTrigger: 'manual'
    }
  }
  
  const totalItemsAdded = history.reduce((sum, h) => sum + h.itemsAdded, 0)
  const totalItemsRemoved = history.reduce((sum, h) => sum + h.itemsRemoved, 0)
  const lastSync = history[0]?.timestamp
  
  // Підрахувати найчастіший тригер
  const triggerCounts = history.reduce((acc, h) => {
    acc[h.triggeredBy] = (acc[h.triggeredBy] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostActiveTrigger = Object.entries(triggerCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] as 'auto' | 'manual' | 'rule-change' || 'manual'
  
  return {
    totalSyncs: history.length,
    totalItemsAdded,
    totalItemsRemoved,
    lastSync,
    mostActiveTrigger
  }
}

/**
 * Валідує чи можна виконати синхронізацію
 */
export function validateSync(collection: Collection): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check if rules exist
  if (!collection.filters || collection.filters.length === 0) {
    errors.push('No rules defined for auto-sync')
  }
  
  // Check if auto-sync is enabled
  if (!collection.autoSync) {
    warnings.push('Auto-sync is disabled for this collection')
  }
  
  // Check if items exist
  if (!collection.items || collection.items.length === 0) {
    warnings.push('Collection is empty')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Фільтрує доступні елементи (не в колекції)
 */
export function getAvailableItems(
  allItems: CollectionItem[],
  collectionItems: CollectionItem[]
): CollectionItem[] {
  const collectionItemIds = new Set(collectionItems.map(item => item.id))
  return allItems.filter(item => !collectionItemIds.has(item.id))
}

/**
 * Сортує елементи за релевантністю до правил
 */
export function sortByRelevance(
  items: CollectionItem[],
  rules: FilterRule[]
): CollectionItem[] {
  // Простий алгоритм: скільки правил відповідає кожному елементу
  const itemScores = items.map(item => {
    let score = 0
    rules.forEach(rule => {
      // Перевірити відповідність правилу
      const itemValue = item[rule.field as keyof CollectionItem]
      if (itemValue && String(itemValue).toLowerCase().includes(String(rule.value).toLowerCase())) {
        score++
      }
    })
    return { item, score }
  })
  
  return itemScores
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

