"use client"

import * as React from "react"
import { Collection, CollectionType } from "@/types/collection"
import { ManualCollectionDialog } from "@/components/manual-collection-dialog"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"

interface CreateSubcollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentCollection: Collection
  onCreateSubcollection: (data: {
    name: string
    description?: string
    type: CollectionType
    icon: string
  }) => void
}

export function CreateSubcollectionDialog({
  open,
  onOpenChange,
  parentCollection,
  onCreateSubcollection,
}: CreateSubcollectionDialogProps) {
  const { createSubcollection } = useCollections()
  const { toast } = useToast()

  const handleCollectionCreated = () => {
    // Отримуємо останню створену колекцію з контексту
    // і перетворюємо її в підколекцію
    try {
      // ManualCollectionDialog вже створив колекцію через контекст
      // Тепер нам потрібно перетворити її в підколекцію
      toast({
        title: "Collection created",
        description: "Converting to subcollection...",
      })
      
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create subcollection.",
        variant: "destructive",
      })
    }
  }

  return (
    <ManualCollectionDialog
      trigger={<div />}
      open={open}
      onOpenChange={onOpenChange}
      onCollectionCreated={handleCollectionCreated}
    />
  )
}