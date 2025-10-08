"use client"

import * as React from "react"
import { CollectionItem, CollectionSortOption } from "@/types/collection"
import { formatValue, formatRating, getCategoryColor, getStatusColor } from "@/lib/collection-utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Building2,
  Car,
  Plane,
  Ship,
  Users,
  Calendar,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Eye,
  Pin,
  Flag,
  Star,
  X,
  Plus,
} from "lucide-react"

interface ItemsTableProps {
  items: CollectionItem[]
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  sortOption?: CollectionSortOption
  onSortChange?: (option: CollectionSortOption) => void
  onItemClick?: (item: CollectionItem) => void
  onItemEdit?: (item: CollectionItem) => void
  onItemDelete?: (item: CollectionItem) => void
  showSelection?: boolean
  showActions?: boolean
  emptyMessage?: string
  onBulkDelete?: () => void
  onBulkCreateCollection?: () => void
  onBulkPin?: () => void
}

export function ItemsTable({
  items,
  selectedIds = new Set(),
  onSelectionChange,
  sortOption = { field: "name", direction: "asc" },
  onSortChange,
  onItemClick,
  onItemEdit,
  onItemDelete,
  showSelection = true,
  showActions = true,
  emptyMessage = "No items in this collection",
  onBulkDelete,
  onBulkCreateCollection,
  onBulkPin,
}: ItemsTableProps) {
  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id))
  const someSelected = items.some((item) => selectedIds.has(item.id)) && !allSelected

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return

    if (checked) {
      onSelectionChange(new Set(items.map((item) => item.id)))
    } else {
      onSelectionChange(new Set())
    }
  }

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

  const handleSort = (field: CollectionSortOption["field"]) => {
    if (!onSortChange) return

    const newDirection =
      sortOption.field === field && sortOption.direction === "asc" ? "desc" : "asc"

    onSortChange({ field, direction: newDirection })
  }

  const getSortIcon = (field: CollectionSortOption["field"]) => {
    if (sortOption.field !== field) return null

    return sortOption.direction === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    )
  }

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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {showSelection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el && "indeterminate" in el) {
                      (el as any).indeterminate = someSelected
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            <TableHead
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Name
                {getSortIcon("name")}
              </div>
            </TableHead>
            <TableHead>ID Code</TableHead>
            <TableHead
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Category
                {getSortIcon("status")}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              className="cursor-pointer select-none hover:bg-gray-50"
              onClick={() => handleSort("value")}
            >
              <div className="flex items-center">
                Value
                {getSortIcon("value")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:bg-gray-50"
              onClick={() => handleSort("rating")}
            >
              <div className="flex items-center">
                Rating
                {getSortIcon("rating")}
              </div>
            </TableHead>
            <TableHead>People</TableHead>
            <TableHead
              className="cursor-pointer select-none hover:bg-gray-50"
              onClick={() => handleSort("updatedAt")}
            >
              <div className="flex items-center">
                Updated
                {getSortIcon("updatedAt")}
              </div>
            </TableHead>
            {showActions && <TableHead className="w-12"></TableHead>}
          </TableRow>
        </TableHeader>
        {/* Bulk Actions Row */}
        {selectedIds.size > 0 && (
          <TableRow className="bg-blue-50 border-b-2 border-blue-200">
            <TableCell colSpan={showSelection ? (showActions ? 10 : 9) : (showActions ? 9 : 8)} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedIds.size} items selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectionChange?.(new Set())}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear selection
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {onBulkCreateCollection && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onBulkCreateCollection}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create new collection
                    </Button>
                  )}
                  {onBulkPin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onBulkPin}
                    >
                      <Pin className="mr-2 h-4 w-4" />
                      Pin items
                    </Button>
                  )}
                  {onBulkDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onBulkDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete items
                    </Button>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="group cursor-pointer"
              onClick={() => onItemClick?.(item)}
            >
              {showSelection && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    {getItemIcon(item.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                    {item.location && (
                      <span className="text-xs text-muted-foreground">{item.location}</span>
                    )}
                  </div>
                  {item.flagged && <Flag className="h-3 w-3 text-red-500" />}
                  {item.pinned && <Pin className="h-3 w-3 text-blue-500" />}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200">
                  {item.idCode || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
              </TableCell>
              <TableCell>
                {item.status && (
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {item.value ? (
                  <span className="text-sm font-medium">{formatValue(item.value, item.currency)}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {item.guestRating || item.internalRating ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {(item.guestRating || item.internalRating)?.toFixed(1)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {item.people && item.people.length > 0 ? (
                  <div className="flex items-center -space-x-2">
                    {item.people.slice(0, 3).map((person, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={person.avatar} />
                        <AvatarFallback className="text-xs">
                          {person.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {item.people.length > 3 && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs">
                        +{item.people.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {item.lastUpdated && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                  </div>
                )}
              </TableCell>
              {showActions && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onItemClick?.(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onItemEdit?.(item)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onItemDelete?.(item)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

