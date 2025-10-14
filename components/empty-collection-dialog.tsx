"use client"

import * as React from "react"
import { Plus, FolderOpen, Sparkles, Wand2, Trash2, Layers, Building2, Home, Car, Plane, Ship, Calendar, PawPrint, ScrollText, Tag, Users, FileText, Star, Heart, Zap, Shield, Globe, Lock, Unlock, CreditCard, Wallet, DollarSign, TrendingUp, Banknote, Coins, PiggyBank, Briefcase, Key, MapPin, Landmark, Hospital, Gift, Smile, MessageCircle, Wrench, Settings, BarChart3, PieChart, Target, Award, Trophy, Crown, Gem, Diamond, Leaf, TreePine, Mountain, Waves, Sun, Moon, Cloud, Umbrella, Camera, Image, Upload } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmptyState } from "@/components/ui/empty-state"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { FilterRule } from "@/types/rule"

interface EmptyCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCollectionCreated?: () => void
}

const AVAILABLE_FIELDS = [
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
  { value: "createdBy", label: "Created by" },
  { value: "createdOn", label: "Created on" },
  { value: "lastUpdate", label: "Last update" },
  { value: "pinned", label: "Pinned" },
  { value: "sharedWith", label: "Shared with" },
]

const OPERATORS: { value: FilterRule["operator"]; label: string }[] = [
  { value: 'equals', label: 'is' },
  { value: 'not_equals', label: 'is not' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'starts_with', label: 'starts with' },
  { value: 'ends_with', label: 'ends with' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
]

const CATEGORY_OPTIONS = [
  "Legal entities",
  "Properties", 
  "Vehicles",
  "Aviation",
  "Maritime",
  "Organizations",
  "Events",
  "Pets",
  "Obligations"
]

const COLLECTION_ICON_CATEGORIES = [
  {
    name: "General",
    icons: [
      { name: "Layers", icon: Layers, description: "Stack" },
      { name: "FolderOpen", icon: FolderOpen, description: "Folder" },
      { name: "FileText", icon: FileText, description: "File" },
      { name: "Tag", icon: Tag, description: "Tag" },
      { name: "Star", icon: Star, description: "Star" },
      { name: "Heart", icon: Heart, description: "Heart" },
      { name: "Zap", icon: Zap, description: "Lightning" },
      { name: "Shield", icon: Shield, description: "Shield" },
    ]
  },
  {
    name: "Business",
    icons: [
      { name: "Building2", icon: Building2, description: "Building" },
      { name: "Briefcase", icon: Briefcase, description: "Briefcase" },
      { name: "Users", icon: Users, description: "Users" },
      { name: "Target", icon: Target, description: "Target" },
      { name: "TrendingUp", icon: TrendingUp, description: "Trending Up" },
      { name: "BarChart3", icon: BarChart3, description: "Bar Chart" },
      { name: "PieChart", icon: PieChart, description: "Pie Chart" },
      { name: "Award", icon: Award, description: "Award" },
    ]
  },
  {
    name: "Properties",
    icons: [
      { name: "Home", icon: Home, description: "Home" },
      { name: "Car", icon: Car, description: "Car" },
      { name: "Plane", icon: Plane, description: "Plane" },
      { name: "Ship", icon: Ship, description: "Ship" },
      { name: "MapPin", icon: MapPin, description: "Location" },
      { name: "Landmark", icon: Landmark, description: "Landmark" },
      { name: "Mountain", icon: Mountain, description: "Mountain" },
      { name: "Waves", icon: Waves, description: "Waves" },
    ]
  },
  {
    name: "Finance",
    icons: [
      { name: "DollarSign", icon: DollarSign, description: "Dollar" },
      { name: "CreditCard", icon: CreditCard, description: "Credit Card" },
      { name: "Wallet", icon: Wallet, description: "Wallet" },
      { name: "Banknote", icon: Banknote, description: "Banknote" },
      { name: "Coins", icon: Coins, description: "Coins" },
      { name: "PiggyBank", icon: PiggyBank, description: "Piggy Bank" },
      { name: "Gem", icon: Gem, description: "Gem" },
      { name: "Diamond", icon: Diamond, description: "Diamond" },
    ]
  },
  {
    name: "Nature",
    icons: [
      { name: "Leaf", icon: Leaf, description: "Leaf" },
      { name: "TreePine", icon: TreePine, description: "Tree" },
      { name: "Sun", icon: Sun, description: "Sun" },
      { name: "Moon", icon: Moon, description: "Moon" },
      { name: "Cloud", icon: Cloud, description: "Cloud" },
      { name: "Umbrella", icon: Umbrella, description: "Umbrella" },
      { name: "Camera", icon: Camera, description: "Camera" },
      { name: "Image", icon: Image, description: "Image" },
    ]
  }
]

export function EmptyCollectionDialog({ 
  open, 
  onOpenChange, 
  onCollectionCreated 
}: EmptyCollectionDialogProps) {
  const { addCollection } = useCollections()
  const { toast } = useToast()
  const router = useRouter()
  
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectedIcon, setSelectedIcon] = React.useState("FolderOpen")
  const [rules, setRules] = React.useState<FilterRule[]>([])
  const [isGeneratingRules, setIsGeneratingRules] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setName("")
      setDescription("")
      setSelectedIcon("FolderOpen")
      setRules([])
    }
  }, [open])

  const handleGenerateRules = async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description to generate AI rules.",
        variant: "destructive"
      })
      return
    }

    setIsGeneratingRules(true)
    
    // Simulate AI rule generation
    setTimeout(() => {
      const generatedRules: FilterRule[] = []
      
      // Simple rule generation based on description keywords
      const lowerDesc = description.toLowerCase()
      
      if (lowerDesc.includes('property') || lowerDesc.includes('real estate')) {
        generatedRules.push({
          id: `rule-${Date.now()}`,
          field: 'category',
          operator: 'equals',
          value: 'Properties'
        })
      }
      
      if (lowerDesc.includes('vehicle') || lowerDesc.includes('car')) {
        generatedRules.push({
          id: `rule-${Date.now() + 1}`,
          field: 'category',
          operator: 'equals',
          value: 'Vehicles'
        })
      }
      
      if (lowerDesc.includes('legal') || lowerDesc.includes('entity')) {
        generatedRules.push({
          id: `rule-${Date.now() + 2}`,
          field: 'category',
          operator: 'equals',
          value: 'Legal entities'
        })
      }
      
      if (lowerDesc.includes('high value') || lowerDesc.includes('luxury')) {
        generatedRules.push({
          id: `rule-${Date.now() + 3}`,
          field: 'name',
          operator: 'contains',
          value: 'luxury'
        })
      }
      
      setRules(generatedRules)
      setIsGeneratingRules(false)
      
      toast({
        title: "Rules generated",
        description: `Generated ${generatedRules.length} filtering rules based on your description.`,
      })
    }, 1500)
  }

  const handleAddRule = () => {
    const newRule: FilterRule = {
      id: `rule-${Date.now()}`,
      field: 'name',
      operator: 'contains',
      value: ''
    }
    setRules([...rules, newRule])
  }

  const handleRemoveRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId))
  }

  const handleUpdateRule = (ruleId: string, updates: Partial<FilterRule>) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ))
  }

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a collection name.",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    
    try {
      const collectionData = {
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon,
        type: 'manual' as const,
        filters: rules,
        items: [], // Empty collection - no items
        createdBy: { id: "current-user", name: "Current User", avatar: "CU" },
        autoSync: false,
        updatedAt: new Date(),
        viewCount: 0
      }

      const newCollection = addCollection(collectionData)
      const newCollectionId = newCollection.id
      
      toast({
        title: "Collection created",
        description: `"${name}" has been created successfully.`,
      })

      onCollectionCreated?.()
      onOpenChange(false)
      
      // Navigate to the new collection
      setTimeout(() => {
        router.push(`/collections/${newCollectionId}`)
      }, 1000)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconCategory = COLLECTION_ICON_CATEGORIES.find(cat => 
      cat.icons.some(icon => icon.name === iconName)
    )
    const iconData = iconCategory?.icons.find(icon => icon.name === iconName)
    return iconData?.icon || FolderOpen
  }

  const SelectedIcon = getIconComponent(selectedIcon)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[940px] max-w-[1400px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>
            Create a new empty collection. You can add items later or set up filtering rules.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 py-4 overflow-y-auto">
          {/* Collection Name, Icon and Description */}
          <div className="space-y-2">
            <Label htmlFor="collection-name" className="text-sm font-medium">
              Name *
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Input
                id="collection-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description" className="text-sm font-medium">
                Description & AI Rules
              </Label>
              <div className="flex gap-2">
                <Input
                  id="collection-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your collection and let AI suggest filtering rules..."
                  className="flex-1"
                />
                <Button
                  onClick={handleGenerateRules}
                  disabled={isGeneratingRules || !description.trim()}
                  variant="outline"
                  className="gap-2 whitespace-nowrap"
                >
                  {isGeneratingRules ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating rules...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate rules
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Describe your collection and AI will suggest smart filtering rules
              </p>
            </div>
          </div>

          {/* Rule-based Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Create specific filters manually</h3>
                <p className="text-xs text-muted-foreground">Optional: Add custom rules to filter items</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRule}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add rule
              </Button>
            </div>

            {rules.length === 0 ? (
              <EmptyState
                icon={FolderOpen}
                title="No rules added yet"
                description='Click "Add rule" to create your first filter, or leave empty for all items'
                size="sm"
              />
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <Select
                        value={rule.field}
                        onValueChange={(value) => handleUpdateRule(rule.id, { field: value as FilterRule['field'] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_FIELDS.map(field => (
                            <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={rule.operator}
                        onValueChange={(value) => handleUpdateRule(rule.id, { operator: value as FilterRule['operator'] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map(op => (
                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex-1">
                        {rule.field === 'category' ? (
                          <Select
                            value={String(rule.value)}
                            onValueChange={(value) => handleUpdateRule(rule.id, { value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_OPTIONS.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={String(rule.value)}
                            onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                            placeholder="Enter value"
                          />
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRule(rule.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Filter Summary */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">
                  {rules.length > 0 ? "Active rules:" : "Collection items:"}
                </p>
                <p className="text-xs font-medium text-green-600">
                  {rules.length > 0 
                    ? `${rules.length} rules active`
                    : "Empty collection - no items selected. You can add items later."
                  }
                </p>
              </div>
              {rules.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {rules.map((rule) => {
                    const fieldLabel = AVAILABLE_FIELDS.find(f => f.value === rule.field)?.label || rule.field
                    const operatorLabel = OPERATORS.find(op => op.value === rule.operator)?.label || rule.operator
                    return (
                      <Badge key={rule.id} variant="secondary" className="text-xs">
                        {fieldLabel} {operatorLabel} {rule.value}
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={isCreating || !name.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isCreating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FolderOpen className="mr-2 h-4 w-4" />
                Create collection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
