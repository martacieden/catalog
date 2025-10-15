"use client"

import * as React from "react"
import { Collection, CollectionType } from "@/types/collection"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  Folder,
  Sparkles,
  FolderOpen,
  Wand2,
  Info,
} from "lucide-react"

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
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [type, setType] = React.useState<CollectionType>("manual")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create subcollection
      onCreateSubcollection({
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        icon: "folder",
      })

      // Reset form
      setName("")
      setDescription("")
      setType("manual")
      
      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating subcollection:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setName("")
      setDescription("")
      setType("manual")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-blue-600" />
              Create Subcollection
            </DialogTitle>
            <DialogDescription>
              Create a subcollection within "{parentCollection.name}" to organize related items.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Info banner */}
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Subcollections help you organize items into logical groups within this collection.
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="subcollection-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subcollection-name"
                placeholder="e.g., Legal Documents, Financial Records"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                {name.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="subcollection-description">
                Description <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="subcollection-description"
                placeholder="Brief description of what this subcollection contains..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>

            {/* Type */}
            <div className="space-y-3">
              <Label>Collection Type</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as CollectionType)}>
                {/* Manual Collection */}
                <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <RadioGroupItem value="manual" id="type-manual" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="type-manual" className="flex items-center gap-2 cursor-pointer">
                      <FolderOpen className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Manual Collection</span>
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Manually add and remove items to this subcollection.
                    </p>
                  </div>
                </div>

                {/* Smart Collection */}
                <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <RadioGroupItem value="smart" id="type-smart" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="type-smart" className="flex items-center gap-2 cursor-pointer">
                      <Wand2 className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Smart Collection</span>
                      <Badge variant="secondary" className="text-xs">Auto</Badge>
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Automatically populate based on filter rules you define.
                    </p>
                  </div>
                </div>

                {/* AI-Generated Collection */}
                <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <RadioGroupItem value="ai-generated" id="type-ai" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="type-ai" className="flex items-center gap-2 cursor-pointer">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium">AI-Generated</span>
                      <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700">
                        AI
                      </Badge>
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Let AI suggest items and rules for this subcollection.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Subcollection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

