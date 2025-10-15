"use client"

import * as React from "react"
import { CollectionItem, CollectionSortOption } from "@/types/collection"
import { formatValue, getCategoryColor, getStatusColor, getCategoryIcon } from "@/lib/collection-utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
import { EmptyState } from "@/components/ui/empty-state"
import {
  Building2,
  Car,
  Plane,
  Ship,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Eye,
  Pin,
  Flag,
  X,
  Plus,
} from "lucide-react"

// Функція для отримання кольору фону категорії
const getCategoryBgColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    "Legal entities": "bg-blue-100",
    "Properties": "bg-green-100", 
    "Vehicles": "bg-orange-100",
    "Aviation": "bg-sky-100",
    "Maritime": "bg-cyan-100",
    "Organizations": "bg-purple-100",
    "Events": "bg-pink-100",
    "Pets": "bg-yellow-100",
    "Obligations": "bg-red-100",
  }
  return colorMap[category] || "bg-gray-100"
}

// Компонент для відображення в табличному вигляді (малий розмір)
const TableItemThumbnail = ({ item }: { item: any }) => {
  const CategoryIcon = getCategoryIcon(item.category)
  const bgColorClass = getCategoryBgColor(item.category)
  
  return (
    <div className={`relative h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center ${bgColorClass}`}>
      <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white shadow-sm">
        {CategoryIcon}
      </div>
    </div>
  )
}

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
  showBulkActions?: boolean
  emptyMessage?: string
  onBulkDelete?: () => void
  onBulkCreateCollection?: () => void
  onBulkAddToCollection?: () => void
  onBulkPin?: () => void
  onBulkExclude?: () => void
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
  showBulkActions = true,
  emptyMessage = "No items in this collection",
  onBulkDelete,
  onBulkCreateCollection,
  onBulkAddToCollection,
  onBulkPin,
  onBulkExclude,
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
      Organizations: Building2,
    }

    const IconComponent = icons[type as keyof typeof icons] || Building2
    return <IconComponent className="h-4 w-4" />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No items found"
        description={emptyMessage}
        size="default"
      />
    )
  }

  const selectedCount = selectedIds.size

  return (
    <div className="space-y-0">
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && showBulkActions && (
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

      {/* Table Container */}
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
            <TableHead>ID</TableHead>
            <TableHead
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Category
                {getSortIcon("status")}
              </div>
            </TableHead>
            <TableHead>Shared</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Created on</TableHead>
            <TableHead>Last update</TableHead>
            {showActions && <TableHead className="w-12"></TableHead>}
          </TableRow>
        </TableHeader>
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
                  <TableItemThumbnail item={item} />
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
                  {item.idCode || item.id || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.people && item.people.length > 0 ? (
                    <>
                      {item.people.slice(0, 2).map((person: any, i: number) => (
                        <div
                          key={i}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700"
                          title={`${person.role}: ${person.name}`}
                        >
                          {person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                      ))}
                      {item.people.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{item.people.length - 2}</span>
                      )}
                      <span className="text-xs text-muted-foreground ml-1">Shared</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span className="text-xs text-muted-foreground">Private</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                    {item.createdBy?.name ? item.createdBy.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'JM'}
                  </div>
                  <span className="text-sm">{item.createdBy?.name || 'James Mitchell'}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '2024-12-01'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.lastUpdated || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '2024-12-01')}
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
    </div>
  )
}

