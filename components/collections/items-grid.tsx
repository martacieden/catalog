"use client"

import * as React from "react"
import { CollectionItem } from "@/types/collection"
import { formatValue, formatRating, getCategoryColor, getStatusColor } from "@/lib/collection-utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Car,
  Plane,
  Ship,
  Users,
  Calendar,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Pin,
  Flag,
  Star,
} from "lucide-react"

interface ItemsGridProps {
  items: CollectionItem[]
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  onItemClick?: (item: CollectionItem) => void
  onItemEdit?: (item: CollectionItem) => void
  onItemDelete?: (item: CollectionItem) => void
  showSelection?: boolean
  showActions?: boolean
  emptyMessage?: string
}

const getItemIcon = (type: string) => {
  switch (type) {
    case "property":
      return <Building2 className="h-4 w-4" />
    case "vehicle":
      return <Car className="h-4 w-4" />
    case "aircraft":
      return <Plane className="h-4 w-4" />
    case "marine":
      return <Ship className="h-4 w-4" />
    default:
      return <Building2 className="h-4 w-4" />
  }
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
}: ItemsGridProps) {
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (!onSelectionChange) return

    const newSelection = new Set(selectedIds)
    if (checked) {
      newSelection.add(itemId)
    } else {
      newSelection.delete(itemId)
    }
    onSelectionChange(newSelection)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No items found</p>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className={`group cursor-pointer transition-all hover:shadow-md ${
            selectedIds.has(item.id) ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onItemClick?.(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {showSelection && (
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {getItemIcon(item.type)}
                </div>
              </div>
              
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onItemClick?.(item)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onItemEdit?.(item)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onItemDelete?.(item)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove from collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sm leading-tight mb-1">{item.name}</h3>
                {item.location && (
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">
                  {item.id}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: getCategoryColor(item.category) + '20', color: getCategoryColor(item.category) }}
                >
                  {item.category}
                </Badge>
              </div>

              {item.status && (
                <Badge 
                  variant="outline"
                  className="text-xs"
                  style={{ 
                    backgroundColor: getStatusColor(item.status) + '20', 
                    color: getStatusColor(item.status),
                    borderColor: getStatusColor(item.status) + '40'
                  }}
                >
                  {item.status}
                </Badge>
              )}

              <div className="flex items-center justify-between">
                {item.value && (
                  <span className="text-sm font-medium">{formatValue(item.value)}</span>
                )}
                {(item as any).rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{formatRating((item as any).rating)}</span>
                  </div>
                )}
              </div>

              {(item as any).updatedAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date((item as any).updatedAt).toLocaleDateString()}</span>
                </div>
              )}

              {item.pinned && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Pin className="h-3 w-3" />
                  <span>Pinned</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
