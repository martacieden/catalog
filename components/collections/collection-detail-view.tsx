"use client"

import * as React from "react"
import { Collection, CollectionItem, CollectionSortOption, CollectionFilter } from "@/types/collection"
import { useCollections } from "@/contexts/collections-context"
import { useCollectionHistory } from "@/hooks/use-collection-history"
import { filterItems, sortItems, searchItems, formatItemCount } from "@/lib/collection-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemsTable } from "./items-table"
import { CollectionEditDialog } from "./collection-edit-dialog"
import { RemoveCollectionDialog } from "../remove-collection-dialog"
import { CollectionItemsManager } from "./collection-items-manager"
import { AddItemsDialog } from "./add-items-dialog"
import { SyncPreviewDialog } from "./sync-preview-dialog"
import { CollectionAIAssistant } from "./collection-ai-assistant"
import { CollectionDetailsBlock } from "./collection-details-block"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Trash2,
  Tag,
  Edit3,
  Share2,
  Sparkles,
  Undo2,
  Redo2,
  Download,
  Grid3x3,
  List,
  Settings,
  RotateCcw,
  Bot,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface CollectionDetailViewProps {
  collectionId: string
  onClose?: () => void
}

export function CollectionDetailView({ collectionId, onClose }: CollectionDetailViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    getCollectionById,
    updateCollection,
    removeItemFromCollection,
    removeCollection,
    duplicateCollection,
    bulkRemoveItems,
    toggleAutoSync,
    getCollectionStats,
  } = useCollections()

  const collection = getCollectionById(collectionId)
  const { undo, redo, canUndo, canRedo, snapshot } = useCollectionHistory(collection)

  // View state
  const [layout, setLayout] = React.useState<"grid" | "list" | "table">("list")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortOption, setSortOption] = React.useState<CollectionSortOption>({
    field: "name",
    direction: "asc",
  })
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = React.useState(false)

  // Filters state
  const [filters, setFilters] = React.useState<CollectionFilter>({
    categories: [],
    tags: [],
    status: [],
    search: "",
  })

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [itemsManagerOpen, setItemsManagerOpen] = React.useState(false)
  const [addItemsDialogOpen, setAddItemsDialogOpen] = React.useState(false)
  const [syncPreviewOpen, setSyncPreviewOpen] = React.useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = React.useState(false)

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-muted-foreground mb-4">Collection not found</p>
        <Button onClick={() => router.push("/catalog?view=dashboard")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const items = collection.items || []
  const stats = getCollectionStats(collectionId)

  // Filter and sort items
  const processedItems = React.useMemo(() => {
    let result = items

    // Apply search
    if (searchQuery) {
      result = searchItems(result, searchQuery)
    }

    // Apply filters
    if (filters.categories?.length || filters.tags?.length || filters.status?.length) {
      result = filterItems(result, filters)
    }

    // Apply sort
    result = sortItems(result, sortOption)

    return result
  }, [items, searchQuery, filters, sortOption])

  const handleBack = () => {
    if (onClose) {
      onClose()
    } else {
      router.push("/catalog?view=dashboard")
    }
  }

  const handleAutoSyncToggle = () => {
    snapshot(true)
    toggleAutoSync(collectionId)
    toast({
      title: collection.autoSync ? "Auto-sync disabled" : "Auto-sync enabled",
      description: collection.autoSync
        ? "The collection will no longer update automatically."
        : "The collection will now update automatically based on rules.",
    })
  }

  const handleItemDelete = (item: CollectionItem) => {
    snapshot(true)
    removeItemFromCollection(collectionId, item.id)
    toast({
      title: "Item removed",
      description: `"${item.name}" has been removed from the collection.`,
    })
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return

    snapshot(true)
    bulkRemoveItems(collectionId, Array.from(selectedIds))
    toast({
      title: "Items removed",
      description: `${selectedIds.size} item(s) have been removed from the collection.`,
    })
    setSelectedIds(new Set())
  }

  const handleCreateCollectionFromSelected = () => {
    // TODO: Implement create collection from selected items
    toast({
      title: "Coming soon",
      description: "Create collection from selected items will be available soon.",
    })
  }

  const handlePinSelected = () => {
    // TODO: Implement pin selected items
    toast({
      title: "Coming soon", 
      description: "Pin selected items will be available soon.",
    })
  }

  const handleUndo = () => {
    const previousState = undo()
    if (previousState) {
      updateCollection(collectionId, previousState.data)
      toast({
        title: "Undo successful",
        description: "Previous state restored.",
      })
    }
  }

  const handleRedo = () => {
    const nextState = redo()
    if (nextState) {
      updateCollection(collectionId, nextState.data)
      toast({
        title: "Redo successful",
        description: "State restored.",
      })
    }
  }

  const handleExport = () => {
    // TODO: Implement export
    toast({
      title: "Coming soon",
      description: "Export functionality will be available soon.",
    })
  }

  const handleShare = () => {
    // TODO: Implement sharing
    toast({
      title: "Coming soon",
      description: "Sharing functionality will be available soon.",
    })
  }

  const handleDuplicate = () => {
    const duplicated = duplicateCollection(collectionId)
    if (duplicated) {
      toast({
        title: "Collection duplicated",
        description: `Created a copy of "${duplicated.name}"`,
      })
    }
  }

  const handleDelete = () => {
    removeCollection(collectionId)
    toast({
      title: "Collection deleted",
      description: `"${collection.name}" has been deleted.`,
    })
    handleBack()
  }

  const handleSyncNow = () => {
    if (!collection.autoSync || !collection.filters || collection.filters.length === 0) {
      toast({
        title: "Cannot sync",
        description: "Please enable auto-sync and configure rules first.",
        variant: "destructive",
      })
      return
    }
    setSyncPreviewOpen(true)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Simplified Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{collection.name}</h1>
              <Badge variant="outline" className="text-xs">
                {items.length} items
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canUndo && (
              <Button variant="outline" size="sm" onClick={handleUndo}>
                <Undo2 className="h-4 w-4 mr-2" />
                Undo
              </Button>
            )}
            {canRedo && (
              <Button variant="outline" size="sm" onClick={handleRedo}>
                <Redo2 className="h-4 w-4 mr-2" />
                Redo
              </Button>
            )}
            
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filter */}
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Sort */}
            <Select
              value={sortOption.field}
              onValueChange={(value) =>
                setSortOption({
                  field: value as CollectionSortOption["field"],
                  direction: sortOption.direction,
                })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="updatedAt">Updated</SelectItem>
                <SelectItem value="value">Value</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOption({
                  ...sortOption,
                  direction: sortOption.direction === "asc" ? "desc" : "asc",
                })
              }
            >
              {sortOption.direction === "asc" ? "↑" : "↓"}
            </Button>

            {/* Auto-sync */}
            <div className="flex items-center gap-2 border-l pl-4 ml-4">
              <Switch
                id="auto-sync"
                checked={collection.autoSync}
                onCheckedChange={handleAutoSyncToggle}
              />
              <Label htmlFor="auto-sync" className="text-sm cursor-pointer">
                Auto-sync
              </Label>
            </div>
          </div>

          {/* Actions divided by scope */}
          <div className="flex items-center gap-4">
            {/* View Controls */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={layout === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLayout("table")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLayout("grid")}
                className="rounded-none border-x"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>

            {/* Table/Items Actions */}
            <div className="flex items-center gap-2 border-r pr-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItemsManagerOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>

              {collection.autoSync && collection.filters && collection.filters.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncNow}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sync
                </Button>
              )}

              <Button size="sm" onClick={() => setAddItemsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Items
              </Button>
            </div>

            {/* Collection Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicate}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Duplicate
              </Button>

              <RemoveCollectionDialog
                collectionName={collection.name}
                onConfirm={handleDelete}
                trigger={
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs mb-2">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="aviation">Aviation</SelectItem>
                    <SelectItem value="maritime">Maritime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-2">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-2">Tags</Label>
                <Input placeholder="Filter by tags..." />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
                Clear filters
              </Button>
              <span className="text-xs text-muted-foreground">
                {processedItems.length} of {items.length} items shown
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Details Block */}
        <CollectionDetailsBlock 
          collection={collection} 
          items={processedItems}
          onOpenAIAssistant={() => setAiAssistantOpen(true)}
          onInsightClick={(actionType, data) => {
            if (actionType === 'filter') {
              // Apply filter based on insight data
              if (data.category) {
                setFilters(prev => ({ ...prev, categories: [data.category] }))
              } else if (data.categories) {
                // For mixed categories, show all
                setFilters(prev => ({ ...prev, categories: [] }))
              } else if (data.status) {
                setFilters(prev => ({ ...prev, status: data.status }))
              } else if (data.filter === 'recent') {
                // Filter by recent items
                setFilters(prev => ({ ...prev, recent: true }))
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
        
        {/* Items Table */}
        <ItemsTable
          items={processedItems}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onItemDelete={handleItemDelete}
          onBulkDelete={handleBulkDelete}
          onBulkCreateCollection={handleCreateCollectionFromSelected}
          onBulkPin={handlePinSelected}
          emptyMessage={
            searchQuery || filters.categories?.length
              ? "No items match your search criteria"
              : "No items in this collection yet"
          }
        />
      </div>

      {/* Dialogs */}
      {collection && (
        <>
          <CollectionEditDialog
            collection={collection}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <CollectionItemsManager
            collectionId={collectionId}
            open={itemsManagerOpen}
            onOpenChange={setItemsManagerOpen}
          />
          <AddItemsDialog
            collectionId={collectionId}
            open={addItemsDialogOpen}
            onOpenChange={setAddItemsDialogOpen}
          />
          <SyncPreviewDialog
            collectionId={collectionId}
            open={syncPreviewOpen}
            onOpenChange={setSyncPreviewOpen}
          />
          <CollectionAIAssistant
            collectionId={collectionId}
            open={aiAssistantOpen}
            onOpenChange={setAiAssistantOpen}
            onAddItems={() => {
              setAiAssistantOpen(false)
              setAddItemsDialogOpen(true)
            }}
            onSyncNow={() => {
              setAiAssistantOpen(false)
              handleSyncNow()
            }}
            onAnalyze={() => {
              // TODO: Implement analyze
              toast({
                title: "Coming soon",
                description: "Detailed analytics will be available soon",
              })
            }}
            onSuggestRules={() => {
              setAiAssistantOpen(false)
              setEditDialogOpen(true)
              // TODO: Switch to rules tab
            }}
            onExport={handleExport}
          />
        </>
      )}
    </div>
  )
}

