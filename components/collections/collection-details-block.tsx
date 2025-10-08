"use client"

import * as React from "react"
import { Collection, CollectionItem } from "@/types/collection"
import { FilterRule } from "@/types/rule"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sparkles,
  Filter,
  Info,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Bot,
} from "lucide-react"

interface CollectionDetailsBlockProps {
  collection: Collection
  items: CollectionItem[]
  onOpenAIAssistant?: () => void
  onInsightClick?: (insightType: string, data: any) => void
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

export function CollectionDetailsBlock({ collection, items, onOpenAIAssistant, onInsightClick }: CollectionDetailsBlockProps) {
  const aiInsights = React.useMemo(() => generateAISummary(collection, items), [collection, items])
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-end">
          {onOpenAIAssistant && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAIAssistant}
              className="bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border-indigo-200"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          )}
        </div>
      </CardHeader>
      
        <CardContent className="space-y-4">
          {/* Description */}
        {collection.description && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
            <p className="text-sm leading-relaxed">{collection.description}</p>
          </div>
        )}
        
        {/* Rules */}
        {collection.filters && collection.filters.length > 0 && (
          <>
            {collection.description && <Separator />}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter Rules
              </h4>
              <div className="space-y-2">
                {collection.filters.map((rule, index) => (
                  <div key={rule.id} className="flex items-center gap-2">
                    {index > 0 && (
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        AND
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 text-sm">
                      <span className="font-medium">{formatRule(rule)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {collection.autoSync && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Auto-sync enabled - collection updates automatically
                </p>
              )}
            </div>
          </>
        )}
        
        {/* AI Summary - Compact */}
        {aiInsights.length > 0 && (
          <>
            {(collection.description || (collection.filters && collection.filters.length > 0)) && <Separator />}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {aiInsights.length} insight{aiInsights.length > 1 ? 's' : ''}
                  </Badge>
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Assistant
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col gap-2 p-3 rounded-lg transition-colors min-h-[90px] cursor-pointer ${
                      insight.actionType !== 'none' ? 'hover:shadow-md' : ''
                    } ${
                      insight.type === 'warning' ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100' :
                      insight.type === 'info' ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100' :
                      'bg-green-50 border border-green-200 hover:bg-green-100'
                    }`}
                    onClick={() => {
                      if (insight.actionType === 'ai_assistant' && onOpenAIAssistant) {
                        onOpenAIAssistant()
                      } else if (insight.actionType === 'filter' && onInsightClick) {
                        onInsightClick(insight.actionType, insight.data)
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <insight.icon className={`h-4 w-4 ${
                        insight.type === 'warning' ? 'text-amber-600' :
                        insight.type === 'info' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                      <p className="text-sm font-medium">{insight.title}</p>
                      {insight.actionType !== 'none' && (
                        <div className="ml-auto">
                          {insight.actionType === 'ai_assistant' ? (
                            <Bot className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Filter className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">{insight.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
