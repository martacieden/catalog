"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  LayoutGrid,
  Plus,
  Bell,
  Settings,
  MoreVertical,
  FileText,
  Tag,
  TrendingUp,
  Users,
  FolderOpen,
  Building2,
  Home,
  Car,
  Plane,
  Ship,
  Calendar,
  PawPrint,
  ScrollText,
  Pin,
  X,
  Sparkles,
  Columns,
  Grid3X3,
  Square,
  Diamond,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ManualCollectionDialog } from "@/components/manual-collection-dialog"
import { AddSelectedToCollectionDialog } from "@/components/collections/add-selected-to-collection-dialog"
import { AddItemModal } from "@/components/collections/add-item-modal"
import { AICollectionPreviewDialog } from "@/components/ai-collection-preview-dialog"
import { SearchToCollection } from "@/components/search-to-collection"
import { getUnsplashImageUrl, getRandomUnsplashImage } from "@/lib/unsplash"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/ui/empty-state"
import { MOCK_CATALOG_ITEMS, type MockCatalogItem } from "@/lib/mock-data"
import { AIRecommendationBanner } from "@/components/ai-recommendation-banner"
import { AICollectionPreviewModal } from "@/components/ai-collection-preview-modal"
import { highValueAssetsRecommendation, getRecommendationById } from "@/lib/ai-recommendations"


interface CatalogViewProps {
  activeView?: string
  onPinnedCountChange?: (count: number) => void
}

function getCategoryIcon(category: string, size: string = "h-5 w-5") {
  const iconMap: Record<string, React.ReactNode> = {
    "Legal entities": <Building2 className={`${size} text-blue-600`} />,
    "Properties": <Home className={`${size} text-green-600`} />,
    "Vehicles": <Car className={`${size} text-red-600`} />,
    "Aviation": <Plane className={`${size} text-sky-600`} />,
    "Maritime": <Ship className={`${size} text-blue-500`} />,
    "Organizations": <Building2 className={`${size} text-purple-600`} />,
    "Events": <Calendar className={`${size} text-orange-600`} />,
    "Pets": <PawPrint className={`${size} text-pink-600`} />,
    "Obligations": <ScrollText className={`${size} text-gray-600`} />,
    // Додаткові категорії з mock-data
    "Real Estate": <Home className={`${size} text-green-600`} />,
    "Electric Cars": <Car className={`${size} text-red-600`} />,
    "Private Jets": <Plane className={`${size} text-sky-600`} />,
    "Yachts": <Ship className={`${size} text-blue-500`} />,
    "Sports Cars": <Car className={`${size} text-red-600`} />,
  }
  return iconMap[category] || <FileText className={`${size} text-gray-500`} />
}

function getCategoryBgColor(category: string) {
  const colorMap: Record<string, string> = {
    "Legal entities": "bg-blue-50 border-blue-200",
    "Properties": "bg-green-50 border-green-200",
    "Vehicles": "bg-red-50 border-red-200",
    "Aviation": "bg-sky-50 border-sky-200",
    "Maritime": "bg-blue-50 border-blue-200",
    "Organizations": "bg-purple-50 border-purple-200",
    "Events": "bg-orange-50 border-orange-200",
    "Pets": "bg-pink-50 border-pink-200",
    "Obligations": "bg-gray-50 border-gray-200",
    // Додаткові категорії з mock-data
    "Real Estate": "bg-green-50 border-green-200",
    "Electric Cars": "bg-red-50 border-red-200",
    "Private Jets": "bg-sky-50 border-sky-200",
    "Yachts": "bg-blue-50 border-blue-200",
    "Sports Cars": "bg-red-50 border-red-200",
  }
  return colorMap[category] || "bg-gray-50 border-gray-200"
}

// Компонент для відображення в картковому вигляді (великий розмір)
const CardItemThumbnail = ({ item }: { item: any }) => {
  const CategoryIcon = getCategoryIcon(item.category, "h-8 w-8")
  const bgColorClass = getCategoryBgColor(item.category)
  
  return (
    <div className={`relative h-24 w-full rounded-lg overflow-hidden flex items-center justify-center ${bgColorClass}`}>
      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-white shadow-sm">
        {CategoryIcon}
      </div>
    </div>
  )
}

// Компонент для відображення в табличному вигляді (малий розмір)
const TableItemThumbnail = ({ item }: { item: any }) => {
  const CategoryIcon = getCategoryIcon(item.category, "h-5 w-5")
  const bgColorClass = getCategoryBgColor(item.category)
  
  return (
    <div className={`relative h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center ${bgColorClass}`}>
      <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white shadow-sm">
        {CategoryIcon}
      </div>
    </div>
  )
}

function AddOrCreateButton({ selectedIds, size = "sm", variant = "outline", label = "Add to collection" }: { selectedIds: string[]; size?: any; variant?: any; label?: string }) {
  const { collections } = useCollections()
  
  if (collections.length === 0) {
    return (
      <ManualCollectionDialog
        trigger={
          <Button variant={variant} size={size}>
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create new collection</span>
            <span className="sm:hidden">Create</span>
          </Button>
        }
        selectedItems={selectedIds}
      />
    )
  }
  return (
    <AddSelectedToCollectionDialog
      trigger={
        <Button variant={variant} size={size}>
          <Plus className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
      selectedItemIds={selectedIds}
    />
  )
}

export function CatalogView({ activeView = "catalog", onPinnedCountChange }: CatalogViewProps) {
  const router = useRouter()
  const { 
    collections, 
    getCollectionById, 
    allItems, 
    bulkRemoveItems,
    aiRecommendations,
    showAIBanner,
    dismissRecommendation,
    acceptRecommendation,
    toggleAIBanner
  } = useCollections()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState(0)
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [items, setItems] = React.useState(MOCK_CATALOG_ITEMS)
  const [viewMode, setViewMode] = React.useState<"grid" | "card">("card")
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [addItemModalOpen, setAddItemModalOpen] = React.useState(false)
  const [aiSuggestions, setAiSuggestions] = React.useState<any[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = React.useState(false)
  const [aiCollectionDialogOpen, setAiCollectionDialogOpen] = React.useState(false)
  const [isAISearching, setIsAISearching] = React.useState(false)
  const [showAIRecommendations, setShowAIRecommendations] = React.useState(false)
  const [collectionDialogOpen, setCollectionDialogOpen] = React.useState(false)
  const [aiPreviewModalOpen, setAiPreviewModalOpen] = React.useState(false)
  const [currentRecommendation, setCurrentRecommendation] = React.useState(highValueAssetsRecommendation)

  // Update items when activeView changes - filter by collection if needed
  React.useEffect(() => {
    let itemsToShow = MOCK_CATALOG_ITEMS
    
    // If we're viewing a specific collection, filter items by that collection
    const collection = getCollectionById(activeView)
    if (collection && collection.items) {
      // Get only items that belong to this collection
      const collectionItemIds = collection.items.map(item => item.id)
      itemsToShow = MOCK_CATALOG_ITEMS.filter(item => collectionItemIds.includes(item.id))
    }
    
    // Preserve pinned status from ref
    const itemsWithPinned = itemsToShow.map(item => ({
      ...item,
      pinned: pinnedStatusRef.current[item.id] || false
    }))
    
    setItems(itemsWithPinned)
  }, [activeView, getCollectionById])

  // Use ref to track pinned status without causing re-renders
  const pinnedStatusRef = React.useRef<Record<string, boolean>>({})
  
  // Update pinned status when items change
  React.useEffect(() => {
    items.forEach(item => {
      if (item.pinned !== undefined) {
        pinnedStatusRef.current[item.id] = item.pinned
      }
    })
  }, [items])

  const getPageTitle = () => {
    if (!activeView) return "Catalog"

    // Check if activeView is a collection ID
    const collection = getCollectionById(activeView)
    if (collection) {
      return collection.name
    }

    // Convert kebab-case to Title Case
    return activeView
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Визначаємо, чи це колекція для правильного відображення дій
  const isCollectionView = () => {
    return getCollectionById(activeView) !== undefined
  }

  // Function to apply collection filters to items
  const applyCollectionFilters = (items: any[], filters: any[]) => {
    if (!filters || filters.length === 0) return items

    return items.filter(item => {
      return filters.every(filter => {
        const { field, operator, value } = filter

        switch (field) {
          case "category":
            return operator === "equals" && item.category === value
          case "pinned":
            return operator === "equals" && item.pinned === (value === "true")
          case "sharedWith":
            if (operator === "is_not_empty") {
              return item.sharedWith && item.sharedWith.length > 0
            }
            return false
          case "createdOn":
            if (operator === "contains") {
              return item.createdOn.includes(value)
            }
            return false
          case "createdBy":
            if (operator === "equals") {
              return item.createdBy && item.createdBy.name === value
            }
            return false
          default:
            return true
        }
      })
    })
  }

  const getFilteredItems = (): MockCatalogItem[] => {
    let filteredItems = items

    // Check if activeView is a collection ID
    const collection = getCollectionById(activeView)
    if (collection) {
      // For AI-generated collections, use the items directly
      if (collection.type === 'ai-generated' && collection.items) {
        // Convert CollectionItem[] to mockItems format
        return collection.items.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          type: item.type || 'document',
          idCode: item.idCode || '',
          status: item.status || 'Active',
          location: item.location || '',
          value: item.value || 0,
          currency: item.currency || 'USD',
          tags: item.tags || [],
          guestRating: item.guestRating,
          lastUpdated: item.lastUpdated || new Date().toISOString(),
          createdAt: item.createdAt || new Date(),
          people: (item.people || []).map(p => ({
            id: p.id || '',
            role: p.role || 'Unknown',
            name: p.name || 'Unknown'
          })),
          sharedWith: [],
          createdBy: { name: "System", avatar: "S" },
          createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastUpdate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          pinned: false,
        }))
      }
      // For manual collections, apply collection filters
      filteredItems = applyCollectionFilters(filteredItems, collection.filters || [])
    } else if (activeView === "pinned") {
      return filteredItems.filter((item) => item.pinned)
    } else if (activeView === "all-objects") {
      return filteredItems
    } else if (activeView === "dashboard" || activeView === "recently-viewed") {
      return filteredItems
    } else {
      const categoryMap: Record<string, string> = {
        "legal-entities": "Legal entities",
        properties: "Properties",
        obligations: "Obligations",
        vehicles: "Vehicles",
        aviation: "Aviation",
        maritime: "Maritime",
        organizations: "Organizations",
        events: "Events",
        pets: "Pets",
      }

      const categoryName = categoryMap[activeView]
      if (categoryName) {
        return filteredItems.filter((item) => item.category === categoryName)
      }
      return filteredItems
    }

    return filteredItems
  }

  const filteredItems = getFilteredItems()

  const categoryCounts = React.useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [items])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handlePinSelected = () => {
    const pinnedCount = selectedItems.size
    setItems((prevItems) => prevItems.map((item) => (selectedItems.has(item.id) ? { ...item, pinned: true } : item)))
    setSelectedItems(new Set())
    
    // Show toast notification
    toast({
      title: "Items pinned successfully",
      description: `${pinnedCount} ${pinnedCount === 1 ? 'item' : 'items'} pinned`,
    })
  }

  const handleUnpinSelected = () => {
    const unpinnedCount = selectedItems.size
    setItems((prevItems) => prevItems.map((item) => (selectedItems.has(item.id) ? { ...item, pinned: false } : item)))
    setSelectedItems(new Set())
    
    // Show toast notification
    toast({
      title: "Items unpinned successfully",
      description: `${unpinnedCount} ${unpinnedCount === 1 ? 'item' : 'items'} unpinned`,
    })
  }

  const handleCreateCollectionFromSelected = () => {
    // This will be handled by the AI Collection Dialog
    // TODO: Implement collection creation from selected items
  }


  const selectedCount = selectedItems.size
  const allSelected = filteredItems.length > 0 && selectedItems.size === filteredItems.length
  const indeterminate = selectedItems.size > 0 && selectedItems.size < filteredItems.length
  
  // Calculate pinned items count
  const pinnedCount = items.filter(item => item.pinned).length
  
  // Send updated counter upward
  React.useEffect(() => {
    onPinnedCountChange?.(pinnedCount)
  }, [pinnedCount, onPinnedCountChange])

  // Show AI banner on All Objects page
  React.useEffect(() => {
    if (activeView === "all-objects") {
      toggleAIBanner(true)
    } else {
      toggleAIBanner(false)
    }
  }, [activeView, toggleAIBanner])

  const handleDeleteSelected = () => {
    if (isCollectionView()) {
      // For collections - remove from collection
      const collection = getCollectionById(activeView)
      if (collection) {
        bulkRemoveItems(collection.id, Array.from(selectedItems))
        toast({
          title: "Items removed from collection",
          description: `${selectedItems.size} item(s) have been removed from "${collection.name}".`,
        })
      }
    } else {
      // For All Items - delete permanently
      setItems((prevItems) => prevItems.filter((item) => !selectedItems.has(item.id)))
      toast({
        title: "Items deleted",
        description: `${selectedItems.size} item(s) have been permanently deleted.`,
      })
    }
    setSelectedItems(new Set())
    setShowDeleteDialog(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleClearSelection = () => {
    setSelectedItems(new Set())
  }

  const handleAISearch = (query: string) => {
    setIsAISearching(true)
    
    // Parse complex query for advanced filtering
    const parsedQuery = parseComplexQuery(query)
    
    // Apply advanced filtering based on parsed query
    let filtered = MOCK_CATALOG_ITEMS
    
    if (parsedQuery.filters.length > 0) {
      filtered = MOCK_CATALOG_ITEMS.filter(item => {
        return parsedQuery.filters.every(filter => {
          switch (filter.field) {
            case 'createdOn':
              return item.createdOn?.includes(String(filter.value)) || false
            case 'category':
              if (filter.operator === 'in') {
                return Array.isArray(filter.value) && filter.value.includes(item.category)
              }
              return item.category === filter.value
            case 'status':
              return (item as any).status === filter.value
            case 'budget':
              // Mock budget filtering - simulate high-value items
              if (filter.operator === 'greater_than') {
                const budgetThreshold = parseInt(String(filter.value))
                // Simulate budget filtering based on item name/category
                const isHighValue = item.name.toLowerCase().includes('luxury') ||
                                  item.name.toLowerCase().includes('premium') ||
                                  item.name.toLowerCase().includes('villa') ||
                                  item.name.toLowerCase().includes('penthouse') ||
                                  item.name.toLowerCase().includes('tesla') ||
                                  item.name.toLowerCase().includes('gulfstream') ||
                                  item.name.toLowerCase().includes('yacht') ||
                                  item.name.toLowerCase().includes('corporate') ||
                                  item.name.toLowerCase().includes('enterprise') ||
                                  item.name.toLowerCase().includes('holdings') ||
                                  item.name.toLowerCase().includes('group') ||
                                  item.category === 'Real Estate' ||
                                  item.category === 'Vehicles' ||
                                  item.category === 'Legal entities'
                return isHighValue
              }
              return true
            default:
              return true
          }
        })
      })
    } else {
      // Simple text search
      filtered = MOCK_CATALOG_ITEMS.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    // Ensure minimum 6 items are always shown
    if (filtered.length < 6) {
      // Add additional items to reach minimum 6
      const additionalItems = MOCK_CATALOG_ITEMS
        .filter(item => !filtered.some(filteredItem => filteredItem.id === item.id))
        .slice(0, 6 - filtered.length)
      filtered = [...filtered, ...additionalItems]
    }
    
    setItems(filtered)
    setShowAIRecommendations(true)
    
    // Show AI banner for certain queries
    if (query.toLowerCase().includes('high value') || 
        query.toLowerCase().includes('luxury') ||
        query.toLowerCase().includes('premium')) {
      toggleAIBanner(true)
    }
  }

  // Parse complex queries to extract filters and criteria
  const parseComplexQuery = (query: string) => {
    const lowerQuery = query.toLowerCase()
    const filters = []
    
    // Extract year filters
    const yearMatch = lowerQuery.match(/(\d{4})\s*рік|(\d{4})\s*year/)
    if (yearMatch) {
      const year = yearMatch[1] || yearMatch[2]
      filters.push({
        field: 'createdOn',
        operator: 'contains',
        value: year
      })
    }
    
    // Extract budget/amount filters
    const budgetMatch = lowerQuery.match(/бюджетом\s*вище\s*(\d+)|budget\s*above\s*(\d+)|вище\s*(\d+)|above\s*(\d+)/)
    if (budgetMatch) {
      const amount = budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4]
      filters.push({
        field: 'budget',
        operator: 'greater_than',
        value: amount
      })
    }
    
    // Special handling for "high-value assets above 1M"
    if (lowerQuery.includes('high-value assets above 1m') || 
        lowerQuery.includes('high value assets above 1m') ||
        lowerQuery.includes('high-value above 1m')) {
      // Add budget filter for 1M
      filters.push({
        field: 'budget',
        operator: 'greater_than',
        value: '1000000'
      })
      
      // Add high-value category filter
      filters.push({
        field: 'category',
        operator: 'in',
        value: ['Real Estate', 'Vehicles', 'Legal entities', 'Properties']
      })
    }
    
    // Special handling for "high value legal entety" query
    if (lowerQuery.includes('high value legal entety') || 
        lowerQuery.includes('high value legal entity') ||
        lowerQuery.includes('legal entety') ||
        lowerQuery.includes('legal entity')) {
      // Add legal entities category filter
      filters.push({
        field: 'category',
        operator: 'equals',
        value: 'Legal entities'
      })
      
      // Add high-value filter
      filters.push({
        field: 'budget',
        operator: 'greater_than',
        value: '500000'
      })
    }
    
    // Extract status filters
    if (lowerQuery.includes('активні') || lowerQuery.includes('active')) {
      filters.push({
        field: 'status',
        operator: 'equals',
        value: 'Active'
      })
    }
    
    // Extract category filters
    if (lowerQuery.includes('legal entities') || lowerQuery.includes('legal entiti')) {
      filters.push({
        field: 'category',
        operator: 'equals',
        value: 'Legal entities'
      })
    }
    
    if (lowerQuery.includes('properties') || lowerQuery.includes('нерухомість')) {
      filters.push({
        field: 'category',
        operator: 'equals',
        value: 'Properties'
      })
    }
    
    if (lowerQuery.includes('vehicles') || lowerQuery.includes('транспорт')) {
      filters.push({
        field: 'category',
        operator: 'equals',
        value: 'Vehicles'
      })
    }
    
    return {
      originalQuery: query,
      filters,
      hasComplexFilters: filters.length > 0
    }
  }

  const handleAIClear = () => {
    setItems(MOCK_CATALOG_ITEMS)
    setShowAIRecommendations(false)
    setIsAISearching(false)
    toggleAIBanner(false)
  }

  const handleAIBannerExplore = (recommendationId: string) => {
    const recommendation = getRecommendationById(recommendationId)
    if (recommendation) {
      setCurrentRecommendation(recommendation)
      setAiPreviewModalOpen(true)
    }
  }

  const handleAIBannerDismiss = () => {
    toggleAIBanner(false)
  }

  const handleCreateAICollection = (collectionData: {
    name: string;
    description: string;
    objectIds: string[];
  }) => {
    console.log('🔍 Creating AI collection with data:', collectionData)
    console.log('🔍 Current recommendation ID:', currentRecommendation.id)
    
    // Create collection through context
    const newCollectionId = acceptRecommendation(currentRecommendation.id)
    console.log('🔍 Created collection ID:', newCollectionId)
    
    setAiPreviewModalOpen(false)
    
    // Show success toast
    toast({
      title: "Collection created successfully",
      description: `"${collectionData.name}" has been created with AI-generated filtering rules.`,
    })
    
    // Redirect to the specific collection page
    if (newCollectionId) {
      console.log('🔍 Redirecting to collection:', newCollectionId)
      setTimeout(() => {
        router.push(`/collections/${newCollectionId}`)
      }, 1000)
    } else {
      router.push('/collections')
    }
  }

  const handleAIRecommendationClick = (recommendation: string) => {
    console.log('AI Recommendation clicked:', recommendation)
    // Handle AI recommendation click
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          {activeView === "all-objects" && (
            <Badge variant="secondary" className="text-xs">
              {items.length} total
            </Badge>
          )}
          {getCollectionById(activeView) && (
            <Badge variant="secondary" className="text-xs">
              {filteredItems.length} items
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* AI Recommendation Banner */}
          {showAIBanner && (
            <AIRecommendationBanner
              recommendation={{
                id: currentRecommendation.id,
                name: currentRecommendation.name,
                objectCount: currentRecommendation.objectCount,
              }}
              onDismiss={handleAIBannerDismiss}
              onExplore={handleAIBannerExplore}
            />
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>


            {activeView === "dashboard" ? (
              <DashboardView items={items} onCategoryClick={(category) => {
                // Navigate to category view (implemented in parent)
                // TODO: Add navigation callback to CatalogViewProps
              }} />
            ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3 gap-2 lg:gap-4">
            {/* Left group: Filters, Columns */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => setActiveFilters(activeFilters > 0 ? 0 : 2)}>
                <Filter className="mr-1 lg:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="ml-1 lg:ml-2">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Columns className="mr-1 lg:mr-2 h-4 w-4" />
                <span className="hidden lg:inline">9/9 columns</span>
              </Button>
            </div>
            
            {/* Center: Search with Fojo - адаптивна ширина */}
            <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm lg:max-w-md mx-1 sm:mx-2 lg:mx-4">
              <div className="relative flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <Search className="absolute left-2 sm:left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search with Fojo..."
                  className="pl-8 sm:pl-10 pr-16 sm:pr-20 lg:pr-28 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleAISearch(searchQuery)
                    }
                  }}
                />
                <div className="absolute right-1 sm:right-2 flex items-center gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleAISearch(searchQuery)}
                    disabled={!searchQuery.trim() || isAISearching}
                    className="bg-blue-600 text-white hover:bg-blue-700 h-6 sm:h-7 px-1 sm:px-2 lg:px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Ask Fojo</span>
                  </Button>
                  {searchQuery && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAIClear}
                      className="h-6 sm:h-7 w-6 sm:w-7 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right group: View toggle, Add */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <div className="flex items-center border border-border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-2 lg:px-3"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "card" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-2 lg:px-3"
                  onClick={() => setViewMode("card")}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => setAddItemModalOpen(true)} size="sm" className="lg:size-default">
                <Plus className="mr-1 lg:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>

          {/* Bulk Action for High Value Legal Entity Query */}
          {searchQuery.toLowerCase().includes('high value legal entety') && (
            <div className="border-b border-border bg-card px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">AI Collection Assistant</h3>
                    <p className="text-xs text-blue-700">
                      I found {items.length} items matching "high value legal entety". Create a smart collection?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Open collection creation dialog with pre-filled data
                      setCollectionDialogOpen(true)
                    }}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Create Collection
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto bg-background p-6">
            <div className="w-full">
            {searchQuery && activeFilters > 0 && (
              <div className="mb-4">
                <SearchToCollection
                  searchQuery={searchQuery}
                  filterCount={activeFilters}
                  resultCount={filteredItems.length}
                />
              </div>
            )}

            {viewMode === "grid" ? (
              <GridView 
                items={filteredItems} 
                selectedItems={selectedItems} 
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
                allSelected={allSelected}
                onPinSelected={handlePinSelected}
                onUnpinSelected={handleUnpinSelected}
                onCreateCollectionFromSelected={handleCreateCollectionFromSelected}
                onClearSelection={() => setSelectedItems(new Set())}
                onDeleteClick={handleDeleteClick}
                activeView={activeView}
                isCollectionView={isCollectionView()}
              />
            ) : (
              <CardView 
                items={filteredItems} 
                selectedItems={selectedItems} 
                onSelectItem={handleSelectItem}
                onPinSelected={handlePinSelected}
                onUnpinSelected={handleUnpinSelected}
                onCreateCollectionFromSelected={handleCreateCollectionFromSelected}
                onClearSelection={() => setSelectedItems(new Set())}
                onDeleteClick={handleDeleteClick}
                activeView={activeView}
                isCollectionView={isCollectionView()}
              />
            )}
            </div>
          </div>
        </>
      )}

      {/* Delete/Remove Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCollectionView() ? 'Remove' : 'Delete'} {selectedCount} {selectedCount === 1 ? 'item' : 'items'}?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              {isCollectionView() ? (
                <>Removing these items from <strong>{getCollectionById(activeView)?.name}</strong> will unlink them from this collection. The items will remain in the system and other collections.</>
              ) : (
                <>Deleting these <strong>Items</strong> will remove them permanently from All Items, their Category, and any Collections they belong to. This action cannot be undone.</>
              )}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              {isCollectionView() ? 'Remove from collection' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <AddItemModal
        open={addItemModalOpen}
        onOpenChange={setAddItemModalOpen}
        collectionId={null}
        onItemCreated={() => {
          // Items will be automatically updated via context
        }}
      />


      {/* Collection Creation Dialog */}
      <ManualCollectionDialog
        trigger={
          <div style={{ display: 'none' }}>
            {/* Hidden trigger - dialog will be opened programmatically */}
          </div>
        }
        onCollectionCreated={() => {
          setCollectionDialogOpen(false)
          toast({
            title: "Collection created",
            description: "Your collection has been created successfully.",
          })
        }}
      />

      {/* AI Collection Preview Modal */}
      <AICollectionPreviewModal
        open={aiPreviewModalOpen}
        onOpenChange={setAiPreviewModalOpen}
        recommendation={currentRecommendation}
        onCreateCollection={handleCreateAICollection}
      />

    </div>
  )
}

function DashboardView({
  items,
  onCategoryClick,
}: { items: MockCatalogItem[]; onCategoryClick: (category: string) => void }) {
  const categoryCounts = React.useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [items])

  const recentItems: MockCatalogItem[] = []

  return (
    <div className="flex-1 overflow-auto bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Objects</p>
                <p className="mt-2 text-3xl font-bold">{items.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span> from last month
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Collections</p>
                <p className="mt-2 text-3xl font-bold">0</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Create your first collection</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="mt-2 text-3xl font-bold">{Object.keys(categoryCounts).length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Tag className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Across all objects</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared Objects</p>
                <p className="mt-2 text-3xl font-bold">{items.filter((i) => i.sharedWith && i.sharedWith.length > 0).length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Collaborating with team</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold">Objects by Category</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-accent"
              >
                <span className="text-sm font-medium">{category}</span>
                <Badge variant="secondary">{count}</Badge>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent Collections</h3>
          </div>
          <EmptyState
            icon={FolderOpen}
            title="No collections yet"
            description="Create your first collection to organize your objects"
            size="default"
            action={
              <ManualCollectionDialog
                trigger={
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                }
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

function CardView({
  items,
  selectedItems,
  onSelectItem,
  onPinSelected,
  onUnpinSelected,
  onCreateCollectionFromSelected,
  onClearSelection,
  onDeleteClick,
  activeView,
  isCollectionView,
}: {
  items: MockCatalogItem[]
  selectedItems: Set<string>
  onSelectItem: (id: string, checked: boolean) => void
  onPinSelected: () => void
  onUnpinSelected: () => void
  onCreateCollectionFromSelected: () => void
  onClearSelection: () => void
  onDeleteClick: () => void
  activeView: string
  isCollectionView: boolean
}) {
  const selectedCount = selectedItems.size

  return (
    <div>
      {selectedCount > 0 && (
        <div className="sticky top-0 z-10 -mt-2 mb-4 rounded-lg border border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-4 py-3 shadow-sm">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium">
                {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
              </span>
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                <X className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Clear selection</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <AddOrCreateButton selectedIds={Array.from(selectedItems)} />
              {activeView === "pinned" ? (
                <Button variant="outline" size="sm" onClick={onUnpinSelected}>
                  <Pin className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Unpin items</span>
                  <span className="sm:hidden">Unpin</span>
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={onPinSelected}>
                  <Pin className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Pin items</span>
                  <span className="sm:hidden">Pin</span>
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={onDeleteClick}>
                <span className="hidden sm:inline">{isCollectionView ? 'Remove items' : 'Delete items'}</span>
                <span className="sm:hidden">{isCollectionView ? 'Remove' : 'Delete'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-sm ${
            selectedItems.has(item.id) ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectItem(item.id, !selectedItems.has(item.id))}
        >
          {/* Checkbox in top left (visible on hover or when selected) */}
          <div
            className={`absolute left-4 top-4 z-10 transition-opacity ${
              selectedItems.has(item.id)
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Checkbox
              checked={selectedItems.has(item.id)}
              onCheckedChange={(checked) => {
                onSelectItem(item.id, checked as boolean)
              }}
            />
          </div>
          
          {/* Actions menu in top right */}
          <div className="absolute right-4 top-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Vertical layout with centered photo/icon */}
          <div className="space-y-3 mt-2">
            {/* Photo/Icon section */}
            <CardItemThumbnail item={item} />
            
            {/* Main content */}
            <div className="space-y-2 px-2">
              {/* Title and ID */}
              <div>
                <Link 
                  href={`/catalog/${item.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-sm leading-tight text-foreground hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
              </div>
              
              {/* Category */}
              <div>
                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                {item.pinned && <Pin className="inline h-3 w-3 text-muted-foreground ml-2" />}
              </div>
              
              {/* Description if exists - removed as item doesn't have description property */}
              
              {/* Bottom section with user access info and date */}
              <div className="flex items-center justify-between pt-2">
                {/* User access section */}
                <div className="flex items-center gap-1">
                  {item.people && item.people.slice(0, 3).map((person, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700"
                      title={`${person.role}: ${person.name}`}
                    >
                      {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  ))}
                  {item.people && item.people.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{item.people.length - 3}</span>
                  )}
                  {(!item.people || item.people.length === 0) && (
                    <span className="text-xs text-muted-foreground">No access info</span>
                  )}
                </div>
                
                {/* Date */}
                <span className="text-xs text-muted-foreground">{item.createdOn}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

function GridView({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  allSelected,
  onPinSelected,
  onUnpinSelected,
  onCreateCollectionFromSelected,
  onClearSelection,
  onDeleteClick,
  activeView,
  isCollectionView,
}: {
  items: MockCatalogItem[]
  selectedItems: Set<string>
  onSelectItem: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  allSelected: boolean
  onPinSelected: () => void
  onUnpinSelected: () => void
  onCreateCollectionFromSelected: () => void
  onClearSelection: () => void
  onDeleteClick: () => void
  activeView: string
  isCollectionView: boolean
}) {
  const indeterminate = selectedItems.size > 0 && selectedItems.size < items.length
  const selectedCount = selectedItems.size

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <Checkbox 
                  checked={indeterminate ? "indeterminate" : allSelected} 
                  onCheckedChange={onSelectAll}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">ID</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Access</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Created by</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Created on</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Last update</th>
              <th className="w-12 p-4"></th>
            </tr>
            {selectedCount > 0 && (
              <tr className="border-b border-border bg-muted">
                <td colSpan={8} className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="text-sm font-medium">
                        {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
                      </span>
                      <Button variant="ghost" size="sm" onClick={onClearSelection}>
                        <X className="mr-1 sm:mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Clear selection</span>
                        <span className="sm:hidden">Clear</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <AddOrCreateButton selectedIds={Array.from(selectedItems)} />
                      {activeView === "pinned" ? (
                        <Button variant="outline" size="sm" onClick={onUnpinSelected}>
                          <Pin className="mr-1 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Unpin items</span>
                          <span className="sm:hidden">Unpin</span>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={onPinSelected}>
                          <Pin className="mr-1 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Pin items</span>
                          <span className="sm:hidden">Pin</span>
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={onDeleteClick}>
                        <span className="hidden sm:inline">{isCollectionView ? 'Remove items' : 'Delete items'}</span>
                        <span className="sm:hidden">{isCollectionView ? 'Remove' : 'Delete'}</span>
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border transition-colors hover:bg-muted/50"
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <TableItemThumbnail item={item} />
                    <Link href={`/catalog/${item.id}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="text-xs">
                    {item.id}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {item.people && item.people.slice(0, 3).map((person, i) => (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700"
                        title={`${person.role}: ${person.name}`}
                      >
                        {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    ))}
                    {item.people && item.people.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{item.people.length - 3}</span>
                    )}
                    {(!item.people || item.people.length === 0) && <span className="text-xs text-muted-foreground">No access info</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{item.createdBy?.avatar || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{item.createdBy?.name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{item.createdOn}</td>
                <td className="p-4 text-sm text-muted-foreground">{item.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableView({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  allSelected,
}: {
  items: MockCatalogItem[]
  selectedItems: Set<string>
  onSelectItem: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  allSelected: boolean
}) {
  const indeterminate = selectedItems.size > 0 && selectedItems.size < items.length
  
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <Checkbox 
                  checked={indeterminate ? "indeterminate" : allSelected} 
                  onCheckedChange={onSelectAll} 
                />
              </th>
              <th className="p-4 text-left text-sm font-medium">Name</th>
              <th className="p-4 text-left text-sm font-medium">ID</th>
              <th className="p-4 text-left text-sm font-medium">Category</th>
              <th className="p-4 text-left text-sm font-medium">Shared with</th>
              <th className="p-4 text-left text-sm font-medium">Created by</th>
              <th className="p-4 text-left text-sm font-medium">Created on</th>
              <th className="p-4 text-left text-sm font-medium">Last update</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-border transition-colors hover:bg-muted/50">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <TableItemThumbnail item={item} />
                    <div className="flex items-center gap-2">
                      <Link href={`/catalog/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      {item.pinned && <Pin className="h-3 w-3 text-primary" />}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="secondary" className="text-xs">
                    {item.id}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{item.category}</td>
                <td className="p-4">
                  {item.people && item.people.length > 0 ? (
                    <div className="flex -space-x-2">
                      {item.people.slice(0, 3).map((person, i) => (
                        <div
                          key={i}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-gray-100 text-sm font-medium text-gray-700"
                          title={`${person.role}: ${person.name}`}
                        >
                          {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      ))}
                      {item.people.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-sm">
                          +{item.people.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No access info</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{item.createdBy?.avatar || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{item.createdBy?.name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{item.createdOn}</td>
                <td className="p-4 text-sm text-muted-foreground">{item.lastUpdate}</td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Move</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border p-4">
        <span className="text-sm text-muted-foreground">Rows: {items.length} | Filtered: 0</span>
      </div>
    </div>
  )
}

function BoardView({ items }: { items: MockCatalogItem[] }) {
  const columns = [
    { id: "new", title: "New", items: items.slice(0, 3) },
    { id: "in-progress", title: "In Progress", items: items.slice(3, 5) },
    { id: "completed", title: "Completed", items: items.slice(5) },
  ]

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex min-w-80 flex-col rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary">{column.items.length}</Badge>
          </div>
          <div className="flex-1 space-y-3 p-4">
            {column.items.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {item.id}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Move</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h4 className="mb-2 line-clamp-2 text-balance font-medium leading-tight">{item.name}</h4>
                <p className="mb-3 text-xs text-muted-foreground">{item.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {item.sharedWith && item.sharedWith.slice(0, 2).map((user, i) => (
                      <Avatar key={i} className="h-5 w-5 border-2 border-background">
                        <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                    {item.sharedWith && item.sharedWith.length > 2 && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                        +{item.sharedWith.length - 2}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.createdOn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

