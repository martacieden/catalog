"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  Trash2,
  FolderUp,
  Info,
} from "lucide-react"

interface DeleteCollectionWithSubsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection
  subcollectionsCount: number
  totalItemsCount: number
  onConfirmDelete: (deleteSubcollections: boolean) => void
}

export function DeleteCollectionWithSubsDialog({
  open,
  onOpenChange,
  collection,
  subcollectionsCount,
  totalItemsCount,
  onConfirmDelete,
}: DeleteCollectionWithSubsDialogProps) {
  const [deleteOption, setDeleteOption] = React.useState<"all" | "move-up">("move-up")

  const handleConfirm = () => {
    onConfirmDelete(deleteOption === "all")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setDeleteOption("move-up")
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Collection with Subcollections?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              This collection <span className="font-semibold">"{collection.name}"</span> contains{" "}
              <span className="font-semibold">{subcollectionsCount}</span> {subcollectionsCount === 1 ? "subcollection" : "subcollections"}{" "}
              with a total of <span className="font-semibold">{totalItemsCount}</span> items.
            </p>
            
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  This action cannot be undone. Please choose what to do with the subcollections.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-4">
          <Label className="text-base font-medium">What would you like to do?</Label>
          
          <RadioGroup value={deleteOption} onValueChange={(value) => setDeleteOption(value as "all" | "move-up")}>
            {/* Move to root */}
            <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="move-up" id="move-up" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="move-up" className="flex items-center gap-2 cursor-pointer font-medium">
                  <FolderUp className="h-4 w-4 text-blue-600" />
                  Move subcollections to root level
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Subcollections will become root collections. All items will be preserved.
                </p>
                <div className="mt-2 text-xs text-green-700 bg-green-50 rounded px-2 py-1 inline-block">
                  ✓ Recommended - Preserves all data
                </div>
              </div>
            </div>

            {/* Delete everything */}
            <div className="flex items-start space-x-3 rounded-lg border border-red-200 p-4 hover:bg-red-50 cursor-pointer">
              <RadioGroupItem value="all" id="all" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer font-medium text-red-700">
                  <Trash2 className="h-4 w-4" />
                  Delete everything
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Delete this collection, all subcollections, and all {totalItemsCount} items permanently.
                </p>
                <div className="mt-2 text-xs text-red-700 bg-red-50 rounded px-2 py-1 inline-block">
                  ⚠️ Warning - Cannot be undone
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              deleteOption === "all"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {deleteOption === "all" ? "Delete Everything" : "Move & Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

