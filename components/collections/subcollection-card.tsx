"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatItemCount } from "@/lib/collection-utils"
import {
  Folder,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react"

interface SubcollectionCardProps {
  subcollection: Collection
  onOpen: (subcollectionId: string) => void
  onEdit?: (subcollection: Collection) => void
  onDelete?: (subcollection: Collection) => void
  compact?: boolean
}

export function SubcollectionCard({
  subcollection,
  onOpen,
  onEdit,
  onDelete,
  compact = false,
}: SubcollectionCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleOpen = () => {
    onOpen(subcollection.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(subcollection)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(subcollection)
  }

  if (compact) {
    // Компактний вигляд для міні-карток
    return (
      <Card
        className="group relative cursor-pointer overflow-hidden border-2 border-gray-200 bg-white transition-all hover:border-blue-400 hover:shadow-md"
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4">
          {/* Icon + Title */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Folder className="h-5 w-5 text-blue-600" />
              </div>
              {subcollection.type === "ai-generated" && (
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

          {/* Name */}
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900">
            {subcollection.name}
          </h3>

          {/* Description */}
          {subcollection.description && (
            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
              {subcollection.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {formatItemCount(subcollection.itemCount)}
            </Badge>
            
            <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
          </div>

          {/* Auto-sync indicator */}
          {subcollection.autoSync && (
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Auto-sync
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Повний вигляд для списку
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
              <h3 className="truncate text-sm font-semibold">{subcollection.name}</h3>
              {subcollection.type === "ai-generated" && (
                <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI
                </Badge>
              )}
            </div>
            {subcollection.description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {subcollection.description}
              </p>
            )}
          </div>
          
          <Badge variant="outline" className="shrink-0 text-xs">
            {formatItemCount(subcollection.itemCount)}
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
        <ArrowRight className="h-4 w-4" />
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

