"use client"

import * as React from "react"
import { Search, Sparkles, X, Loader2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface AIFojoSearchProps {
  onSearch: (query: string) => void
  onClear: () => void
  isSearching?: boolean
  searchQuery: string
  onQueryChange: (query: string) => void
  showRecommendations?: boolean
  onRecommendationClick?: (recommendation: string) => void
}

interface AIRecommendation {
  id: string
  label: string
  description: string
  icon: string
}

const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: "high-value",
    label: "High-value Assets",
    description: "Luxury items and high-value properties",
    icon: "💎"
  },
  {
    id: "recent-updates",
    label: "Recent Updates",
    description: "Items updated in the last 30 days",
    icon: "📅"
  },
  {
    id: "real-estate",
    label: "Real Estate",
    description: "Properties and real estate assets",
    icon: "🏠"
  },
  {
    id: "vehicles",
    label: "Vehicles",
    description: "Cars, yachts, and transportation",
    icon: "🚗"
  },
  {
    id: "legal-entities",
    label: "Legal Entities",
    description: "Companies, organizations, and legal structures",
    icon: "🏢"
  },
  {
    id: "financial-docs",
    label: "Financial Documents",
    description: "Items with financial documentation",
    icon: "💰"
  },
  {
    id: "active-items",
    label: "Active Items",
    description: "Currently active and operational items",
    icon: "✅"
  },
  {
    id: "budget-filtered",
    label: "Budget Filtered",
    description: "Items filtered by budget criteria",
    icon: "📊"
  }
]

// Generate smart recommendations based on query
const getSmartRecommendations = (query: string): AIRecommendation[] => {
  const lowerQuery = query.toLowerCase()
  const recommendations: AIRecommendation[] = []
  
  // Special stable flow for "high-value assets above 1M"
  if (lowerQuery.includes('high-value assets above 1m') || 
      lowerQuery.includes('high-value assets above 1m') ||
      lowerQuery.includes('high value assets above 1m') ||
      lowerQuery.includes('high-value above 1m')) {
    return [
      {
        id: "high-value-1m",
        label: "High-value Assets Above 1M",
        description: "Luxury items and high-value properties above 1M",
        icon: "💎"
      },
      {
        id: "luxury-real-estate",
        label: "Luxury Real Estate",
        description: "Premium properties and luxury estates",
        icon: "🏰"
      },
      {
        id: "premium-vehicles",
        label: "Premium Vehicles",
        description: "Luxury cars, yachts, and private jets",
        icon: "🚗"
      },
      {
        id: "investment-assets",
        label: "Investment Assets",
        description: "High-value investment opportunities",
        icon: "📈"
      }
    ]
  }
  
  // Add recommendations based on query content
  if (lowerQuery.includes('legal') || lowerQuery.includes('entities')) {
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'legal-entities')!)
  }
  
  if (lowerQuery.includes('budget') || lowerQuery.includes('бюджет') || lowerQuery.includes('financial')) {
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'financial-docs')!)
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'budget-filtered')!)
  }
  
  if (lowerQuery.includes('active') || lowerQuery.includes('активні')) {
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'active-items')!)
  }
  
  if (lowerQuery.includes('property') || lowerQuery.includes('нерухомість')) {
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'real-estate')!)
  }
  
  if (lowerQuery.includes('vehicle') || lowerQuery.includes('транспорт')) {
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'vehicles')!)
  }
  
  if (lowerQuery.includes('luxury') || lowerQuery.includes('high-value')) {
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'high-value')!)
  }
  
  if (lowerQuery.includes('recent') || lowerQuery.includes('останні')) {
    recommendations.push(AI_RECOMMENDATIONS.find(r => r.id === 'recent-updates')!)
  }
  
  // If no specific matches, return default recommendations
  if (recommendations.length === 0) {
    return AI_RECOMMENDATIONS.slice(0, 4)
  }
  
  // Add some default recommendations if we have less than 4
  const defaultRecs = AI_RECOMMENDATIONS.filter(r => !recommendations.some(rec => rec.id === r.id))
  recommendations.push(...defaultRecs.slice(0, 4 - recommendations.length))
  
  return recommendations.slice(0, 4)
}

export function AIFojoSearch({
  onSearch,
  onClear,
  isSearching = false,
  searchQuery,
  onQueryChange,
  showRecommendations = false,
  onRecommendationClick
}: AIFojoSearchProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAIResponse, setShowAIResponse] = React.useState(false)
  const [collectionDialogOpen, setCollectionDialogOpen] = React.useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = React.useState<string>("")
  const [showAIDetails, setShowAIDetails] = React.useState(false)
  const [selectedRecommendationForDetails, setSelectedRecommendationForDetails] = React.useState<AIRecommendation | null>(null)

  const handleAskFojo = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    
    // Parse complex queries and extract filters
    const parsedQuery = parseComplexQuery(searchQuery)
    onSearch(searchQuery)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setShowAIResponse(true)
  }

  // Parse complex queries to extract filters and criteria
  const parseComplexQuery = (query: string) => {
    const lowerQuery = query.toLowerCase()
    const filters = []
    
    // Extract year filters
    const yearMatch = lowerQuery.match(/(\d{4})\s*рік|(\d{4})\s*year/)
    if (yearMatch) {
      const year = yearMatch[1] || yearMatch[2]
      filters.push({
        field: 'createdOn',
        operator: 'contains',
        value: year
      })
    }
    
    // Extract budget/amount filters
    const budgetMatch = lowerQuery.match(/бюджетом\s*вище\s*(\d+)|budget\s*above\s*(\d+)|вище\s*(\d+)|above\s*(\d+)/)
    if (budgetMatch) {
      const amount = budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4]
      filters.push({
        field: 'budget',
        operator: 'greater_than',
        value: amount
      })
    }
    
    // Extract status filters
    if (lowerQuery.includes('активні') || lowerQuery.includes('active')) {
      filters.push({
        field: 'status',
        operator: 'equals',
        value: 'Active'
      })
    }
    
    // Extract category filters
    if (lowerQuery.includes('legal entities') || lowerQuery.includes('legal entiti')) {
      filters.push({
        field: 'category',
        operator: 'equals',
        value: 'Legal entities'
      })
    }
    
    if (lowerQuery.includes('properties') || lowerQuery.includes('нерухомість')) {
      filters.push({
        field: 'category',
        operator: 'equals',
        value: 'Properties'
      })
    }
    
    if (lowerQuery.includes('vehicles') || lowerQuery.includes('транспорт')) {
      filters.push({
        field: 'category',
        operator: 'equals',
        value: 'Vehicles'
      })
    }
    
    return {
      originalQuery: query,
      filters,
      hasComplexFilters: filters.length > 0
    }
  }

  const handleClear = () => {
    onClear()
    setShowAIResponse(false)
    onQueryChange("")
  }

  const handleRecommendationClick = (recommendation: AIRecommendation) => {
    setSelectedRecommendationForDetails(recommendation)
    setShowAIDetails(true)
  }

  const handleCreateCollection = (recommendation: AIRecommendation) => {
    setSelectedRecommendation(recommendation.label)
    setCollectionDialogOpen(true)
    setShowAIDetails(false)
    onRecommendationClick?.(recommendation.label)
  }

  // Get AI decision details for recommendation
  const getAIDecisionDetails = (recommendation: AIRecommendation) => {
    const lowerQuery = searchQuery.toLowerCase()
    
    if (recommendation.id === 'legal-entities') {
      return {
        title: "Why I recommend Legal Entities collection:",
        reasons: [
          "Your query contains 'legal entety' which indicates interest in legal structures",
          "Legal entities are high-value assets that require special organization",
          "This collection will help you track corporate structures, holdings, and legal documents",
          "Perfect for managing complex business relationships and compliance requirements"
        ]
      }
    }
    
    if (recommendation.id === 'high-value') {
      return {
        title: "Why I recommend High-value Assets collection:",
        reasons: [
          "Your query mentions 'high value' indicating focus on premium assets",
          "High-value items need special attention and security measures",
          "This collection will help you track luxury properties, vehicles, and investments",
          "Essential for asset protection and wealth management"
        ]
      }
    }
    
    return {
      title: "Why I recommend this collection:",
      reasons: [
        "Based on your search patterns and preferences",
        "This collection type matches your current needs",
        "Will help organize your assets more effectively"
      ]
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search with Fojo..."
            className="pl-10 pr-20 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-2">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-xs text-blue-600">AI thinking...</span>
              </div>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleAskFojo}
                  disabled={!searchQuery.trim() || isLoading}
                  className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Ask Fojo
                </Button>
                {searchQuery && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClear}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      {showAIResponse && showRecommendations && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-blue-900">
                {searchQuery.toLowerCase().includes('high-value assets above 1m') || 
                 searchQuery.toLowerCase().includes('high value assets above 1m') ||
                 searchQuery.toLowerCase().includes('high-value above 1m') ? 
                  "Collection created based on AI analysis: \"high-value assets above 1M\". This collection will automatically include objects that match the defined filtering criteria." :
                  "Based on your search, I recommend creating these collections:"}
              </h3>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAIResponse(false)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Special message for stable flow */}
          {(searchQuery.toLowerCase().includes('high-value assets above 1m') || 
            searchQuery.toLowerCase().includes('high value assets above 1m') ||
            searchQuery.toLowerCase().includes('high-value above 1m')) && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>AI Response:</strong> I've analyzed your request "{searchQuery}" and created this custom collection based on your specific criteria. The items have been intelligently grouped to meet your needs.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {getSmartRecommendations(searchQuery).map((recommendation) => (
              <div
                key={recommendation.id}
                className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors cursor-pointer group"
                onClick={() => handleRecommendationClick(recommendation)}
              >
                <span className="text-sm">{recommendation.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-blue-900 group-hover:text-blue-700">
                    {recommendation.label}
                  </div>
                  <div className="text-xs text-blue-600 truncate">
                    {recommendation.description}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Create
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Decision Details Dialog */}
      {showAIDetails && selectedRecommendationForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Decision Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {getAIDecisionDetails(selectedRecommendationForDetails).title}
                </h4>
                <ul className="space-y-2">
                  {getAIDecisionDetails(selectedRecommendationForDetails).reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleCreateCollection(selectedRecommendationForDetails)}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Create Collection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAIDetails(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
