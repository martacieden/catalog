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
  ChevronRight,
} from "lucide-react"

interface CollectionsGridProps {
  parentCollection: Collection
  subcollections: Collection[]
  onOpenSubcollection: (subcollectionId: string) => void
  onEditSubcollection?: (subcollection: Collection) => void
  onDeleteSubcollection?: (subcollection: Collection) => void
  showHeader?: boolean
}

export function CollectionsGrid({
  parentCollection,
  subcollections,
  onOpenSubcollection,
  onEditSubcollection,
  onDeleteSubcollection,
  showHeader = true,
}: CollectionsGridProps) {
  const hasSubcollections = subcollections.length > 0

  if (!hasSubcollections) {
    return null
  }

  return (
    <div className="mb-6 mt-8">
      {showHeader && (
        <div className="flex items-center gap-2 mb-3">
          <Folder className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold">Collections</h3>
          <Badge variant="outline" className="text-xs">
            {subcollections.length}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
      className="group relative cursor-pointer overflow-hidden border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-sm"
      onClick={handleOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50">
              <Folder className="h-3.5 w-3.5 text-blue-600" />
            </div>
          </div>
          
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 transition-opacity ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
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

      <CardContent className="pt-0 pb-3">
        {/* Name */}
        <h3 className="mb-1.5 line-clamp-2 text-xs font-semibold text-gray-900">
          {collection.name}
        </h3>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {collection.itemCount} items
          </Badge>
          
          <ChevronRight className="h-3 w-3 text-gray-400 transition-transform group-hover:translate-x-0.5" />
        </div>
      </CardContent>
    </Card>
  )
}

