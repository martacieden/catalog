"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCollections } from "@/contexts/collections-context"
import { Link } from "lucide-react"

interface CreateDependencyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceCollectionId: string
  sourceCollectionName: string
}

export function CreateDependencyDialog({
  open,
  onOpenChange,
  sourceCollectionId,
  sourceCollectionName,
}: CreateDependencyDialogProps) {
  const { collections, addDependency } = useCollections()
  const [type, setType] = React.useState("")
  const [relationship, setRelationship] = React.useState("")
  const [targetId, setTargetId] = React.useState("")
  const [description, setDescription] = React.useState("")

  // Available target collections (excluding source)
  const availableCollections = collections.filter(c => c.id !== sourceCollectionId)

  const handleCreate = () => {
    if (!type || !targetId) return

    addDependency({
      type,
      sourceId: sourceCollectionId,
      sourceType: "collection",
      targetId,
      targetType: "collection",
      relationship: relationship || type,
      description: description || undefined,
      createdBy: {
        id: "current-user",
        name: "Current User",
        email: "user@example.com",
        avatar: "/placeholder-user.jpg"
      }
    })

    // Reset form
    setType("")
    setRelationship("")
    setTargetId("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-purple-600" />
            Create Dependency
          </DialogTitle>
          <DialogDescription>
            Create a dependency link from "{sourceCollectionName}" to another collection.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Dependency Type</Label>
            <Input
              id="type"
              placeholder="e.g., Legal Documents, Insurance Policies, Contracts"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Name your dependency type (you can create any type you want)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target">Target Collection</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger>
                <SelectValue placeholder="Select target collection" />
              </SelectTrigger>
              <SelectContent>
                {availableCollections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              placeholder="e.g., Required Documentation, Coverage Required"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Describe the relationship (optional)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this dependency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!type || !targetId}>
            Create Dependency
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
