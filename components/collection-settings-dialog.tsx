"use client"

import * as React from "react"
import { Settings, FileText, Tag, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CollectionMetadata {
  name: string
  description: string
  tags: string[]
  createdBy: string
  createdOn: string
  lastModified: string
  itemCount: number
}

export function CollectionSettingsDialog({
  trigger,
  collectionName = "Legal Entities",
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  trigger?: React.ReactNode
  collectionName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen
  const [metadata, setMetadata] = React.useState<CollectionMetadata>({
    name: collectionName,
    description: "Comprehensive database of all legal entities and corporate structures across all jurisdictions",
    tags: ["Legal", "Entities", "Corporate", "Compliance"],
    createdBy: "John Smith",
    createdOn: "Jan 15, 2024",
    lastModified: "2 hours ago",
    itemCount: 103,
  })
  const [newTag, setNewTag] = React.useState("")

  const handleAddTag = () => {
    if (newTag && !metadata.tags.includes(newTag)) {
      setMetadata({ ...metadata, tags: [...metadata.tags, newTag] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata({ ...metadata, tags: metadata.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleSave = () => {
    // TODO: Save collection metadata to context/API
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Collection Settings
          </DialogTitle>
          <DialogDescription>Manage collection details, description, and metadata</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                value={metadata.name}
                onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                placeholder="Add a description to help others understand what this collection contains..."
                className="min-h-24 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                A good description helps team members understand the purpose and contents of this collection
              </p>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-sm hover:bg-muted">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
          </div>

          <Separator />

          {/* Metadata Information */}
          <div className="space-y-3">
            <Label>Collection Information</Label>
            <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Created by</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">JS</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{metadata.createdBy}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created on</span>
                </div>
                <span className="text-sm font-medium">{metadata.createdOn}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last modified</span>
                </div>
                <span className="text-sm font-medium">{metadata.lastModified}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Total items</span>
                </div>
                <Badge variant="secondary">{metadata.itemCount}</Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
