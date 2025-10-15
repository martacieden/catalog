"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Home,
  Folder,
} from "lucide-react"

interface CollectionBreadcrumbProps {
  path: Collection[]
  onNavigate: (collectionId: string | null) => void
  showHome?: boolean
}

export function CollectionBreadcrumb({
  path,
  onNavigate,
  showHome = true,
}: CollectionBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {/* Home / All Collections */}
      {showHome && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(null)}
            className="h-7 gap-1 px-2 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            All Collections
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </>
      )}

      {/* Breadcrumb path */}
      {path.map((collection, index) => {
        const isLast = index === path.length - 1
        const isSubcollection = collection.isSubcollection || collection.parentId

        return (
          <React.Fragment key={collection.id}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => !isLast && onNavigate(collection.id)}
              disabled={isLast}
              className={`h-7 gap-1.5 px-2 ${
                isLast
                  ? "font-semibold text-foreground cursor-default"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isSubcollection && <Folder className="h-3.5 w-3.5" />}
              <span className="max-w-[200px] truncate">{collection.name}</span>
            </Button>
            
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

/**
 * Compact version for mobile/small screens
 */
export function CollectionBreadcrumbCompact({
  path,
  onNavigate,
}: CollectionBreadcrumbProps) {
  const currentCollection = path[path.length - 1]
  const parentCollection = path.length > 1 ? path[path.length - 2] : null

  if (!currentCollection) return null

  return (
    <nav className="flex items-center gap-1 text-sm">
      {parentCollection ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(parentCollection.id)}
            className="h-7 gap-1 px-2 text-muted-foreground hover:text-foreground"
          >
            <Folder className="h-3.5 w-3.5" />
            <span className="max-w-[120px] truncate">{parentCollection.name}</span>
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(null)}
            className="h-7 gap-1 px-2 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </>
      )}

      <span className="truncate font-semibold">
        {currentCollection.name}
      </span>
    </nav>
  )
}

