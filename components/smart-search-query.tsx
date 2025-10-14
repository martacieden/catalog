'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Sparkles, 
  Clock, 
  Code, 
  Info,
  Zap
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface QuickFilter {
  id: string
  label: string
  icon: string
  query: string
  description: string
}

interface RecentSearch {
  id: string
  query: string
  resultCount: number
  timestamp: number
}

interface SmartSuggestion {
  id: string
  label: string
  example: string
  description: string
}

const quickFilters: QuickFilter[] = [
  {
    id: 'high-value',
    label: 'Amount - more than - $100,000',
    icon: '💰',
    query: 'value > 100000',
    description: 'Items worth over $100k'
  },
  {
    id: 'recently-updated',
    label: 'Updated Date - is after - 7 days ago',
    icon: '📅',
    query: 'updated >= 7d',
    description: 'Modified in last 7 days'
  },
  {
    id: 'shared-with-me',
    label: 'Shared Status - is - true',
    icon: '👥',
    query: 'shared = true AND owner != me',
    description: 'Collections others shared with you'
  },
  {
    id: 'needs-attention',
    label: 'Status - is any of - Pending, Flagged',
    icon: '🔴',
    query: 'status = "pending" OR flagged = true',
    description: 'Items requiring action'
  }
]

const smartQueryExamples: SmartSuggestion[] = [
  {
    id: 'high-value',
    label: "High Value Items",
    example: "expensive items",
    description: "Find items worth over $100k"
  },
  {
    id: 'recent', 
    label: "Recently Updated", 
    example: "updated this week",
    description: "Items modified in the last 7 days"
  },
  {
    id: 'by-type',
    label: "Filter by Type",
    example: "properties only",
    description: "Show specific item types"
  },
  {
    id: 'by-status',
    label: "Filter by Status",
    example: "active items",
    description: "Items with specific status"
  }
]

export function SmartSearchQuery() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSmartQuery, setIsSmartQuery] = useState(false)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-detect smart query
  useEffect(() => {
    const smartQueryPattern = /[><=]|contains|between|includes|AND|OR|NOT/i
    setIsSmartQuery(smartQueryPattern.test(searchQuery))
  }, [searchQuery])


  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleQuickFilterClick = (filter: QuickFilter) => {
    setSearchQuery(filter.query)
    setActiveFilter(filter.id)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setActiveFilter(null)
  }

  const handleSearchSubmit = () => {
    // Add to recent searches if query is not empty
    if (searchQuery.trim()) {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query: searchQuery,
        resultCount: 0, // Will be updated on results page
        timestamp: Date.now()
      }
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)])
    }
    
    setShowSuggestions(false)
    
    // Navigate to search results page (even if query is empty, to show all results)
    const queryParam = searchQuery.trim() || '*'
    router.push(`/catalog/search?q=${encodeURIComponent(queryParam)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-900">Smart Collection Search</h2>
        <p className="text-sm text-slate-600">Find items across all your collections or create smart filters</p>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleQuickFilterClick(filter)}
            className={`inline-flex items-center gap-1.5 px-2.5 h-[30px] rounded-md text-xs font-medium transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
            }`}
            title={filter.description}
            aria-label={`Apply filter: ${filter.label} - ${filter.description}`}
            role="button"
          >
            <span className="text-base" aria-hidden="true">{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div ref={searchRef} className="relative">
        <div className="relative flex items-center bg-white rounded-lg border-2 border-gray-200 
          focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 
          transition-all duration-200">
          
          {/* Search Icon */}
          <Search className="absolute left-3 h-4 w-4 text-gray-400" aria-hidden="true" />
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search items, collections, or type a smart query..."
            className="w-full px-10 pr-16 py-2.5 text-sm bg-transparent focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            aria-label="Search items and collections"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            role="combobox"
          />
          
          {/* Search Button */}
          <button 
            onClick={handleSearchSubmit}
            className="absolute right-1.5 px-2.5 py-1.5 bg-blue-600 text-white 
            rounded hover:bg-blue-700 transition-colors flex items-center gap-1 text-xs"
            aria-label="Search"
          >
            <Search className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl 
            border border-gray-200 shadow-lg max-h-96 overflow-y-auto z-50"
            role="listbox"
            aria-label="Search suggestions">
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-b border-gray-100">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Recent Searches
                </p>
                {recentSearches.map(search => (
                  <button 
                    key={search.id}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 
                      rounded-lg flex items-center gap-3"
                    onClick={() => setSearchQuery(search.query)}
                    role="option"
                    aria-label={`Recent search: ${search.query} with ${search.resultCount} results`}
                  >
                    <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    <span>{search.query}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {search.resultCount} results
                    </Badge>
                  </button>
                ))}
              </div>
            )}
            
            {/* Smart Query Suggestions */}
            <div className="p-2 border-b border-gray-100">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Smart Queries
              </p>
              {smartQueryExamples.map(suggestion => (
                <button 
                  key={suggestion.id}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 
                    rounded-lg flex items-center gap-3 group"
                  onClick={() => setSearchQuery(suggestion.example)}
                  role="option"
                  aria-label={`Smart query: ${suggestion.label} - ${suggestion.description}`}
                >
                  <Code className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{suggestion.label}</p>
                    <p className="text-xs text-gray-500">{suggestion.description}</p>
                  </div>
                </button>
              ))}
            </div>
            
          </div>
        )}
      </div>



    </div>
  )
}
