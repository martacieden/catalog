"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { FilterRule } from "@/types/rule"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RuleBuilder } from "./rule-builder"
import {
  X,
  Save,
  Settings,
  FileText,
  Filter,
  Sparkles,
  Info,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CollectionEditSidebarProps {
  collection: Collection
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (updatedCollection: Partial<Collection>) => void
}

export function CollectionEditSidebar({
  collection,
  open,
  onOpenChange,
  onSave
}: CollectionEditSidebarProps) {
  const { toast } = useToast()
  
  // State for form data
  const [formData, setFormData] = React.useState({
    name: collection.name,
    description: collection.description || "",
    autoSync: collection.autoSync || false,
  })
  
  const [rules, setRules] = React.useState<FilterRule[]>(collection.filters || [])
  const [isSaving, setIsSaving] = React.useState(false)

  // Update form data when collection changes
  React.useEffect(() => {
    setFormData({
      name: collection.name,
      description: collection.description || "",
      autoSync: collection.autoSync || false,
    })
    setRules(collection.filters || [])
  }, [collection])

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const updatedCollection = {
        ...collection,
        ...formData,
        filters: rules,
      }
      
      // Call the save handler
      onSave?.(updatedCollection)
      
      toast({
        title: "Collection updated",
        description: "Collection details have been saved successfully.",
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save collection details.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: collection.name,
      description: collection.description || "",
      autoSync: collection.autoSync || false,
    })
    setRules(collection.filters || [])
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Collection deleted",
        description: `"${collection.name}" has been permanently deleted.`,
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={handleCancel}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold">Edit Collection</h2>
            <p className="text-sm text-muted-foreground">{collection.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Basic Information</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter collection name"
                />
              </div>
              
              <div>
                <Label htmlFor="collection-description">Description</Label>
                <Textarea
                  id="collection-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this collection contains..."
                  className="min-h-24 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A good description helps team members understand the purpose of this collection
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Auto-sync Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Auto-sync Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-sync">Enable Auto-sync</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically update collection when items match the rules
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={formData.autoSync}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoSync: checked }))}
                />
              </div>
              
              {formData.autoSync && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Auto-sync Active</p>
                  </div>
                  <p className="text-xs text-blue-700">
                    This collection will automatically include new items that match the filter rules below.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Delete Collection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Delete Collection</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Once you delete a collection, there is no going back. Please be certain.
              </p>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isSaving}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Collection
              </Button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
