"use client"

import * as React from "react"
import { CollectionItem } from "@/types/collection"
import { formatValue, CardItemThumbnail } from "@/lib/collection-utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/ui/empty-state"
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Pin,
  Flag,
  X,
  Plus,
} from "lucide-react"

interface ItemsGridProps {
  items: CollectionItem[]
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  onItemClick?: (item: CollectionItem) => void
  onItemEdit?: (item: CollectionItem) => void
  onItemDelete?: (id: string) => void
  showSelection?: boolean
  showActions?: boolean
  emptyMessage?: string
  onBulkDelete?: () => void
  onBulkCreateCollection?: () => void
  onBulkAddToCollection?: () => void
  onBulkPin?: () => void
}

export function ItemsGrid({
  items,
  selectedIds = new Set(),
  onSelectionChange,
  onItemClick,
  onItemEdit,
  onItemDelete,
  showSelection = true,
  showActions = true,
  emptyMessage = "No items in this collection",
  onBulkDelete,
  onBulkCreateCollection,
  onBulkAddToCollection,
  onBulkPin,
}: ItemsGridProps) {
  
  const handleSelectItem = (id: string, checked: boolean) => {
    if (!onSelectionChange) return
    
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    onSelectionChange(newSelected)
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No items"
        description={emptyMessage}
        icon={Eye}
      />
    )
  }

  const selectedCount = selectedIds.size

  return (
    <div className="space-y-0">
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="sticky top-0 z-10 -mt-2 mb-4 rounded-lg border border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-4 py-3 shadow-sm">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium">
                {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
              </span>
              <Button variant="ghost" size="sm" onClick={() => onSelectionChange?.(new Set())}>
                <X className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Clear selection</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {onBulkCreateCollection && (
                <Button variant="outline" size="sm" onClick={onBulkCreateCollection}>
                  <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create new collection</span>
                  <span className="sm:hidden">New</span>
                </Button>
              )}
              {onBulkAddToCollection && (
                <Button variant="outline" size="sm" onClick={onBulkAddToCollection}>
                  <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add to collection</span>
                  <span className="sm:hidden">Add to</span>
                </Button>
              )}
              {onBulkPin && (
                <Button variant="outline" size="sm" onClick={onBulkPin}>
                  <Pin className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Pin items</span>
                  <span className="sm:hidden">Pin</span>
                </Button>
              )}
              {onBulkDelete && (
                <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                  <span className="hidden sm:inline">Remove items</span>
                  <span className="sm:hidden">Remove</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-sm ${
            selectedIds.has(item.id) ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onItemClick?.(item)}
        >
          {/* Checkbox in top left (visible on hover or when selected) */}
          <div
            className={`absolute left-4 top-4 z-10 transition-opacity ${
              selectedIds.has(item.id)
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {showSelection && (
              <Checkbox
                checked={selectedIds.has(item.id)}
                onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
          
          {/* Actions menu in top right */}
          <div className="absolute right-4 top-4 z-10">
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onItemClick?.(item) }}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onItemEdit?.(item) }}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onItemDelete?.(item.id) }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Vertical layout with centered photo/icon */}
          <div className="space-y-3 mt-2">
            {/* Photo/Icon section */}
            <CardItemThumbnail item={item} />
            
            {/* Main content */}
            <div className="space-y-2 px-2">
              {/* Title and ID */}
              <div>
                <h3 className="font-semibold text-sm leading-tight text-foreground">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
              </div>
              
              {/* Category */}
              <div>
                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                {item.pinned && <Pin className="inline h-3 w-3 text-muted-foreground ml-2" />}
                {item.flagged && <Flag className="inline h-3 w-3 text-red-500 ml-2" />}
              </div>
              
              {/* Bottom section with value and date */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  {item.value && (
                    <span className="text-sm font-medium">{formatValue(item.value)}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}