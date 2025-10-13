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
  // UNIFIED AI INSIGHTS - всі колекції показують однакові insights
  const staticInsights: Array<{
    type: 'success' | 'info' | 'warning'
    icon: any
    title: string
    message: string
    actionType: 'none' | 'filter' | 'ai_assistant'
    data?: any
  }> = [
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Premium Collection',
      message: 'Great! This collection has 4 high-value items and is well-organized.',
      actionType: 'none'
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: 'Mixed Categories',
      message: 'Collection spans Properties, Aviation, and Maritime categories for diversified portfolio.',
      actionType: 'filter',
      data: { categories: ['Properties', 'Aviation', 'Maritime'] }
    },
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Smart Collection',
      message: 'Collection uses 4 filter rules for automatic organization based on value and ratings.',
      actionType: 'none'
    },
  ]
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
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
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm">💰 Value &gt; $1M</span>
                <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm">🏢 Premium categories</span>
                <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm">✅ Active status</span>
                <span className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-sm">⭐ Rating ≥ 4</span>
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
        
        {/* AI Summary - Compact (Static for unified view) */}
        {staticInsights.length > 0 && (
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
                    {staticInsights.length} insight{staticInsights.length > 1 ? 's' : ''}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={onOpenAIAssistant}
                  >
                    <Bot className="h-3 w-3 mr-1" />
                    AI Assistant
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {staticInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col gap-2 p-3 rounded-lg transition-colors min-h-[90px] ${
                      insight.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                      insight.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                      'bg-green-50 border border-green-200'
                    }`}
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
