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
import { RulesModal } from "@/components/collections/rules-modal"
import { countMatchedItems } from "@/lib/rule-engine"
import { useToast } from "@/hooks/use-toast"
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
  onOpenAIAssistant?: (insightData?: InsightData) => void
  onInsightClick?: (insightId: string, aiDetails: any) => void
}

// Function to format rules into readable format
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

// Function to generate AI Summary
const generateAISummary = (collection: Collection, items: CollectionItem[]) => {
  const insights = []
  
  // Analysis of items count
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
  
  // Analysis of item types
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
  
  // Analysis of statuses
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
  
  // Analysis of rules
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
  
  // Analysis of creation dates
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
  const [rulesModalOpen, setRulesModalOpen] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [lastSyncTime, setLastSyncTime] = React.useState<Date | null>(null)
  const [matchedItemsCount, setMatchedItemsCount] = React.useState(items.length)
  const [previousCount, setPreviousCount] = React.useState(items.length)
  const { toast } = useToast()
  
  // Оновлюємо кількість відповідних елементів при зміні правил
  React.useEffect(() => {
    if (collection.filters && collection.filters.length > 0) {
      const newMatchedCount = countMatchedItems(items, collection.filters)
      setPreviousCount(matchedItemsCount)
      setMatchedItemsCount(newMatchedCount)
    } else {
      setPreviousCount(matchedItemsCount)
      setMatchedItemsCount(items.length)
    }
  }, [collection.filters, items])
  
  const handleViewInsightDetails = (insight: InsightData) => {
    // Open AI Assistant with insight data instead of modal
    onOpenAIAssistant?.(insight)
  }
  
  const handleSaveRules = async (rules: FilterRule[]) => {
    setIsSyncing(true)
    try {
      // Симуляція API виклику
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Тут буде логіка збереження правил
      console.log('Saving rules:', rules)
      
      // Оновлюємо кількість відповідних елементів
      const newMatchedCount = countMatchedItems(items, rules)
      setMatchedItemsCount(newMatchedCount)
      
      // Оновлюємо час останньої синхронізації
      setLastSyncTime(new Date())
      
      // Показуємо toast повідомлення
      toast({
        title: "Collection synced successfully",
        description: `Rules updated. Collection now contains ${newMatchedCount} matching items.`,
      })
    } catch (error) {
      console.error('Error saving rules:', error)
      toast({
        title: "Sync failed",
        description: "Failed to update collection rules. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }
  
  // SIMPLIFIED AI INSIGHTS - only 3 most important (real data for 9 items)
  const staticInsights: InsightData[] = [
    {
      id: 'maintenance-alert',
      title: '⚠️ Maintenance Alert',
      message: '4 properties require HVAC filter replacement within 30 days',
      type: 'warning',
      icon: '⚠️',
      aiDetails: {
        title: '⚠️ Maintenance Alert: HVAC Filter Replacement Needed',
        description: 'I found that 4 of your properties require HVAC filter replacement within the next 30 days. Timely filter replacement is critical for maintaining air quality, system efficiency, and preventing expensive breakdowns.',
        items: [
          'Property A: Last maintenance: 15.03.2023. Recommended replacement: by 20.07.2024.',
          'Property B: Last maintenance: 01.04.2023. Recommended replacement: by 05.08.2024.',
          'Property C: Last maintenance: 10.04.2023. Recommended replacement: by 15.08.2024.',
          'Property D: Last maintenance: 25.04.2023. Recommended replacement: by 30.08.2024.'
        ],
        recommendations: [
          'Schedule maintenance: Contact your contractors to plan filter replacement.',
          'Check filter inventory: Make sure you have the necessary filter types and sizes.',
          'Get quotes: If you\'re looking for a new service provider, I can help you find qualified contractors in your area.'
        ],
        actions: [
          'Create tasks for each property in the task management system',
          'Provide a list of recommended HVAC service providers',
          'Generate a maintenance history report for these properties'
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
        title: '🛡️ Insurance Gap: Missing Flood Coverage',
        description: 'I found that 3 of your properties lack flood insurance coverage. This creates significant risk, especially if these properties are located in flood-prone areas.',
        items: [
          'Property X: Located in moderate flood risk zone.',
          'Property Y: Located in high flood risk zone.',
          'Property Z: Located in low risk zone, but with potential climate changes.'
        ],
        recommendations: [
          'Assess risks: Check current flood zone maps for these properties.',
          'Contact insurance agents: Get quotes for flood insurance coverage.',
          'Review existing policies: Ensure your other properties have adequate coverage.'
        ],
        actions: [
          'Generate a report on geographic location of properties and their flood risk zones',
          'Provide contacts of verified insurance brokers specializing in commercial real estate',
          'Compare quotes from different insurance companies'
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
        title: '📈 Cost Optimization: Contract Savings Opportunity',
        description: 'I found that your aviation maintenance contracts are up for renewal, with potential savings of up to $200,000. This is a great opportunity to review terms and optimize costs.',
        items: [
          'Contracts: Several aviation fleet maintenance contracts expiring within the next 90 days.',
          'Potential savings: Market analysis and historical data shows potential savings of up to $200,000 through negotiations or supplier changes.'
        ],
        recommendations: [
          'Review current contracts: Thoroughly examine terms, service volumes, and pricing.',
          'Request new proposals: Contact other service providers for competitive quotes.',
          'Conduct negotiations: Use the data obtained for negotiations with current or new suppliers.'
        ],
        actions: [
          'Generate a comparative report on current contract terms and market proposals',
          'Provide a list of potential new aviation maintenance service providers',
          'Schedule meetings with key stakeholders to discuss negotiation strategy'
        ]
      }
    }
  ]
  
  // Convert filters to FilterChipData format
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
          badge={`${matchedItemsCount} items`}
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
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Filter criteria</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-blue-600 hover:text-blue-700 h-7 px-2 gap-1"
                    onClick={() => setRulesModalOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                    </svg>
                    Customize filters
                  </Button>
                </div>
                <FilterChipsList filters={filterChips} />
                {collection.autoSync && filterChips.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Auto-sync enabled - collection updates automatically when rules change
                    </p>
                    {isSyncing && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <div className="h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Syncing collection data...
                      </p>
                    )}
                    {lastSyncTime && !isSyncing && (
                      <div className="space-y-1">
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <div className="h-3 w-3 bg-green-600 rounded-full" />
                          Last synced: {lastSyncTime.toLocaleTimeString()}
                        </p>
                        {previousCount !== matchedItemsCount && (
                          <p className="text-xs text-blue-600 flex items-center gap-1">
                            <div className="h-3 w-3 bg-blue-600 rounded-full" />
                            Items updated: {previousCount} → {matchedItemsCount}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {collection.autoSync && filterChips.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Auto-sync enabled - add rules to enable automatic updates
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
                      onClick={() => onOpenAIAssistant?.()}
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
                      onViewDetails={() => handleViewInsightDetails(insight)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CollectionDetailsSection>
      </CardContent>
      
      {/* Rules Modal */}
      <RulesModal
        collection={collection}
        open={rulesModalOpen}
        onOpenChange={setRulesModalOpen}
        onSave={handleSaveRules}
      />
    </Card>
  )
}
