"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { FilterRule } from "@/types/rule"
import { useCollections } from "@/contexts/collections-context"
import { RuleBuilder } from "./rule-builder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Settings,
  Folder,
  Filter as FilterIcon,
  Share2,
  X,
  Plus,
  Sparkles,
  Tag as TagIcon,
  Save,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CollectionEditDialogProps {
  collection: Collection
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CollectionEditDialog({
  collection,
  open,
  onOpenChange,
}: CollectionEditDialogProps) {
  const { updateCollection } = useCollections()
  const { toast } = useToast()

  // Form state
  const [name, setName] = React.useState(collection.name)
  const [description, setDescription] = React.useState(collection.description || "")
  const [category, setCategory] = React.useState(collection.category || "")
  const [tags, setTags] = React.useState<string[]>(collection.tags || [])
  const [newTag, setNewTag] = React.useState("")
  const [autoSync, setAutoSync] = React.useState(collection.autoSync)
  const [isPublic, setIsPublic] = React.useState(collection.isPublic || false)
  const [rules, setRules] = React.useState<FilterRule[]>(collection.filters || [])

  // Reset form when collection changes
  React.useEffect(() => {
    setName(collection.name)
    setDescription(collection.description || "")
    setCategory(collection.category || "")
    setTags(collection.tags || [])
    setAutoSync(collection.autoSync)
    setIsPublic(collection.isPublic || false)
    setRules(collection.filters || [])
  }, [collection, open])

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Validation error",
        description: "Collection name is required",
        variant: "destructive",
      })
      return
    }

    updateCollection(collection.id, {
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      tags,
      autoSync,
      isPublic,
      filters: rules,
    })

    toast({
      title: "Collection updated",
      description: `"${name}" has been saved successfully.`,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                collection.type === "ai-generated"
                  ? "bg-gradient-to-br from-indigo-500/20 to-blue-500/20"
                  : "bg-blue-50"
              }`}
            >
              {collection.type === "ai-generated" ? (
                <Sparkles className="h-5 w-5 text-indigo-600" />
              ) : (
                <Folder className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <DialogTitle>Edit Collection</DialogTitle>
              <DialogDescription>
                Update collection settings and properties
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
          <TabsList className="px-6 border-b w-full justify-start rounded-none h-auto p-0">
            <TabsTrigger value="general" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="items" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Folder className="h-4 w-4 mr-2" />
              Items ({collection.itemCount})
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <FilterIcon className="h-4 w-4 mr-2" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="sharing" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Share2 className="h-4 w-4 mr-2" />
              Sharing
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="flex-1 overflow-auto p-6 space-y-6 m-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter collection name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description to help others understand this collection..."
                  className="min-h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Real Estate, Vehicles, Legal"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-sm hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-sync">Auto-sync</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically update collection based on rules
                    </p>
                  </div>
                  <Switch
                    id="auto-sync"
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is-public">Public collection</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow others to view this collection
                    </p>
                  </div>
                  <Switch
                    id="is-public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <h4 className="text-sm font-medium">Collection Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">
                      {collection.type === "ai-generated" ? "AI Generated" : "Manual"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Items:</span>
                    <span className="ml-2 font-medium">{collection.itemCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2 font-medium">
                      {collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="ml-2 font-medium">
                      {collection.updatedAt
                        ? new Date(collection.updatedAt).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="flex-1 overflow-auto p-6 m-0">
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Items Management</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Use the collection detail view to add, remove, and manage items in this collection.
              </p>
              <Button variant="outline">
                Go to Collection View
              </Button>
            </div>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="flex-1 overflow-auto p-6 m-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-1">Filter Rules</h3>
                <p className="text-xs text-muted-foreground">
                  Define rules to automatically filter and sync items in this collection
                </p>
              </div>

              <RuleBuilder
                rules={rules}
                onChange={setRules}
                items={collection.items || []}
                showPreview={true}
                maxRules={20}
              />

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-sync when rules match</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically add items that match these rules
                    </p>
                  </div>
                  <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sharing Tab */}
          <TabsContent value="sharing" className="flex-1 overflow-auto p-6 m-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label>Public Access</Label>
                  <p className="text-xs text-muted-foreground">
                    Anyone with the link can view this collection
                  </p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              {isPublic && (
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <Label className="text-sm mb-2">Share Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={`https://app.example.com/collections/${collection.id}`}
                      readOnly
                      className="bg-white"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label>Shared With</Label>
                    <p className="text-xs text-muted-foreground">
                      Manage who has access to this collection
                    </p>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add People
                  </Button>
                </div>

                {collection.sharedWith && collection.sharedWith.length > 0 ? (
                  <div className="space-y-2">
                    {collection.sharedWith.map((access, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {access.userId.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{access.userId}</p>
                            <p className="text-xs text-muted-foreground">
                              {access.permission}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Share2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Not shared with anyone yet
                    </p>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Team Members
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

