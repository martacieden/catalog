"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Folder,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  ChevronRight,
  Grid3X3,
  List,
} from "lucide-react"

interface CollectionsGridProps {
  parentCollection: Collection
  subcollections: Collection[]
  onOpenSubcollection: (subcollectionId: string) => void
  onEditSubcollection?: (subcollection: Collection) => void
  onDeleteSubcollection?: (subcollection: Collection) => void
  layout?: "grid" | "list"
  showHeader?: boolean
}

export function CollectionsGrid({
  parentCollection,
  subcollections,
  onOpenSubcollection,
  onEditSubcollection,
  onDeleteSubcollection,
  layout = "grid",
  showHeader = true,
}: CollectionsGridProps) {
  const [viewLayout, setViewLayout] = React.useState<"grid" | "list">(layout)
  const hasSubcollections = subcollections.length > 0

  if (!hasSubcollections) {
    return null
  }

  return (
    <div className="mb-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Collections</h3>
            <Badge variant="outline" className="text-xs">
              {subcollections.length}
            </Badge>
          </div>
          
          {/* View toggle buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant={viewLayout === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewLayout("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewLayout === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewLayout("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {viewLayout === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subcollections.map((subcollection) => (
            <CollectionCard
              key={subcollection.id}
              collection={subcollection}
              onOpen={onOpenSubcollection}
              onEdit={onEditSubcollection}
              onDelete={onDeleteSubcollection}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {subcollections.map((subcollection) => (
            <CollectionListItem
              key={subcollection.id}
              collection={subcollection}
              onOpen={onOpenSubcollection}
              onEdit={onEditSubcollection}
              onDelete={onDeleteSubcollection}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CollectionCard({
  collection,
  onOpen,
  onEdit,
  onDelete,
}: {
  collection: Collection
  onOpen: (id: string) => void
  onEdit?: (collection: Collection) => void
  onDelete?: (collection: Collection) => void
}) {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleOpen = () => {
    onOpen(collection.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(collection)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(collection)
  }

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-2 border-gray-200 bg-white transition-all hover:border-blue-400 hover:shadow-md"
      onClick={handleOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Folder className="h-5 w-5 text-blue-600" />
            </div>
            {collection.type === "ai-generated" && (
              <Sparkles className="h-4 w-4 text-indigo-500" />
            )}
          </div>
          
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 transition-opacity ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpen}>
                <Eye className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Name */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900">
          {collection.name}
        </h3>

        {/* Description */}
        {collection.description && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {collection.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {collection.itemCount} items
          </Badge>
          
          <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
        </div>

        {/* Auto-sync indicator */}
        {collection.autoSync && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
            Auto-sync
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CollectionListItem({
  collection,
  onOpen,
  onEdit,
  onDelete,
}: {
  collection: Collection
  onOpen: (id: string) => void
  onEdit?: (collection: Collection) => void
  onDelete?: (collection: Collection) => void
}) {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleOpen = () => {
    onOpen(collection.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(collection)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(collection)
  }

  return (
    <Card
      className="group relative flex cursor-pointer items-center gap-4 border border-gray-200 bg-white p-3 transition-all hover:border-blue-400 hover:shadow-md"
      onClick={handleOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Folder className="h-6 w-6 text-blue-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{collection.name}</h3>
              {collection.type === "ai-generated" && (
                <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI
                </Badge>
              )}
            </div>
            {collection.description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {collection.description}
              </p>
            )}
          </div>
          
          <Badge variant="outline" className="shrink-0 text-xs">
            {collection.itemCount} items
          </Badge>
        </div>
      </div>

      {/* Action button */}
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 shrink-0 gap-1 transition-opacity ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        Open
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 shrink-0 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpen}>
            <Eye className="mr-2 h-4 w-4" />
            Open
          </DropdownMenuItem>
          {onEdit && (
            <DropdownMenuItem onClick={handleEdit}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  )
}
