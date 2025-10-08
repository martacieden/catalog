/**
 * AI Insights Generator
 * Генерація інсайтів та рекомендацій для колекцій
 */

import type { Collection, CollectionItem, AIInsight, CollectionStats } from "@/types/collection"
import type { FilterRule } from "@/types/rule"

/**
 * Генерує insights для колекції
 */
export function generateInsights(
  collection: Collection,
  stats?: CollectionStats | null
): AIInsight[] {
  const insights: AIInsight[] = []
  
  // Інсайти про кількість елементів
  if (collection.itemCount === 0) {
    insights.push({
      id: 'empty-collection',
      type: 'info',
      title: 'Колекція порожня',
      description: 'Додайте елементи вручну або налаштуйте правила для автоматичного наповнення.',
      actionLabel: 'Додати елементи',
      createdAt: new Date()
    })
  } else if (collection.itemCount < 5) {
    insights.push({
      id: 'few-items',
      type: 'info',
      title: 'Мало елементів',
      description: `У колекції лише ${collection.itemCount} елементів. Можливо варто додати більше?`,
      actionLabel: 'Переглянути доступні елементи',
      createdAt: new Date()
    })
  }
  
  // Інсайти про auto-sync
  if (!collection.autoSync && collection.filters && collection.filters.length > 0) {
    insights.push({
      id: 'enable-autosync',
      type: 'suggestion',
      title: 'Увімкніть автоматичну синхронізацію',
      description: 'У вас налаштовані правила, але автосинхронізація вимкнена. Увімкніть її для автоматичного оновлення колекції.',
      actionLabel: 'Увімкнути',
      createdAt: new Date()
    })
  }
  
  // Інсайти про правила
  if (collection.autoSync && (!collection.filters || collection.filters.length === 0)) {
    insights.push({
      id: 'add-rules',
      type: 'warning',
      title: 'Не налаштовані правила',
      description: 'Автосинхронізація увімкнена, але правила не налаштовані. Додайте правила для автоматичного наповнення.',
      actionLabel: 'Додати правила',
      createdAt: new Date()
    })
  }
  
  // Інсайти про останнє оновлення
  if (collection.updatedAt) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(collection.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (daysSinceUpdate > 30) {
      insights.push({
        id: 'old-collection',
        type: 'info',
        title: 'Давно не оновлювалась',
        description: `Колекція не оновлювалась ${daysSinceUpdate} днів. Можливо варто перевірити актуальність даних?`,
        actionLabel: 'Оновити',
        createdAt: new Date()
      })
    }
  }
  
  // Інсайти зі статистики
  if (stats) {
    // Перевірка розподілу по категоріях
    const categoryCount = Object.keys(stats.itemsByCategory || {}).length
    if (categoryCount > 5) {
      insights.push({
        id: 'many-categories',
        type: 'suggestion',
        title: 'Багато категорій',
        description: `У колекції ${categoryCount} різних категорій. Можливо варто розбити на кілька колекцій?`,
        createdAt: new Date()
      })
    }
    
    // Перевірка вартості
    if (stats.totalValue && stats.totalValue > 0) {
      insights.push({
        id: 'total-value',
        type: 'success',
        title: 'Загальна вартість',
        description: `Загальна вартість елементів у колекції: ${formatCurrency(stats.totalValue)}`,
        createdAt: new Date()
      })
    }
  }
  
  // Інсайти про тип колекції
  if (collection.type === 'ai-generated') {
    insights.push({
      id: 'ai-generated',
      type: 'info',
      title: 'AI-генерована колекція',
      description: 'Ця колекція була створена за допомогою AI. Ви можете відредагувати її або додати нові елементи.',
      createdAt: new Date()
    })
  }
  
  return insights
}

/**
 * Генерує рекомендації для правил
 */
export function generateRuleSuggestions(
  collection: Collection,
  allItems: CollectionItem[]
): FilterRule[] {
  const suggestions: FilterRule[] = []
  
  if (collection.items && collection.items.length > 0) {
    // Аналіз поточних елементів для пропозиції правил
    const categories = [...new Set(collection.items.map(item => item.category))]
    const tags = collection.items.flatMap(item => item.tags || [])
    const uniqueTags = [...new Set(tags)]
    
    // Правило по категорії якщо всі елементи однієї категорії
    if (categories.length === 1) {
      suggestions.push({
        id: `rule-category-${Date.now()}`,
        field: 'category',
        operator: 'equals',
        value: categories[0]
      })
    }
    
    // Правило по тегам якщо є спільні теги
    if (uniqueTags.length > 0 && uniqueTags.length <= 3) {
      uniqueTags.forEach(tag => {
        const itemsWithTag = collection.items!.filter(item => 
          item.tags?.includes(tag)
        ).length
        
        // Якщо більше 50% елементів мають цей тег
        if (itemsWithTag > collection.items!.length / 2) {
          suggestions.push({
            id: `rule-tag-${tag}-${Date.now()}`,
            field: 'tags',
            operator: 'contains',
            value: tag
          })
        }
      })
    }
    
    // Правило по статусу
    const statuses = [...new Set(collection.items.map(item => item.status).filter(Boolean))]
    if (statuses.length === 1) {
      suggestions.push({
        id: `rule-status-${Date.now()}`,
        field: 'status',
        operator: 'equals',
        value: statuses[0]!
      })
    }
  }
  
  return suggestions.slice(0, 3) // Максимум 3 пропозиції
}

/**
 * Генерує швидкі дії для колекції
 */
export function generateQuickActions(collection: Collection): Array<{
  id: string
  label: string
  description: string
  icon: string
  action: string
}> {
  const actions = []
  
  // Завжди доступні дії
  actions.push({
    id: 'add-items',
    label: 'Додати елементи',
    description: 'Додати нові елементи до колекції',
    icon: 'Plus',
    action: 'add-items'
  })
  
  if (collection.autoSync && collection.filters && collection.filters.length > 0) {
    actions.push({
      id: 'sync-now',
      label: 'Синхронізувати зараз',
      description: 'Застосувати правила і оновити колекцію',
      icon: 'RefreshCw',
      action: 'sync-now'
    })
  }
  
  if (collection.items && collection.items.length > 0) {
    actions.push({
      id: 'analyze',
      label: 'Аналізувати колекцію',
      description: 'Отримати детальну статистику та інсайти',
      icon: 'BarChart',
      action: 'analyze'
    })
  }
  
  if (!collection.filters || collection.filters.length === 0) {
    actions.push({
      id: 'suggest-rules',
      label: 'Запропонувати правила',
      description: 'AI запропонує правила на основі поточних елементів',
      icon: 'Sparkles',
      action: 'suggest-rules'
    })
  }
  
  actions.push({
    id: 'export',
    label: 'Експортувати',
    description: 'Експортувати колекцію в різних форматах',
    icon: 'Download',
    action: 'export'
  })
  
  return actions
}

/**
 * Генерує AI відповідь для чату в контексті колекції
 */
export function generateContextualResponse(
  userMessage: string,
  collection: Collection,
  stats?: CollectionStats | null
): string {
  const lowerMessage = userMessage.toLowerCase()
  
  // Питання про кількість
  if (lowerMessage.includes('скільки') || lowerMessage.includes('кількість')) {
    return `У колекції "${collection.name}" знаходиться ${collection.itemCount} елементів. ${
      stats && stats.itemsByCategory 
        ? `Розподіл по категоріях: ${Object.entries(stats.itemsByCategory)
            .map(([cat, count]) => `${cat}: ${count}`)
            .join(', ')}.`
        : ''
    }`
  }
  
  // Питання про правила
  if (lowerMessage.includes('правил') || lowerMessage.includes('автомат')) {
    if (collection.filters && collection.filters.length > 0) {
      return `У колекції налаштовано ${collection.filters.length} правил(о). Автосинхронізація ${
        collection.autoSync ? 'увімкнена' : 'вимкнена'
      }. ${
        collection.lastSyncedAt 
          ? `Остання синхронізація: ${new Date(collection.lastSyncedAt).toLocaleString('uk-UA')}.`
          : 'Синхронізація ще не виконувалась.'
      }`
    } else {
      return 'У цій колекції ще не налаштовані правила автоматичного наповнення. Хочете щоб я запропонував правила на основі поточних елементів?'
    }
  }
  
  // Питання про статистику
  if (lowerMessage.includes('статист') || lowerMessage.includes('аналіз')) {
    if (!stats) {
      return 'Статистика не доступна для порожньої колекції.'
    }
    
    return `Статистика колекції "${collection.name}":
- Загальна кількість: ${stats.totalItems}
- Категорії: ${Object.keys(stats.itemsByCategory || {}).length}
${stats.totalValue ? `- Загальна вартість: ${formatCurrency(stats.totalValue)}` : ''}
${stats.averageRating ? `- Середній рейтинг: ${stats.averageRating.toFixed(1)}/5` : ''}
${stats.lastActivity ? `- Остання активність: ${new Date(stats.lastActivity).toLocaleString('uk-UA')}` : ''}`
  }
  
  // Загальна відповідь
  return `Я можу допомогти вам з колекцією "${collection.name}". Ось що я можу зробити:
• Проаналізувати поточні елементи
• Запропонувати правила для автоматичного наповнення
• Допомогти знайти та додати нові елементи
• Надати статистику та інсайти

Що саме вас цікавить?`
}

/**
 * Форматує валюту
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Генерує пропозиції елементів для додавання
 */
export function generateItemSuggestions(
  collection: Collection,
  availableItems: CollectionItem[],
  limit: number = 5
): CollectionItem[] {
  if (availableItems.length === 0) return []
  
  // Якщо є правила - фільтруємо по них
  if (collection.filters && collection.filters.length > 0) {
    // TODO: застосувати правила через rule-engine
    return availableItems.slice(0, limit)
  }
  
  // Якщо є елементи - шукаємо схожі
  if (collection.items && collection.items.length > 0) {
    // Знайти елементи тієї ж категорії
    const categories = new Set(collection.items.map(item => item.category))
    const similar = availableItems.filter(item => categories.has(item.category))
    
    if (similar.length >= limit) {
      return similar.slice(0, limit)
    }
    
    // Додати інші елементи
    const remaining = availableItems.filter(item => !categories.has(item.category))
    return [...similar, ...remaining].slice(0, limit)
  }
  
  // За замовчуванням - перші доступні
  return availableItems.slice(0, limit)
}

