'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Search, Info, Plus, Download, Filter, X } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar'
import { CatalogSidebar } from '@/components/catalog-sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ItemsTable } from '@/components/collections/items-table'
import { CollectionItem, CollectionSortOption } from '@/types/collection'
import { Input } from '@/components/ui/input'

interface SearchResult {
  id: string
  name: string
  type: string
  icon: string
  itemCount: number
  collectionName?: string
  collectionId?: string
  value?: number
  status: string
  lastUpdated: string
  tags: string[]
  description?: string
}

// Convert SearchResult to CollectionItem for ItemsTable
const convertToCollectionItem = (result: SearchResult): CollectionItem => ({
  id: result.id,
  name: result.name,
  type: result.type,
  category: result.type,
  icon: result.icon,
  status: result.status,
  value: result.value,
  tags: result.tags,
  idCode: `${result.type}-${result.id.slice(0, 6)}`,
  location: result.collectionName || 'Unknown',
  createdAt: new Date(result.lastUpdated),
  createdBy: { id: 'system', name: 'System', email: 'system@example.com' },
  pinned: false,
  notes: result.description
})

export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [sortOption, setSortOption] = useState<CollectionSortOption>({ field: 'name', direction: 'asc' })
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [collectionCount, setCollectionCount] = useState(0)

  const searchQuery = searchParams.get('q') || '*'

  useEffect(() => {
    // Mock search results - replace with real search logic
    const mockResults: SearchResult[] = [
      {
        id: '1',
        name: 'Luxury Villa Alpha',
        type: 'Property',
        icon: '🏠',
        itemCount: 12,
        collectionName: 'High-Value Properties',
        collectionId: 'col1',
        value: 2500000,
        status: 'active',
        lastUpdated: '2024-01-15',
        tags: ['luxury', 'beachfront', 'residential'],
        description: 'Premium beachfront villa with panoramic ocean views'
      },
      {
        id: '2', 
        name: 'Commercial Office Building',
        type: 'Property',
        icon: '🏢',
        itemCount: 8,
        collectionName: 'Commercial Assets',
        collectionId: 'col2',
        value: 8500000,
        status: 'active',
        lastUpdated: '2024-01-12',
        tags: ['commercial', 'office', 'downtown'],
        description: 'Modern office complex in prime business district'
      },
      {
        id: '3',
        name: 'Marina Development',
        type: 'Project',
        icon: '🚢',
        itemCount: 15,
        collectionName: 'Development Projects',
        collectionId: 'col3',
        value: 15000000,
        status: 'in-progress',
        lastUpdated: '2024-01-10',
        tags: ['development', 'marina', 'mixed-use'],
        description: 'Large-scale marina development with residential and commercial components'
      },
      {
        id: '4',
        name: 'Retail Shopping Center',
        type: 'Property',
        icon: '🛍️',
        itemCount: 6,
        collectionName: 'Commercial Assets',
        collectionId: 'col2',
        value: 4200000,
        status: 'active',
        lastUpdated: '2024-01-08',
        tags: ['retail', 'shopping', 'commercial'],
        description: 'Premium retail shopping center with anchor tenants'
      },
      {
        id: '5',
        name: 'Luxury Apartment Complex',
        type: 'Property',
        icon: '🏘️',
        itemCount: 20,
        collectionName: 'Residential Properties',
        collectionId: 'col4',
        value: 12000000,
        status: 'active',
        lastUpdated: '2024-01-05',
        tags: ['luxury', 'apartments', 'residential'],
        description: 'High-end apartment complex with resort-style amenities'
      }
    ]
    
    setResults(mockResults)
    setTotalResults(mockResults.length)
    setCollectionCount(4)
  }, [searchQuery])

  // Convert results to CollectionItems
  const collectionItems = results.map(convertToCollectionItem)

  const handleSelectionChange = (ids: Set<string>) => {
    setSelectedItems(ids)
  }

  const handleSortChange = (option: CollectionSortOption) => {
    setSortOption(option)
  }

  const handleBack = () => {
    router.push('/catalog')
  }

  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery)

  const handleSearchSubmit = () => {
    if (currentSearchQuery.trim()) {
      router.push(`/catalog/search?q=${encodeURIComponent(currentSearchQuery)}`)
    }
  }

  const handleClearSearch = () => {
    setCurrentSearchQuery('')
    router.push('/catalog/search?q=*')
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <CatalogSidebar 
        activeView="search" 
        onViewChange={() => {}}
        onOrganizationChange={() => {}}
        pinnedCount={0}
        onCollectionSelect={() => {}}
        selectedCollectionId={null}
      />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto bg-background">
          {/* Header Level 1 - Navigation & Title */}
          <div className="bg-white border-b border-border px-6 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Catalog
              </Button>
              
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-gray-900">Search Results</h1>
                <span className="text-sm text-gray-500">
                  {totalResults} items across {collectionCount} collections
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-4 space-y-3">
            {/* Header Level 2 - Search & Filters */}
            <div className="bg-white rounded-lg border border-border p-3">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={currentSearchQuery}
                    onChange={(e) => setCurrentSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit()
                      }
                    }}
                    placeholder="Search properties, yachts, facilities..."
                    className="pl-10 pr-10"
                  />
                  {currentSearchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button 
                  onClick={handleSearchSubmit}
                  disabled={currentSearchQuery === searchQuery}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Search
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Search Query Display */}
            <div className="px-3 py-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-blue-700">Search query:</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                  {searchQuery}
                </span>
                <button
                  onClick={handleClearSearch}
                  className="ml-1 h-3 w-3 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Actions Bar */}
            {selectedItems.size > 0 && (
              <div className="p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {selectedItems.size} selected
                  </Badge>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Collection
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="bg-card rounded-lg border border-border">
              {collectionItems.length > 0 ? (
                <ItemsTable
                  items={collectionItems}
                  selectedIds={selectedItems}
                  onSelectionChange={handleSelectionChange}
                  sortOption={sortOption}
                  onSortChange={handleSortChange}
                  showSelection={true}
                  showActions={false}
                  emptyMessage="No search results found"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-sm text-gray-500 text-center max-w-md">
                    We couldn't find any items matching "{searchQuery}". Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </div>

            {/* Fixed Collection Suggestions */}
            {(() => {
              // Generate suggestions based on search query
              const getSuggestions = (query: string) => {
                const lowerQuery = query.toLowerCase()
                
                if (lowerQuery.includes('value') || lowerQuery.includes('expensive') || lowerQuery.includes('luxury') || lowerQuery.includes('high')) {
                  return [
                    { name: "High-Value Properties", count: 12, description: "Luxury real estate over $1M" }
                  ]
                }
                
                if (lowerQuery.includes('updated') || lowerQuery.includes('recent') || lowerQuery.includes('week') || lowerQuery.includes('new')) {
                  return [
                    { name: "Recently Updated", count: 8, description: "Items modified in the last 30 days" }
                  ]
                }
                
                if (lowerQuery.includes('property') || lowerQuery.includes('real estate') || lowerQuery.includes('building')) {
                  return [
                    { name: "All Properties", count: 45, description: "Residential and commercial real estate" },
                    { name: "Commercial Assets", count: 8, description: "Office buildings and retail spaces" }
                  ]
                }
                
                if (lowerQuery.includes('marina') || lowerQuery.includes('boat') || lowerQuery.includes('yacht')) {
                  return [
                    { name: "Marina Assets", count: 6, description: "Boats, slips, and marina facilities" }
                  ]
                }
                
                if (lowerQuery.includes('development') || lowerQuery.includes('project') || lowerQuery.includes('construction')) {
                  return [
                    { name: "Development Projects", count: 15, description: "Active development and construction" }
                  ]
                }
                
                // Default suggestions for general queries
                return [
                  { name: "All Collections", count: 103, description: "Browse all available collections" }
                ]
              }
              
              const suggestions = getSuggestions(searchQuery)
              
              return suggestions.length > 0 ? (
                <div className="sticky bottom-0 bg-background border-t border-border p-3">
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-foreground">Suggested Collections</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Based on your search, you might be interested in these collections</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {suggestions.map((collection, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-sm font-medium text-gray-900">{collection.name}</h4>
                          <span className="text-xs text-gray-500">{collection.count} items</span>
                        </div>
                        <p className="text-xs text-gray-600">{collection.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })()}

          </div>
        </div>
      </main>
    </div>
  )
}
