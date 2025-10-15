"use client"

import * as React from "react"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
import { Collection, CollectionItem, CollectionSortOption, CollectionFilter } from "@/types/collection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CollectionDetailsBlock } from "./collections/collection-details-block"
import { ItemsTable } from "./collections/items-table"
import { ItemsGrid } from "./collections/items-grid"
import { AddItemModal } from "./collections/add-item-modal"
import { CollectionItemsManager } from "./collections/collection-items-manager"
import { AddItemsDialog } from "./collections/add-items-dialog"
import { SyncPreviewDialog } from "./collections/sync-preview-dialog"
import { CollectionAIAssistant } from "./collections/collection-ai-assistant"
import { ShareModal } from "./collections/share-modal"
import { RulesModal } from "./collections/rules-modal"
import { CollectionEditSidebar } from "./collections/collection-edit-sidebar"
import { CollectionsGrid } from "./collections/collections-grid"
import { CreateSubcollectionDialog } from "./collections/create-subcollection-dialog"
import { AvatarStack } from "./avatar-stack"
import { canCreateSubcollection } from "@/lib/collection-utils"
import {
  Filter,
  Search,
  Plus,
  Grid3x3,
  Square,
  Bot,
  Sparkles,
  Settings,
  Share2,
  Users,
  FileText,
  ChevronDown,
  Edit3,
} from "lucide-react"

interface CollectionDetailPanelProps {
  collectionId: string | null
  onClose: () => void
}

// UNIFIED PLACEHOLDER DATA - всі колекції показують однакові дані (9 items)
const PLACEHOLDER_ITEMS: CollectionItem[] = [
  {
    id: "placeholder-1",
    name: "Beachfront Villa Alpha",
    type: "property",
    category: "Properties",
    idCode: "VIL-ALPHA",
    status: "Active",
    location: "Virgin Gorda, BVI",
    value: 8500000,
    tags: ["luxury", "beachfront", "villa", "premium"],
    lastUpdated: "2024-01-20T14:30:00Z",
  },
  {
    id: "placeholder-2",
    name: "Private Jet Gulfstream",
    type: "aircraft",
    category: "Aviation",
    idCode: "AVI-001",
    status: "Active",
    location: "Miami International",
    value: 15000000,
    tags: ["private-jet", "gulfstream", "luxury-travel"],
    lastUpdated: "2024-12-08",
  },
  {
    id: "placeholder-3",
    name: "Luxury Yacht Serenity",
    type: "yacht",
    category: "Maritime",
    idCode: "MAR-001",
    status: "Active",
    location: "Monaco",
    value: 8000000,
    tags: ["yacht", "luxury", "mediterranean", "charter"],
    lastUpdated: "2024-12-15",
  },
  {
    id: "placeholder-4",
    name: "Corporate Headquarters",
    type: "property",
    category: "Properties",
    idCode: "HQ-001",
    status: "Active",
    location: "New York, NY",
    value: 25000000,
    tags: ["corporate", "headquarters", "commercial", "premium"],
    lastUpdated: "2024-01-18T09:15:00Z",
  },
  {
    id: "placeholder-5",
    name: "Mountain Resort Estate",
    type: "property",
    category: "Properties",
    idCode: "RES-001",
    status: "Active",
    location: "Aspen, Colorado",
    value: 12000000,
    tags: ["resort", "mountain", "luxury", "ski"],
    lastUpdated: "2024-01-15T10:20:00Z",
  },
  {
    id: "placeholder-6",
    name: "Helicopter Bell 429",
    type: "aircraft",
    category: "Aviation",
    idCode: "AVI-002",
    status: "Active",
    location: "Los Angeles, CA",
    value: 6000000,
    tags: ["helicopter", "luxury", "transport"],
    lastUpdated: "2024-01-12T16:45:00Z",
  },
  {
    id: "placeholder-7",
    name: "Superyacht Ocean Dream",
    type: "yacht",
    category: "Maritime",
    idCode: "MAR-002",
    status: "Active",
    location: "Fort Lauderdale, FL",
    value: 18000000,
    tags: ["superyacht", "luxury", "caribbean"],
    lastUpdated: "2024-01-10T12:30:00Z",
  },
  {
    id: "placeholder-8",
    name: "Tech Campus Building",
    type: "property",
    category: "Properties",
    idCode: "TECH-001",
    status: "Active",
    location: "San Francisco, CA",
    value: 35000000,
    tags: ["tech", "campus", "commercial", "innovation"],
    lastUpdated: "2024-01-08T14:15:00Z",
  },
  {
    id: "placeholder-9",
    name: "Business Jet Citation X",
    type: "aircraft",
    category: "Aviation",
    idCode: "AVI-003",
    status: "Active",
    location: "Boston, MA",
    value: 22000000,
    tags: ["business-jet", "citation", "long-range"],
    lastUpdated: "2024-01-05T09:00:00Z",
  },
]

export function CollectionDetailPanel({ collectionId, onClose }: CollectionDetailPanelProps) {
  const { 
    getCollectionById, 
    bulkRemoveItems, 
    updateCollection,
    toggleAutoSync,
    getCollectionStats,
    createSubcollection,
    getSubcollections,
    getCollectionPath,
    moveItemsToSubcollection,
  } = useCollections()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = React.useState(false)
  
  // Get collection and setup history
  const originalCollection = collectionId && isMounted ? getCollectionById(collectionId) : null
  
  // UNIFIED COLLECTION - всі колекції показують однакову назву та items
  const collection = originalCollection ? {
    ...originalCollection,
    name: "High Value Assets",
    description: "Premium assets worth over $1M with high ratings and active status. This smart collection automatically includes properties, aviation, and maritime assets that meet our premium criteria.",
    items: PLACEHOLDER_ITEMS,
    itemCount: PLACEHOLDER_ITEMS.length,
  } : null
  
  // State
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [layout, setLayout] = React.useState<"table" | "grid" | "list">("table")
  const [sortOption, setSortOption] = React.useState<CollectionSortOption>({
    field: "name",
    direction: "asc",
  })
  const [showFilters, setShowFilters] = React.useState(false)
  
  // Filters state
  const [filters, setFilters] = React.useState<CollectionFilter>({
    categories: [],
    tags: [],
    status: [],
    search: "",
  })
  
  // Dialog states
  const [addItemModalOpen, setAddItemModalOpen] = React.useState(false)
  const [itemsManagerOpen, setItemsManagerOpen] = React.useState(false)
  const [addItemsDialogOpen, setAddItemsDialogOpen] = React.useState(false)
  const [syncPreviewOpen, setSyncPreviewOpen] = React.useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = React.useState(false)
  const [selectedInsight, setSelectedInsight] = React.useState<any>(null)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [rulesModalOpen, setRulesModalOpen] = React.useState(false)
  const [editSidebarOpen, setEditSidebarOpen] = React.useState(false)
  const [createSubcollectionOpen, setCreateSubcollectionOpen] = React.useState(false)
  
  // Subcollections data
  const subcollections = React.useMemo(() => {
    return collectionId ? getSubcollections(collectionId) : []
  }, [collectionId, getSubcollections])
  
  const collectionPath = React.useMemo(() => {
    return collectionId ? getCollectionPath(collectionId) : []
  }, [collectionId, getCollectionPath])
  
  // Mock users for avatar stack
  const sharedUsers = [
    {
      id: "user-1",
      name: "John Smith",
      email: "john.smith@company.com",
      avatar: undefined,
      role: "owner" as const
    },
    {
      id: "user-2", 
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      avatar: undefined,
      role: "editor" as const
    },
    {
      id: "user-3",
      name: "Bob Wilson",
      email: "bob.wilson@company.com", 
      avatar: undefined,
      role: "viewer" as const
    },
    {
      id: "user-4",
      name: "Sarah Davis",
      email: "sarah.davis@company.com",
      avatar: undefined,
      role: "viewer" as const
    }
  ]
  
  // Table specific state
  const [tableSearchQuery, setTableSearchQuery] = React.useState("")
  const [tableFilters, setTableFilters] = React.useState({
    category: "",
    status: "",
    valueMin: "",
    valueMax: "",
  })
  const [showTableFilters, setShowTableFilters] = React.useState(false)
  
  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  
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
      description: "Create new collection from selected items will be available soon.",
    })
  }
  
  const handleAddToCollection = () => {
    toast({
      title: "Coming soon",
      description: "Add selected items to existing collection will be available soon.",
    })
  }
  
  const handlePinSelected = () => {
    toast({
      title: "Coming soon", 
      description: "Pin selected items will be available soon.",
    })
  }
  


  const handleSyncNow = () => {
    if (!collection?.autoSync || !collection?.filters || collection.filters.length === 0) {
      toast({
        title: "Cannot sync",
        description: "Please enable auto-sync and configure rules first.",
        variant: "destructive",
      })
      return
    }
    setSyncPreviewOpen(true)
  }

  // AI Assistant handlers
  const handleAIAssistantAddItems = () => {
    setAddItemModalOpen(true)
  }

  const handleAIAssistantSyncNow = () => {
    handleSyncNow()
  }

  const handleAIAssistantAnalyze = () => {
    toast({
      title: "Analysis complete",
      description: "Collection analysis has been completed.",
    })
  }

  const handleAIAssistantSuggestRules = () => {
    toast({
      title: "Coming soon",
      description: "Rules suggestion will be available soon.",
    })
  }

  const handleAIAssistantExport = () => {
    toast({
      title: "Coming soon",
      description: "Export functionality will be available soon.",
    })
  }

  const handleOpenAIAssistant = (insightData?: any) => {
    setSelectedInsight(insightData)
    setAiAssistantOpen(true)
  }

  const handleSaveCollection = (updatedCollection: Partial<Collection>) => {
    if (!collectionId) return
    
    try {
      updateCollection(collectionId, updatedCollection)
      toast({
        title: "Collection updated",
        description: "Collection details have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection.",
        variant: "destructive",
      })
    }
  }

  // Subcollections handlers
  const handleCreateSubcollection = (data: { name: string; description?: string; type: any; icon: string }) => {
    if (!collectionId) return

    try {
      const newSubcollection = createSubcollection(collectionId, {
        name: data.name,
        description: data.description,
        icon: data.icon,
        type: data.type,
        autoSync: data.type === "smart",
        items: [],
        filters: [],
        isPublic: false,
        sharedWith: [],
        viewCount: 0,
        createdBy: collection!.createdBy,
        updatedAt: new Date(),
      })

      toast({
        title: "Subcollection created",
        description: `"${newSubcollection.name}" has been created successfully.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create subcollection.",
        variant: "destructive",
      })
    }
  }

  const handleOpenSubcollection = (subcollectionId: string) => {
    // Navigate to subcollection - reuse current panel
    // In a real app, this would update the URL/route
    window.location.hash = `collection/${subcollectionId}`
    // For now, just show toast
    toast({
      title: "Opening subcollection",
      description: "Navigation will be implemented in routing.",
    })
  }

  const handleEditSubcollection = (subcollection: Collection) => {
    // TODO: Open edit dialog for subcollection
    toast({
      title: "Coming soon",
      description: "Edit subcollection functionality will be available soon.",
    })
  }

  const handleDeleteSubcollection = (subcollection: Collection) => {
    // TODO: Open delete confirmation dialog
    toast({
      title: "Coming soon",
      description: "Delete subcollection functionality will be available soon.",
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
                <h1 className="text-lg font-semibold">
                  {collection.isSubcollection && collectionPath.length > 1 
                    ? `${collectionPath[0].name} > ${collection.name}`
                    : collection.name
                  }
                </h1>
                <span className="text-muted-foreground">·</span>
                <Badge variant="outline" className="text-xs">
                  {processedItems.length} items
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Created by {collection.type === "ai-generated" ? "AI Assistant" : "User"} • {collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Action Buttons */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditSidebarOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            {/* Avatar Stack */}
            <AvatarStack 
              users={sharedUsers}
              maxVisible={3}
              size="sm"
              className="ml-2"
            />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setRulesModalOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Rule
            </Button>
            
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setAddItemModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Items
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
          onOpenAIAssistant={handleOpenAIAssistant}
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

        {/* Collections Section */}
        {subcollections.length > 0 && (
          <CollectionsGrid
            parentCollection={collection}
            subcollections={subcollections}
            onOpenSubcollection={handleOpenSubcollection}
            onEditSubcollection={handleEditSubcollection}
            onDeleteSubcollection={handleDeleteSubcollection}
            layout="grid"
            showHeader={true}
          />
        )}

        
        {/* Table Controls */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <div className="flex items-center gap-2">
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
              <Square className="h-4 w-4" />
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
            onItemDelete={(id) => {
              const item = processedItems.find(i => i.id === id)
              if (item) handleItemDelete(item)
            }}
            onBulkRemove={handleBulkDelete}
            onBulkCreateCollection={handleCreateCollectionFromSelected}
            onBulkAddToCollection={handleAddToCollection}
            onBulkPin={handlePinSelected}
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
            onBulkRemove={handleBulkDelete}
            onBulkCreateCollection={handleCreateCollectionFromSelected}
            onBulkAddToCollection={handleAddToCollection}
            onBulkPin={handlePinSelected}
            emptyMessage={
              searchQuery
                ? "No items match your search criteria"
                : "No items in this collection yet"
            }
          />
        )}
      </div>

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


      {/* Collection Items Manager */}
      {collectionId && (
        <CollectionItemsManager
          collectionId={collectionId}
          open={itemsManagerOpen}
          onOpenChange={setItemsManagerOpen}
        />
      )}

      {/* Add Items Dialog */}
      {collectionId && (
        <AddItemsDialog
          collectionId={collectionId}
          open={addItemsDialogOpen}
          onOpenChange={setAddItemsDialogOpen}
        />
      )}

      {/* Sync Preview Dialog */}
      {collectionId && (
        <SyncPreviewDialog
          collectionId={collectionId}
          open={syncPreviewOpen}
          onOpenChange={setSyncPreviewOpen}
          onConfirm={() => {
            toast({
              title: "Sync completed",
              description: "Collection has been updated.",
            })
          }}
        />
      )}

      {/* AI Assistant */}
      {collectionId && (
        <CollectionAIAssistant
          collectionId={collectionId}
          open={aiAssistantOpen}
          onOpenChange={setAiAssistantOpen}
          onAddItems={handleAIAssistantAddItems}
          onSyncNow={handleAIAssistantSyncNow}
          onAnalyze={handleAIAssistantAnalyze}
          onSuggestRules={handleAIAssistantSuggestRules}
          onExport={handleAIAssistantExport}
          initialInsightData={selectedInsight}
        />
      )}

      {/* Share Modal */}
      {collection && (
        <ShareModal
          collection={collection}
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
        />
      )}

      {/* Rules Modal */}
      {collection && (
        <RulesModal
          collection={collection}
          open={rulesModalOpen}
          onOpenChange={setRulesModalOpen}
          onSave={async (rules) => {
            // TODO: Implement save logic
            console.log('Saving rules:', rules)
            // Here you would typically call an API to save the rules
            // await updateCollectionRules(collection.id, rules)
          }}
        />
      )}


      {/* Collection Edit Sidebar */}
      {collection && (
        <CollectionEditSidebar
          collection={collection}
          open={editSidebarOpen}
          onOpenChange={setEditSidebarOpen}
          onSave={handleSaveCollection}
        />
      )}

      {/* Create Subcollection Dialog */}
      {collection && (
        <CreateSubcollectionDialog
          open={createSubcollectionOpen}
          onOpenChange={setCreateSubcollectionOpen}
          parentCollection={collection}
          onCreateSubcollection={handleCreateSubcollection}
        />
      )}
    </div>
  )
}
