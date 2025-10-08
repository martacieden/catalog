"use client"

import * as React from "react"
import { Plus, Trash2, FolderOpen, Sparkles, Wand2, Layers, Building2, Home, Car, Plane, Ship, Calendar, PawPrint, ScrollText, Tag, Users, FileText, Star, Heart, Zap, Shield, Globe, Lock, Unlock, CreditCard, Wallet, DollarSign, TrendingUp, Banknote, Coins, PiggyBank, Briefcase, Key, MapPin, Landmark, Hospital, Gift, Smile, MessageCircle, Wrench, Settings, BarChart3, PieChart, Target, Award, Trophy, Crown, Gem, Diamond, Leaf, TreePine, Mountain, Waves, Sun, Moon, Cloud, Umbrella, Camera, Image, Upload } from "lucide-react"
import { AICollectionDialog } from "./collections/ai-collection-dialog"
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
// Removed Textarea import as AI prompt will use Input with fixed height
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { FilterRule } from "@/types/rule"
import type { CollectionItem } from "@/types/collection"

// Use shared FilterRule type from types/rule

interface ManualCollectionDialogProps {
  trigger?: React.ReactNode
  selectedItems?: string[]
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
      { name: "Globe", icon: Globe, description: "Globe" },
      { name: "Target", icon: Target, description: "Target" },
      { name: "Award", icon: Award, description: "Award" },
      { name: "Trophy", icon: Trophy, description: "Trophy" },
    ]
  },
  {
    name: "Finance",
    icons: [
      { name: "Building2", icon: Building2, description: "Bank" },
      { name: "CreditCard", icon: CreditCard, description: "Credit Card" },
      { name: "Wallet", icon: Wallet, description: "Wallet" },
      { name: "DollarSign", icon: DollarSign, description: "Dollar" },
      { name: "TrendingUp", icon: TrendingUp, description: "Chart" },
      { name: "Banknote", icon: Banknote, description: "Banknote" },
      { name: "Coins", icon: Coins, description: "Coins" },
      { name: "PiggyBank", icon: PiggyBank, description: "Piggy Bank" },
      { name: "BarChart3", icon: BarChart3, description: "Bar Chart" },
      { name: "PieChart", icon: PieChart, description: "Pie Chart" },
      { name: "Lock", icon: Lock, description: "Lock" },
      { name: "Unlock", icon: Unlock, description: "Unlock" },
    ]
  },
  {
    name: "Real Estate",
    icons: [
      { name: "Building2", icon: Building2, description: "Building" },
      { name: "Home", icon: Home, description: "Home" },
      { name: "Landmark", icon: Landmark, description: "Landmark" },
      { name: "Key", icon: Key, description: "Key" },
      { name: "MapPin", icon: MapPin, description: "Location" },
      { name: "Briefcase", icon: Briefcase, description: "Briefcase" },
    ]
  },
  {
    name: "Transportation",
    icons: [
      { name: "Car", icon: Car, description: "Car" },
      { name: "Plane", icon: Plane, description: "Plane" },
      { name: "Ship", icon: Ship, description: "Ship" },
      { name: "Wrench", icon: Wrench, description: "Wrench" },
    ]
  },
  {
    name: "Management",
    icons: [
      { name: "Users", icon: Users, description: "Users" },
      { name: "Calendar", icon: Calendar, description: "Calendar" },
      { name: "Settings", icon: Settings, description: "Settings" },
      { name: "Briefcase", icon: Briefcase, description: "Briefcase" },
      { name: "MessageCircle", icon: MessageCircle, description: "Message" },
      { name: "Target", icon: Target, description: "Target" },
    ]
  },
  {
    name: "Personal",
    icons: [
      { name: "PawPrint", icon: PawPrint, description: "Paw" },
      { name: "Heart", icon: Heart, description: "Heart" },
      { name: "Smile", icon: Smile, description: "Smile" },
      { name: "Gift", icon: Gift, description: "Gift" },
      { name: "Crown", icon: Crown, description: "Crown" },
      { name: "Gem", icon: Gem, description: "Gem" },
    ]
  },
  {
    name: "Nature",
    icons: [
      { name: "Leaf", icon: Leaf, description: "Leaf" },
      { name: "TreePine", icon: TreePine, description: "Tree" },
      { name: "Mountain", icon: Mountain, description: "Mountain" },
      { name: "Waves", icon: Waves, description: "Waves" },
      { name: "Sun", icon: Sun, description: "Sun" },
      { name: "Moon", icon: Moon, description: "Moon" },
      { name: "Cloud", icon: Cloud, description: "Cloud" },
      { name: "Umbrella", icon: Umbrella, description: "Umbrella" },
    ]
  },
  {
    name: "Media",
    icons: [
      { name: "Camera", icon: Camera, description: "Camera" },
      { name: "Image", icon: Image, description: "Image" },
      { name: "Upload", icon: Upload, description: "Upload" },
    ]
  }
]

// Flatten all icons for easy access
const ALL_ICONS = COLLECTION_ICON_CATEGORIES.flatMap(category => 
  category.icons.map(icon => ({ ...icon, category: category.name }))
)

export function ManualCollectionDialog({ trigger, selectedItems = [], onCollectionCreated }: ManualCollectionDialogProps) {
  const { addCollection, allItems } = useCollections()
  const { toast } = useToast()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [collectionName, setCollectionName] = React.useState("New")
  const [filters, setFilters] = React.useState<FilterRule[]>([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [aiPrompt, setAiPrompt] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [aiDialogOpen, setAiDialogOpen] = React.useState(false)
  const [selectedIcon, setSelectedIcon] = React.useState(ALL_ICONS[0]) // Layers as default
  const [customImage, setCustomImage] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [description, setDescription] = React.useState("")

  // Initialize with selected items if provided
  React.useEffect(() => {
    if (open && selectedItems.length > 0) {
      setCollectionName(`Collection from ${selectedItems.length} items`)
    }
  }, [open, selectedItems])

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI response - in real app this would call AI API
    const generatedFilters: FilterRule[] = [
      {
        id: `ai-filter-${Date.now()}`,
        field: "category",
        operator: "equals",
        value: "Legal entities"
      },
      {
        id: `ai-filter-${Date.now() + 1}`,
        field: "createdOn",
        operator: "contains",
        value: "2024"
      }
    ]
    
    setFilters(prev => [...prev, ...generatedFilters])
    setIsGenerating(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // Simulate upload process
    const reader = new FileReader()
    reader.onload = (e) => {
      setCustomImage(e.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeCustomImage = () => {
    setCustomImage(null)
  }

  const addFilter = () => {
    const newFilter: FilterRule = {
      id: `filter-${Date.now()}`,
      field: 'name',
      operator: 'contains',
      value: ""
    }
    setFilters([...filters, newFilter])
  }

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId))
  }

  const updateFilter = (filterId: string, field: keyof FilterRule, value: any) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, [field]: value } : f
    ))
  }

  const getFieldOptions = (field: string) => {
    switch (field) {
      case "category":
        return CATEGORY_OPTIONS
      case "pinned":
        return ["true", "false"]
      case "createdBy":
        return ["John Smith", "Jane Doe", "Bob Wilson", "Ember Bett", "Alice Cooper"]
      default:
        return []
    }
  }

  const getValueInput = (filter: FilterRule) => {
    const fieldOptions = getFieldOptions(filter.field)
    
    if (fieldOptions.length > 0) {
      return (
        <Select value={String(filter.value ?? "")} onValueChange={(value) => updateFilter(filter.id, "value", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
    
    return (
      <Input
        value={String(filter.value ?? "")}
        onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
        placeholder="Enter value"
        className="w-full"
      />
    )
  }

  const handleAICreate = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items first to create an AI collection.",
        variant: "destructive"
      })
      return
    }
    
    setAiDialogOpen(true)
  }

  const handleCreate = async () => {
    setIsCreating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Отримати вибрані items з allItems контексту
    const selectedItemObjects = allItems.filter(item => selectedItems.includes(item.id))
    
    // Add collection to context
    const newCollection = {
      name: collectionName,
      icon: customImage ? "custom" : selectedIcon.name,
      customImage: customImage || undefined,
      filters,
      description: description || (selectedItems.length > 0 
        ? `Collection created from ${selectedItems.length} selected items` 
        : undefined),
      type: 'manual' as const,
      tags: [],
      items: selectedItemObjects, // Додаємо вибрані items
      autoSync: false,
      isPublic: false,
      sharedWith: [],
      viewCount: 0,
      // Satisfy type requirements; provider will overwrite createdBy/updatedAt
      createdBy: { id: "temp", name: "", email: "", avatar: "" },
      updatedAt: new Date(),
    }
    
    const createdCollection = addCollection(newCollection)
    
    // Показуємо успішне повідомлення
    toast({
      title: "Колекцію створено успішно! 🎉",
      description: selectedItemObjects.length > 0 
        ? `"${collectionName}" створено з ${selectedItemObjects.length} вибраними елементами.`
        : `"${collectionName}" створено.`,
    })
    
    console.log("Collection created:", {
      name: collectionName,
      icon: customImage ? "custom" : selectedIcon.name,
      customImage,
      filters,
      itemsCount: selectedItemObjects.length
    })
    
    setIsCreating(false)
    setOpen(false)
    
    // Викликаємо callback після створення колекції
    onCollectionCreated?.()
    
    // Автоматично переходимо до створеної колекції
    if (selectedItems.length > 0) {
      // Отримуємо ID останньої створеної колекції
      const collections = JSON.parse(localStorage.getItem('collections') || '[]')
      const lastCollection = collections[collections.length - 1]
      if (lastCollection && lastCollection.id) {
        router.push(`/catalog?collection=${lastCollection.id}`)
      }
    }
    
    // Reset state
    setCollectionName("New")
    setFilters([])
    setCustomImage(null)
    setSelectedIcon(ALL_ICONS[0])
  }

  const canCreate = collectionName.trim()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <FolderOpen className="h-4 w-4" />
            New collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[940px] max-w-[1400px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {customImage ? (
              <img 
                src={customImage} 
                alt="Custom icon" 
                className="h-5 w-5 rounded object-cover"
              />
            ) : (
              <selectedIcon.icon className="h-5 w-5 text-primary" />
            )}
            New Collection
          </DialogTitle>
          <DialogDescription>
            Group selected items into a new collection. Rules are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 py-4 overflow-y-auto">
          {/* Collection Name, Icon and Description */}
          <div className="space-y-2">
            <Label htmlFor="collection-name" className="text-sm font-medium">
              Name *
            </Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                  >
                    {customImage ? (
                      <img 
                        src={customImage} 
                        alt="Custom icon" 
                        className="h-6 w-6 rounded object-cover"
                      />
                    ) : (
                      <selectedIcon.icon className="h-4 w-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 max-h-80 overflow-y-auto">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Choose Icon</Label>
                    
                    {/* Custom Image Upload */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Custom Image
                      </h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="custom-image-upload"
                        />
                        <label
                          htmlFor="custom-image-upload"
                          className="flex-1 cursor-pointer"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-center gap-2"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                Upload Image
                              </>
                            )}
                          </Button>
                        </label>
                        {customImage && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={removeCustomImage}
                            className="h-10 w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {customImage && (
                        <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-muted/30">
                          <img 
                            src={customImage} 
                            alt="Custom preview" 
                            className="h-8 w-8 rounded object-cover"
                          />
                          <span className="text-xs text-muted-foreground">Custom image selected</span>
                        </div>
                      )}
                    </div>

                    {COLLECTION_ICON_CATEGORIES.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {category.name}
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                          {category.icons.map((iconOption) => (
                            <Button
                              key={iconOption.name}
                              variant={selectedIcon.name === iconOption.name ? "default" : "ghost"}
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => setSelectedIcon({ ...iconOption, category: category.name })}
                              title={iconOption.description}
                            >
                              <iconOption.icon className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                id="collection-name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Enter collection name"
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add an optional description"
              />
            </div>
          </div>

          {/* AI Generation Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Use AI to generate rules</h3>
            <p className="text-xs text-muted-foreground">Optional: Describe what you want to collect in plain language</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe rules using plain language..."
                  className="pl-10 h-9"
                />
              </div>
              <Button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
                className="gap-2 self-start"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
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
                onClick={addFilter}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add rule
              </Button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <FolderOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No rules added yet</p>
                <p className="text-xs">Click "Add rule" to create your first filter, or leave empty for all items</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <Select value={filter.field} onValueChange={(value) => updateFilter(filter.id, "field", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_FIELDS.map(field => (
                            <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filter.operator} onValueChange={(value) => updateFilter(filter.id, "operator", value)}>
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
                        {getValueInput(filter)}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFilter(filter.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Filter Summary */}
            {filters.length > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Active rules:</p>
                <div className="flex flex-wrap gap-1">
                  {filters.map((filter) => {
                    const fieldLabel = AVAILABLE_FIELDS.find(f => f.value === filter.field)?.label || filter.field
                    const operatorLabel = OPERATORS.find(op => op.value === filter.operator)?.label || filter.operator
                    return (
                      <Badge key={filter.id} variant="secondary" className="text-xs">
                        {fieldLabel} {operatorLabel} {filter.value}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {selectedItems.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleAICreate}
              className="bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border-indigo-200 text-indigo-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          )}
          <Button 
            onClick={handleCreate} 
            disabled={!canCreate || isCreating}
            className="gap-2"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <FolderOpen className="h-4 w-4" />
                Create collection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* AI Collection Dialog */}
      <AICollectionDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        selectedItems={selectedItems.map(id => allItems.find(item => item.id === id)).filter(Boolean) as CollectionItem[]}
        onCollectionCreated={() => {
          onCollectionCreated?.()
          setOpen(false)
        }}
      />
    </Dialog>
  )
}
