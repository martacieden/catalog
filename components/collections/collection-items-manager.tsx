"use client"

import * as React from "react"
import { CollectionItem } from "@/types/collection"
import { useCollections } from "@/contexts/collections-context"
import { Button } from "@/components/ui/button"
import { ManualCollectionDialog } from "@/components/manual-collection-dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Plus,
  Search,
  GripVertical,
  Trash2,
  Edit3,
  MoreHorizontal,
  Building2,
  Car,
  Plane,
  Ship,
  Users,
  Save,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCategoryColor } from "@/lib/collection-utils"
import { AddItemsDialog } from "./add-items-dialog"

interface CollectionItemsManagerProps {
  collectionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DraggableItemProps {
  item: CollectionItem
  index: number
  isDragging: boolean
  onDragStart: (index: number) => void
  onDragEnd: () => void
  onDragOver: (index: number) => void
  onEdit: (item: CollectionItem) => void
  onDelete: (item: CollectionItem) => void
  isSelected: boolean
  onSelect: (checked: boolean) => void
}

function DraggableItem({
  item,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
}: DraggableItemProps) {
  const getItemIcon = (type: string) => {
    const icons = {
      Properties: Building2,
      Vehicles: Car,
      Aviation: Plane,
      Maritime: Ship,
      Organizations: Users,
    }
    const IconComponent = icons[type as keyof typeof icons] || Building2
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <div
      className={`group flex items-center gap-3 p-3 border rounded-lg bg-white transition-all ${
        isDragging ? "opacity-50 scale-95" : "hover:bg-gray-50"
      } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(index)
      }}
    >
      {/* Drag Handle */}
      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Checkbox */}
      <Checkbox checked={isSelected} onCheckedChange={onSelect} onClick={(e) => e.stopPropagation()} />

      {/* Icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
        {getItemIcon(item.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{item.name}</span>
          {item.idCode && (
            <Badge variant="outline" className="text-xs font-mono shrink-0">
              {item.idCode}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
            {item.category}
          </Badge>
          {item.status && (
            <span className="text-xs text-muted-foreground">{item.status}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(item)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function CollectionItemsManager({
  collectionId,
  open,
  onOpenChange,
}: CollectionItemsManagerProps) {
  const { getCollectionById, reorderItems, removeItemFromCollection } = useCollections()
  const { toast } = useToast()

  const collection = getCollectionById(collectionId)
  const [items, setItems] = React.useState<CollectionItem[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [hasChanges, setHasChanges] = React.useState(false)
  const [addItemsDialogOpen, setAddItemsDialogOpen] = React.useState(false)

  // Initialize items from collection
  React.useEffect(() => {
    if (collection?.items) {
      setItems([...collection.items].sort((a, b) => (a.order || 0) - (b.order || 0)))
      setHasChanges(false)
    }
  }, [collection, open])

  if (!collection) return null

  // Filter items by search
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return items

    const query = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.idCode?.toLowerCase().includes(query)
    )
  }, [items, searchQuery])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDragOver = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)

    setItems(newItems)
    setDraggedIndex(targetIndex)
    setHasChanges(true)
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelection = new Set(selectedIds)
    if (checked) {
      newSelection.add(itemId)
    } else {
      newSelection.delete(itemId)
    }
    setSelectedIds(newSelection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredItems.map((item) => item.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleDeleteItem = (item: CollectionItem) => {
    setItems(items.filter((i) => i.id !== item.id))
    setHasChanges(true)
    toast({
      title: "Item removed",
      description: `"${item.name}" will be removed when you save.`,
    })
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return

    setItems(items.filter((item) => !selectedIds.has(item.id)))
    setSelectedIds(new Set())
    setHasChanges(true)
    toast({
      title: "Items removed",
      description: `${selectedIds.size} item(s) will be removed when you save.`,
    })
  }

  const handleSave = () => {
    // Update order for all items
    const itemIds = items.map((item) => item.id)
    reorderItems(collectionId, itemIds)

    // Remove items that were deleted
    const currentItemIds = new Set(items.map((item) => item.id))
    const originalItemIds = new Set((collection.items || []).map((item) => item.id))
    
    originalItemIds.forEach((id) => {
      if (!currentItemIds.has(id)) {
        removeItemFromCollection(collectionId, id)
      }
    })

    toast({
      title: "Changes saved",
      description: "Item order has been updated.",
    })

    setHasChanges(false)
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      )
      if (!confirmed) return
    }
    onOpenChange(false)
  }

  const allSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedIds.has(item.id))
  const someSelected = filteredItems.some((item) => selectedIds.has(item.id)) && !allSelected

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Manage Items</DialogTitle>
          <DialogDescription>
            Reorder items by dragging, or remove items from the collection
          </DialogDescription>
        </DialogHeader>

        {/* Search & Bulk Actions */}
        <div className="px-6 py-3 border-b space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button size="sm" variant="outline" onClick={() => setAddItemsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Items
            </Button>
          </div>

          {/* Bulk Actions Bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el && "indeterminate" in el) {
                      (el as any).indeterminate = someSelected
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ManualCollectionDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Collection
                    </Button>
                  }
                  selectedItems={Array.from(selectedIds)}
                />
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-2 py-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  index={index}
                  isDragging={draggedIndex === index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onEdit={() => {}}
                  onDelete={handleDeleteItem}
                  isSelected={selectedIds.has(item.id)}
                  onSelect={(checked) => handleSelectItem(item.id, checked)}
                />
              ))
            ) : (
              <EmptyState
                icon={Building2}
                title="No items found"
                description={searchQuery ? "No items match your search" : "No items in this collection"}
                size="default"
              />
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} total
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Add Items Dialog */}
      <AddItemsDialog
        collectionId={collectionId}
        open={addItemsDialogOpen}
        onOpenChange={setAddItemsDialogOpen}
      />
    </Dialog>
  )
}

