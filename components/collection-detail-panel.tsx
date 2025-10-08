"use client"

import * as React from "react"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
import { CollectionItem } from "@/types/collection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CollectionDetailsBlock } from "./collections/collection-details-block"
import { ItemsTable } from "./collections/items-table"
import { ItemsGrid } from "./collections/items-grid"
import { RulesModal } from "./collections/rules-modal"
import { AddItemModal } from "./collections/add-item-modal"
import { ShareModal } from "./collections/share-modal"
import {
  Settings,
  Filter,
  Search,
  Plus,
  Grid3x3,
  List,
  FileText,
  RotateCcw,
  Share2,
} from "lucide-react"

interface CollectionDetailPanelProps {
  collectionId: string | null
  onClose: () => void
}

export function CollectionDetailPanel({ collectionId, onClose }: CollectionDetailPanelProps) {
  const { getCollectionById, bulkRemoveItems } = useCollections()
  const { toast } = useToast()
  
  const collection = collectionId ? getCollectionById(collectionId) : null
  
  // State
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [layout, setLayout] = React.useState<"table" | "grid">("grid")
  const [rulesModalOpen, setRulesModalOpen] = React.useState(false)
  const [addItemModalOpen, setAddItemModalOpen] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [tableSearchQuery, setTableSearchQuery] = React.useState("")
  const [tableFilters, setTableFilters] = React.useState({
    category: "",
    status: "",
    valueMin: "",
    valueMax: "",
  })
  const [showTableFilters, setShowTableFilters] = React.useState(false)
  
  // Filter items based on search and table filters
  const processedItems = React.useMemo(() => {
    if (!collection?.items) return []
    
    let filtered = collection.items
    
    // Apply header search (global search within collection)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
    }
    
    // Apply table search (search in visible columns)
    if (tableSearchQuery.trim()) {
      const query = tableSearchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
      )
    }
    
    // Apply table filters
    if (tableFilters.category) {
      filtered = filtered.filter(item => item.category === tableFilters.category)
    }
    
    if (tableFilters.status) {
      filtered = filtered.filter(item => item.status === tableFilters.status)
    }
    
    if (tableFilters.valueMin) {
      const minValue = parseFloat(tableFilters.valueMin)
      filtered = filtered.filter(item => item.value && item.value >= minValue)
    }
    
    if (tableFilters.valueMax) {
      const maxValue = parseFloat(tableFilters.valueMax)
      filtered = filtered.filter(item => item.value && item.value <= maxValue)
    }
    
    return filtered
  }, [collection?.items, searchQuery, tableSearchQuery, tableFilters])
  
  // Handlers
  const handleItemDelete = (item: CollectionItem) => {
    if (!collectionId) return
    
    try {
      bulkRemoveItems(collectionId, [item.id])
      toast({
        title: "Item removed",
        description: `"${item.name}" has been removed from the collection.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from collection.",
        variant: "destructive",
      })
    }
  }
  
  const handleBulkDelete = () => {
    if (!collectionId || selectedIds.size === 0) return
    
    try {
      bulkRemoveItems(collectionId, Array.from(selectedIds))
      toast({
        title: "Items removed",
        description: `${selectedIds.size} item(s) have been removed from the collection.`,
      })
      setSelectedIds(new Set())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove items from collection.",
        variant: "destructive",
      })
    }
  }
  
  const handleCreateCollectionFromSelected = () => {
    toast({
      title: "Coming soon",
      description: "Create collection from selected items will be available soon.",
    })
  }
  
  const handlePinSelected = () => {
    toast({
      title: "Coming soon", 
      description: "Pin selected items will be available soon.",
    })
  }
  
  if (!collection) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select a Collection</h2>
          <p className="text-muted-foreground">
            Choose a collection from the sidebar to view its details.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header Layout */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{collection.name}</h1>
                <span className="text-muted-foreground">·</span>
                <Badge variant="outline" className="text-xs">
                  {processedItems.length} items
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Created by {collection.type === "ai-generated" ? "AI Assistant" : "User"} • {new Date(collection.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setAddItemModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Items
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRulesModalOpen(true)}>
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Details Block */}
        <CollectionDetailsBlock 
          collection={collection} 
          items={processedItems}
          onOpenAIAssistant={() => {/* TODO: Open AI Assistant */}}
          onInsightClick={(actionType, data) => {
            if (actionType === 'filter') {
              // Apply filter based on insight data
              if (data.category) {
                setTableFilters(prev => ({ ...prev, category: data.category }))
              } else if (data.categories) {
                // For mixed categories, show all
                setTableFilters(prev => ({ ...prev, category: '' }))
              } else if (data.status) {
                setTableFilters(prev => ({ ...prev, status: data.status[0] }))
              } else if (data.filter === 'recent') {
                // Filter by recent items
                setTableFilters(prev => ({ 
                  ...prev, 
                  updated: '7d' // Assuming we have an updated filter
                }))
              }
              
              // Scroll to table
              setTimeout(() => {
                const tableElement = document.querySelector('[data-slot="table"]')
                if (tableElement) {
                  tableElement.scrollIntoView({ behavior: 'smooth' })
                }
              }, 100)
            }
          }}
        />
        
        {/* Table Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={layout === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLayout("grid")}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLayout("table")}
                className="rounded-none border-x"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Table Controls */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search table..."
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                className="pl-9 w-48"
              />
            </div>
            <Button 
              variant={showTableFilters ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setShowTableFilters(!showTableFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Table Filters
            </Button>
          </div>
        </div>
        
        {/* Table Filters Panel */}
        {showTableFilters && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium mb-2 block">Category</label>
                <select
                  value={tableFilters.category}
                  onChange={(e) => setTableFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                >
                  <option value="">All Categories</option>
                  <option value="Properties">Properties</option>
                  <option value="Aviation">Aviation</option>
                  <option value="Maritime">Maritime</option>
                  <option value="Legal entities">Legal entities</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-2 block">Status</label>
                <select
                  value={tableFilters.status}
                  onChange={(e) => setTableFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-2 block">Min Value</label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={tableFilters.valueMin}
                  onChange={(e) => setTableFilters(prev => ({ ...prev, valueMin: e.target.value }))}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium mb-2 block">Max Value</label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={tableFilters.valueMax}
                  onChange={(e) => setTableFilters(prev => ({ ...prev, valueMax: e.target.value }))}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {processedItems.length} items match filters
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTableFilters({ category: "", status: "", valueMin: "", valueMax: "" })
                  setTableSearchQuery("")
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
        
        {/* Items Display */}
        {layout === "grid" ? (
          <ItemsGrid
            items={processedItems}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onItemDelete={handleItemDelete}
            emptyMessage={
              searchQuery
                ? "No items match your search criteria"
                : "No items in this collection yet"
            }
          />
        ) : (
          <ItemsTable
            items={processedItems}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onItemDelete={handleItemDelete}
            onBulkDelete={handleBulkDelete}
            onBulkCreateCollection={handleCreateCollectionFromSelected}
            onBulkPin={handlePinSelected}
            emptyMessage={
              searchQuery
                ? "No items match your search criteria"
                : "No items in this collection yet"
            }
          />
        )}
      </div>

      {/* Rules Modal */}
      <RulesModal
        collection={collection}
        open={rulesModalOpen}
        onOpenChange={setRulesModalOpen}
      />

      {/* Add Item Modal */}
      <AddItemModal
        collectionId={collectionId}
        open={addItemModalOpen}
        onOpenChange={setAddItemModalOpen}
        onItemCreated={() => {
          // Refresh the collection data
          // This would typically trigger a refetch in a real app
          toast({
            title: "Success",
            description: "Collection updated with new item.",
          })
        }}
      />

      {/* Share Modal */}
      <ShareModal
        collection={collection}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </div>
  )
}
