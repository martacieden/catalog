'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Search, Info, Plus, Download, Filter, X, FolderOpen } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar'
import { CatalogSidebar } from '@/components/catalog-sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ItemsTable } from '@/components/collections/items-table'
import { CollectionItem, CollectionSortOption } from '@/types/collection'
import { Input } from '@/components/ui/input'
import { ManualCollectionDialog } from '@/components/manual-collection-dialog'
import { AddSelectedToCollectionDialog } from '@/components/collections/add-selected-to-collection-dialog'
import { useToast } from '@/hooks/use-toast'

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

function SearchResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [sortOption, setSortOption] = useState<CollectionSortOption>({ field: 'name', direction: 'asc' })
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [collectionCount, setCollectionCount] = useState(0)
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const searchQuery = searchParams?.get('q') || '*'

  // Early return if searchParams is not available (during SSR)
  if (!searchParams) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search results...</p>
        </div>
      </div>
    )
  }

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
    
    // Автоматично вибираємо всі елементи за замовчуванням
    const allItemIds = new Set(mockResults.map(result => result.id))
    setSelectedItems(allItemIds)
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

  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery || '*')

  const handleSearchSubmit = () => {
    if (currentSearchQuery.trim()) {
      router.push(`/catalog/search?q=${encodeURIComponent(currentSearchQuery)}`)
    }
  }

  const handleClearSearch = () => {
    setCurrentSearchQuery('')
    router.push('/catalog/search?q=*')
  }

  const handleCreateCollection = () => {
    setCollectionDialogOpen(true)
  }

  const handleExport = () => {
    setExportDialogOpen(true)
  }

  // Get items to work with (selected or all)
  const getItemsToWorkWith = () => {
    if (selectedItems.size > 0) {
      return Array.from(selectedItems)
    }
    return collectionItems.map(item => item.id)
  }

  const getItemsCount = () => {
    return selectedItems.size > 0 ? selectedItems.size : collectionItems.length
  }

  // Calculate summary statistics
  const totalValue = results.reduce((sum, item) => sum + (item.value || 0), 0)
  const activeCount = results.filter(item => item.status === 'active').length
  const inProgressCount = results.filter(item => item.status === 'in-progress').length
  const propertyCount = results.filter(item => item.type === 'Property').length
  const projectCount = results.filter(item => item.type === 'Project').length

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
            {/* Compact Search & AI Suggestion Panel */}
            <div className="bg-white rounded-lg border border-border p-4">
              <div className="flex items-center gap-4 mb-3">
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
                  disabled={currentSearchQuery === (searchQuery || '*')}
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

            {/* Results Summary */}
            {collectionItems.length > 0 && (
              <div className="bg-white rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-medium text-gray-900">
                      {totalResults} items found
                    </span>
                    <span className="text-gray-600">
                      Total Value: ${(totalValue / 1000000).toFixed(1)}M
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {activeCount} active
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {inProgressCount} in-progress
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {propertyCount} Properties
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {projectCount} Projects
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Bar - Always visible */}
            <div className="sticky top-0 z-50 bg-white border border-border rounded-lg px-4 py-3 shadow-sm mb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Left side - Bulk actions (only when items selected) */}
                <div className="flex items-center gap-2 sm:gap-4">
                  {selectedItems.size > 0 ? (
                    <>
                      <span className="text-sm font-medium">{selectedItems.size} items selected</span>
                      <button
                        onClick={() => setSelectedItems(new Set())}
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-md gap-1.5 px-3"
                      >
                        <X className="mr-1 sm:mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Clear selection</span>
                        <span className="sm:hidden">Clear</span>
                      </button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          // Remove selected items from results
                          const selectedIds = Array.from(selectedItems)
                          const updatedResults = results.filter(result => !selectedIds.includes(result.id))
                          setResults(updatedResults)
                          setTotalResults(updatedResults.length)
                          setSelectedItems(new Set())
                          
                          toast({
                            title: "Items removed",
                            description: `${selectedIds.length} items have been removed from search results.`,
                          })
                        }}
                      >
                        <X className="mr-1 sm:mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Remove items</span>
                        <span className="sm:hidden">Remove</span>
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Select items to perform bulk actions</span>
                  )}
                </div>
                
                {/* Right side - Bulk action buttons (only when items selected) */}
                {selectedItems.size > 0 && (
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={handleExport}>
                      <Download className="mr-1 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                      <span className="sm:hidden">Export</span>
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateCollection}>
                      <FolderOpen className="mr-1 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Create Collection</span>
                      <span className="sm:hidden">Create</span>
                    </Button>
                    <AddSelectedToCollectionDialog
                      trigger={
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Add to Collection</span>
                          <span className="sm:hidden">Add</span>
                        </Button>
                      }
                      selectedItemIds={getItemsToWorkWith()}
                    />
                  </div>
                )}
              </div>
            </div>

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
                  showBulkActions={false}
                  emptyMessage="No search results found"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-sm text-gray-500 text-center max-w-md">
                    We couldn't find any items matching "{searchQuery || '*'}". Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </div>



          </div>
        </div>
      </main>

      {/* Collection Creation Dialog */}
      <ManualCollectionDialog
        trigger={
          <div style={{ display: 'none' }}>
            {/* Hidden trigger - dialog will be opened programmatically */}
          </div>
        }
        open={collectionDialogOpen}
        onOpenChange={setCollectionDialogOpen}
        selectedItems={getItemsToWorkWith()}
        onCollectionCreated={() => {
          setCollectionDialogOpen(false)
          toast({
            title: "Collection created",
            description: "Your collection has been created successfully.",
          })
        }}
      />


      {/* Export Dialog */}
      {exportDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Export Items</h3>
              <button
                onClick={() => setExportDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Export {getItemsCount()} {selectedItems.size > 0 ? 'selected' : 'search result'} items to:
              </p>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle CSV export
                    setExportDialogOpen(false)
                    toast({
                      title: "Export started",
                      description: "CSV file is being prepared for download.",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV File
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle Excel export
                    setExportDialogOpen(false)
                    toast({
                      title: "Export started",
                      description: "Excel file is being prepared for download.",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel File
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle PDF export
                    setExportDialogOpen(false)
                    toast({
                      title: "Export started",
                      description: "PDF file is being prepared for download.",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
