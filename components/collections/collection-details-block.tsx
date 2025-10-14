"use client"

import * as React from "react"
import { Collection, CollectionItem } from "@/types/collection"
import { FilterRule } from "@/types/rule"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InsightCard, InsightData } from "@/components/ui/insight-card"
import { FilterChipsList, FilterChipData } from "@/components/ui/filter-chip"
import { CollectionDetailsSection } from "@/components/ui/collapsible-section"
import {
  Sparkles,
  Filter,
  Info,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Bot,
  ChevronDown,
  ChevronUp,
  Wrench,
  Home,
  BarChart3,
  DollarSign,
  Calendar,
  ClipboardList,
  ExternalLink,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react"

interface CollectionDetailsBlockProps {
  collection: Collection
  items: CollectionItem[]
  onOpenAIAssistant?: () => void
  onInsightClick?: (insightId: string, aiDetails: any) => void
}

// Функція для форматування правил у читабельний вигляд
const formatRule = (rule: FilterRule): string => {
  const { field, operator, value } = rule
  
  const fieldLabels: Record<string, string> = {
    'name': 'Name',
    'category': 'Category',
    'status': 'Status',
    'type': 'Type',
    'location': 'Location',
    'value': 'Value',
    'pinned': 'Pinned',
    'createdBy': 'Created by',
    'createdOn': 'Created on',
    'sharedWith': 'Shared with'
  }
  
  const operatorLabels: Record<string, string> = {
    'equals': 'is',
    'not_equals': 'is not',
    'contains': 'contains',
    'not_contains': 'does not contain',
    'starts_with': 'starts with',
    'ends_with': 'ends with',
    'is_empty': 'is empty',
    'is_not_empty': 'is not empty',
    'greater_than': 'is greater than',
    'less_than': 'is less than'
  }
  
  const fieldLabel = fieldLabels[field] || field
  const operatorLabel = operatorLabels[operator] || operator
  
  return `${fieldLabel} ${operatorLabel} "${value}"`
}

// Функція для генерації AI Summary
const generateAISummary = (collection: Collection, items: CollectionItem[]) => {
  const insights = []
  
  // Аналіз кількості items
  if (items.length === 0) {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      title: 'Empty Collection',
      message: 'This collection has no items yet. Consider adding items or checking your filter rules.',
      actionType: 'ai_assistant',
      data: { action: 'add_items' }
    })
  } else if (items.length < 3) {
    insights.push({
      type: 'info',
      icon: Info,
      title: 'Small Collection',
      message: `Only ${items.length} items in this collection. You might want to expand it.`,
      actionType: 'ai_assistant',
      data: { action: 'expand_collection' }
    })
  } else if (items.length > 20) {
    insights.push({
      type: 'success',
      icon: CheckCircle,
      title: 'Large Collection',
      message: `Great! This collection has ${items.length} items and is well-organized.`,
      actionType: 'none'
    })
  }
  
  // Аналіз типів items
  const categories = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const categoryCount = Object.keys(categories).length
  if (categoryCount > 1) {
    insights.push({
      type: 'info',
      icon: TrendingUp,
      title: 'Mixed Categories',
      message: `Collection spans ${categoryCount} different categories: ${Object.keys(categories).join(', ')}.`,
      actionType: 'filter',
      data: { categories: Object.keys(categories) }
    })
  } else if (categoryCount === 1) {
    const category = Object.keys(categories)[0]
    insights.push({
      type: 'success',
      icon: CheckCircle,
      title: 'Focused Collection',
      message: `All items are in the ${category} category - great focus!`,
      actionType: 'filter',
      data: { category }
    })
  }
  
  // Аналіз статусів
  const statuses = items.reduce((acc, item) => {
    if (item.status) {
      acc[item.status] = (acc[item.status] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  const unavailableItems = Object.entries(statuses)
    .filter(([status]) => ['Maintenance', 'Unavailable', 'Expired'].includes(status))
    .reduce((sum, [, count]) => sum + count, 0)
  
  if (unavailableItems > 0) {
    const problemItems = items.filter(item => item.status && ['Maintenance', 'Unavailable', 'Expired'].includes(item.status))
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      title: 'Items Need Attention',
      message: `${unavailableItems} items have status issues that may need attention.`,
      actionType: 'filter',
      data: { 
        status: ['Maintenance', 'Unavailable', 'Expired'],
        items: problemItems.map(item => item.id)
      }
    })
  }
  
  // Аналіз правил
  if (collection.filters && collection.filters.length > 0) {
    insights.push({
      type: 'success',
      icon: CheckCircle,
      title: 'Smart Collection',
      message: `Collection uses ${collection.filters.length} filter rule${collection.filters.length > 1 ? 's' : ''} for automatic organization.`,
      actionType: 'none'
    })
  } else if (items.length > 0) {
    insights.push({
      type: 'info',
      icon: Info,
      title: 'Manual Collection',
      message: 'This is a manual collection. Consider adding filter rules for automatic updates.',
      actionType: 'ai_assistant',
      data: { action: 'setup_rules' }
    })
  }
  
  // Аналіз дат створення
  const now = new Date()
  const recentItems = items.filter(item => {
    if (!item.createdAt) return false
    const createdDate = new Date(item.createdAt)
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  }).length
  
  if (recentItems > 0) {
    const recentItemsList = items.filter(item => {
      if (!item.createdAt) return false
      const createdDate = new Date(item.createdAt)
      const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    })
    
    insights.push({
      type: 'info',
      icon: TrendingUp,
      title: 'Recent Activity',
      message: `${recentItems} items were added in the last 7 days.`,
      actionType: 'filter',
      data: { 
        filter: 'recent',
        items: recentItemsList.map(item => item.id)
      }
    })
  }
  
  return insights
}

export function CollectionDetailsBlock({ 
  collection, 
  items, 
  onOpenAIAssistant, 
  onInsightClick
}: CollectionDetailsBlockProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  
  // СПРОЩЕНІ AI INSIGHTS - тільки 3 найважливіші (реальні дані для 9 items)
  const staticInsights: InsightData[] = [
    {
      id: 'maintenance-alert',
      title: '⚠️ Maintenance Alert',
      message: '4 properties require HVAC filter replacement within 30 days',
      type: 'warning',
      icon: '⚠️',
      aiDetails: {
        title: '⚠️ Maintenance Alert: HVAC Filter Replacement Needed',
        description: 'Я виявив, що 4 ваші об\'єкти потребують заміни фільтрів HVAC протягом наступних 30 днів. Своєчасна заміна фільтрів є критично важливою для підтримки якості повітря, ефективності системи та запобігання дорогим поломкам.',
        items: [
          'Property A: Останнє обслуговування: 15.03.2023. Рекомендована заміна: до 20.07.2024.',
          'Property B: Останнє обслуговування: 01.04.2023. Рекомендована заміна: до 05.08.2024.',
          'Property C: Останнє обслуговування: 10.04.2023. Рекомендована заміна: до 15.08.2024.',
          'Property D: Останнє обслуговування: 25.04.2023. Рекомендована заміна: до 30.08.2024.'
        ],
        recommendations: [
          'Запланувати обслуговування: Зв\'яжіться з вашими підрядниками для планування заміни фільтрів.',
          'Перевірити запаси фільтрів: Переконайтеся, що у вас є необхідні типи та розміри фільтрів.',
          'Отримати пропозиції: Якщо ви шукаєте нового постачальника послуг, я можу допомогти знайти кваліфікованих підрядників у вашому регіоні.'
        ],
        actions: [
          'Створити завдання для кожного об\'єкта в системі управління завданнями',
          'Надати список рекомендованих постачальників HVAC послуг',
          'Згенерувати звіт про історію обслуговування цих об\'єктів'
        ]
      }
    },
    {
      id: 'insurance-gap',
      title: '🛡️ Insurance Gap',
      message: '3 properties missing flood insurance coverage',
      type: 'warning',
      icon: '🛡️',
      aiDetails: {
        title: '🛡️ Insurance Gap: Відсутнє покриття від повеней',
        description: 'Я виявив, що 3 ваші об\'єкти не мають покриття від повеней. Це створює значний ризик, особливо якщо ці об\'єкти розташовані в зонах, схильних до затоплень.',
        items: [
          'Property X: Розташований у зоні помірного ризику повеней.',
          'Property Y: Розташований у зоні високого ризику повеней.',
          'Property Z: Розташований у зоні низького ризику, але з потенційними змінами клімату.'
        ],
        recommendations: [
          'Оцінити ризики: Перевірте поточні карти зон затоплення для цих об\'єктів.',
          'Зв\'язатися зі страховими агентами: Отримайте пропозиції щодо страхування від повеней.',
          'Переглянути існуючі поліси: Переконайтеся, що інші ваші об\'єкти мають адекватне покриття.'
        ],
        actions: [
          'Згенерувати звіт про географічне розташування об\'єктів та їхні зони ризику повеней',
          'Надати контакти перевірених страхових брокерів, що спеціалізуються на комерційній нерухомості',
          'Порівняти пропозиції від різних страхових компаній'
        ]
      }
    },
    {
      id: 'cost-optimization',
      title: '📈 Cost Optimization',
      message: 'Aviation maintenance contracts up for renewal - potential $200K savings',
      type: 'info',
      icon: '📈',
      aiDetails: {
        title: '📈 Cost Optimization: Можливість економії на контрактах',
        description: 'Я виявив, що ваші контракти на технічне обслуговування авіації підлягають поновленню, і є потенціал для економії до $200 000. Це чудова можливість переглянути умови та оптимізувати витрати.',
        items: [
          'Контракти: Кілька контрактів на обслуговування авіаційного парку, термін дії яких закінчується протягом наступних 90 днів.',
          'Потенційна економія: Аналіз ринку та історичних даних показує, що можна досягти економії до $200 000 шляхом переговорів або зміни постачальника.'
        ],
        recommendations: [
          'Переглянути поточні контракти: Детально вивчіть умови, обсяги послуг та ціни.',
          'Запросити нові пропозиції: Зверніться до інших постачальників послуг для отримання конкурентних пропозицій.',
          'Провести переговори: Використайте отримані дані для переговорів з поточними або новими постачальниками.'
        ],
        actions: [
          'Згенерувати порівняльний звіт по умовах поточних контрактів та ринкових пропозицій',
          'Надати список потенційних нових постачальників послуг з обслуговування авіації',
          'Запланувати зустрічі з ключовими зацікавленими сторонами для обговорення стратегії переговорів'
        ]
      }
    }
  ]
  
  // Конвертуємо фільтри в формат FilterChipData
  const filterChips: FilterChipData[] = collection.filters?.map((filter, index) => ({
    id: `filter-${index}`,
    field: filter.field,
    operator: filter.operator,
    value: filter.value,
    displayText: `${filter.field} ${filter.operator} ${filter.value}`
  })) || []

  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <CollectionDetailsSection
          defaultCollapsed={isCollapsed}
          onToggle={setIsCollapsed}
        >
          {/* Description */}
        {collection.description && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
            <p className="text-sm leading-relaxed mb-4">{collection.description}</p>
          </div>
        )}
        
          {/* Rules */}
          {filterChips.length > 0 && (
            <>
              {collection.description && <Separator />}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Filter criteria</span>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pen w-3 h-3">
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                    </svg>
                    Customize filters
                  </button>
                </div>
                <FilterChipsList filters={filterChips} />
                {collection.autoSync && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Auto-sync enabled - collection updates automatically
                  </p>
                )}
              </div>
            </>
          )}
        
          {/* AI Insights */}
          {staticInsights.length > 0 && (
            <>
              {(collection.description || filterChips.length > 0) && <Separator />}
              <div>
                <div className="flex items-center justify-between mb-4 mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Insights
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {staticInsights.length} insight{staticInsights.length > 1 ? 's' : ''}
                    </Badge>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-7 px-3 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={onOpenAIAssistant}
                    >
                      <Bot className="h-4 w-4 mr-1" />
                      AI Fojo
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {staticInsights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onClick={() => {
                        if (onInsightClick && insight.aiDetails) {
                          onInsightClick(insight.id, insight.aiDetails)
                        } else if (onOpenAIAssistant) {
                          onOpenAIAssistant()
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CollectionDetailsSection>
      </CardContent>
    </Card>
  )
}
