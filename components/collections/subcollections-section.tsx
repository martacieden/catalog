"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { SubcollectionCard } from "./subcollection-card"
import { formatSubcollectionCount } from "@/lib/collection-utils"
import {
  FolderPlus,
  Folders,
  Info,
} from "lucide-react"

interface SubcollectionsSectionProps {
  parentCollection: Collection
  subcollections: Collection[]
  onCreateSubcollection: () => void
  onOpenSubcollection: (subcollectionId: string) => void
  onEditSubcollection?: (subcollection: Collection) => void
  onDeleteSubcollection?: (subcollection: Collection) => void
  layout?: "grid" | "list"
  showCreateButton?: boolean
}

export function SubcollectionsSection({
  parentCollection,
  subcollections,
  onCreateSubcollection,
  onOpenSubcollection,
  onEditSubcollection,
  onDeleteSubcollection,
  layout = "grid",
  showCreateButton = true,
}: SubcollectionsSectionProps) {
  const hasSubcollections = subcollections.length > 0

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folders className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base">
              Subcollections
              {hasSubcollections && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({subcollections.length})
                </span>
              )}
            </CardTitle>
          </div>
          
          {showCreateButton && (
            <Button
              size="sm"
              onClick={onCreateSubcollection}
              className="h-8 gap-1.5"
            >
              <FolderPlus className="h-4 w-4" />
              Create Subcollection
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!hasSubcollections ? (
          // Empty state
          <EmptyState
            icon={Folders}
            title="No subcollections yet"
            description="Create subcollections to better organize items within this collection."
            action={
              showCreateButton ? (
                <Button onClick={onCreateSubcollection} className="gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Create First Subcollection
                </Button>
              ) : undefined
            }
            className="py-8"
          />
        ) : layout === "grid" ? (
          // Grid layout
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subcollections.map((subcollection) => (
              <SubcollectionCard
                key={subcollection.id}
                subcollection={subcollection}
                onOpen={onOpenSubcollection}
                onEdit={onEditSubcollection}
                onDelete={onDeleteSubcollection}
                compact={true}
              />
            ))}
          </div>
        ) : (
          // List layout
          <div className="space-y-2">
            {subcollections.map((subcollection) => (
              <SubcollectionCard
                key={subcollection.id}
                subcollection={subcollection}
                onOpen={onOpenSubcollection}
                onEdit={onEditSubcollection}
                onDelete={onDeleteSubcollection}
                compact={false}
              />
            ))}
          </div>
        )}

        {/* Info banner */}
        {hasSubcollections && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Items in subcollections are separate from items in this collection. 
              Use subcollections to organize related items into logical groups.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Compact version without card wrapper (for embedding in panels)
 */
export function SubcollectionsList({
  subcollections,
  onOpenSubcollection,
  onEditSubcollection,
  onDeleteSubcollection,
  layout = "grid",
}: Omit<SubcollectionsSectionProps, "parentCollection" | "onCreateSubcollection" | "showCreateButton">) {
  if (subcollections.length === 0) {
    return null
  }

  return layout === "grid" ? (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {subcollections.map((subcollection) => (
        <SubcollectionCard
          key={subcollection.id}
          subcollection={subcollection}
          onOpen={onOpenSubcollection}
          onEdit={onEditSubcollection}
          onDelete={onDeleteSubcollection}
          compact={true}
        />
      ))}
    </div>
  ) : (
    <div className="space-y-2">
      {subcollections.map((subcollection) => (
        <SubcollectionCard
          key={subcollection.id}
          subcollection={subcollection}
          onOpen={onOpenSubcollection}
          onEdit={onEditSubcollection}
          onDelete={onDeleteSubcollection}
          compact={false}
        />
      ))}
    </div>
  )
}

