"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  LayoutGrid,
  Plus,
  Bell,
  Settings,
  MoreVertical,
  Share2,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ManualCollectionDialog } from "@/components/manual-collection-dialog"
import { SearchToCollection } from "@/components/search-to-collection"
import { getUnsplashImageUrl, getRandomUnsplashImage } from "@/lib/unsplash"
import { ShareDialog } from "@/components/share-dialog"
import { CollectionSettingsDialog } from "@/components/collection-settings-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCollections } from "@/contexts/collections-context"


interface CatalogViewProps {
  activeView?: string
}

const mockItems = [
  {
    id: "LEG-129",
    name: "Sapphire Holdings LLC",
    category: "Legal entities",
    sharedWith: [
      { name: "John Smith", avatar: "JS" },
      { name: "Jane Doe", avatar: "JD" },
      { name: "Bob Wilson", avatar: "BW" },
    ],
    createdBy: { name: "John Smith", avatar: "JS" },
    createdOn: "Sep 20, 2024",
    lastUpdate: "Sep 20, 2024",
    pinned: false,
  },
  {
    id: "LEG-111",
    name: "Starlight Philanthropies",
    category: "Legal entities",
    sharedWith: [
      { name: "Ember Bett", avatar: "EB" },
      { name: "Alice Cooper", avatar: "AC" },
      { name: "David Lee", avatar: "DL" },
      { name: "Emma Stone", avatar: "ES" },
    ],
    createdBy: { name: "Ember Bett", avatar: "EB" },
    createdOn: "Aug 3, 2024",
    lastUpdate: "Aug 3, 2024",
    pinned: false,
  },
  {
    id: "PROP-045",
    name: "Sunset Villa Estate",
    category: "Properties",
    sharedWith: [{ name: "Sarah Miller", avatar: "SM" }],
    createdBy: { name: "Sarah Miller", avatar: "SM" },
    createdOn: "Oct 15, 2024",
    lastUpdate: "Oct 15, 2024",
    pinned: false,
  },
  {
    id: "PROP-078",
    name: "Downtown Office Complex",
    category: "Properties",
    sharedWith: [
      { name: "Tom Brown", avatar: "TB" },
      { name: "Lisa White", avatar: "LW" },
    ],
    createdBy: { name: "Tom Brown", avatar: "TB" },
    createdOn: "Nov 2, 2024",
    lastUpdate: "Nov 2, 2024",
    pinned: false,
  },
  {
    id: "VEH-234",
    name: "Tesla Model S",
    category: "Vehicles",
    sharedWith: [{ name: "James Levin", avatar: "JL" }],
    createdBy: { name: "James Levin", avatar: "JL" },
    createdOn: "Dec 1, 2024",
    lastUpdate: "Dec 1, 2024",
    pinned: false,
  },
  {
    id: "VEH-567",
    name: "Mercedes-Benz S-Class",
    category: "Vehicles",
    sharedWith: [],
    createdBy: { name: "Jane Smith", avatar: "JS" },
    createdOn: "Nov 20, 2024",
    lastUpdate: "Nov 20, 2024",
    pinned: false,
  },
  {
    id: "AVI-012",
    name: "Gulfstream G650",
    category: "Aviation",
    sharedWith: [
      { name: "Zane Mango", avatar: "ZM" },
      { name: "Rachel Green", avatar: "RG" },
    ],
    createdBy: { name: "Zane Mango", avatar: "ZM" },
    createdOn: "Sep 10, 2024",
    lastUpdate: "Sep 10, 2024",
    pinned: false,
  },
  {
    id: "MAR-089",
    name: "Oceanic Dream Yacht",
    category: "Maritime",
    sharedWith: [{ name: "Leo Franci", avatar: "LF" }],
    createdBy: { name: "Leo Franci", avatar: "LF" },
    createdOn: "Aug 25, 2024",
    lastUpdate: "Aug 25, 2024",
    pinned: false,
  },
  {
    id: "ORG-456",
    name: "Tech Innovations Inc",
    category: "Organizations",
    sharedWith: [{ name: "Charlie Botosh", avatar: "CB" }],
    createdBy: { name: "Charlie Botosh", avatar: "CB" },
    createdOn: "Jul 30, 2024",
    lastUpdate: "Jul 30, 2024",
    pinned: false,
  },
  {
    id: "EVT-789",
    name: "Annual Shareholders Meeting",
    category: "Events",
    sharedWith: [
      { name: "John Smith", avatar: "JS" },
      { name: "Jane Doe", avatar: "JD" },
    ],
    createdBy: { name: "John Smith", avatar: "JS" },
    createdOn: "Dec 15, 2024",
    lastUpdate: "Dec 15, 2024",
    pinned: false,
  },
  {
    id: "PET-123",
    name: "Golden Retriever - Max",
    category: "Pets",
    sharedWith: [],
    createdBy: { name: "Emma Stone", avatar: "ES" },
    createdOn: "Jun 5, 2024",
    lastUpdate: "Jun 5, 2024",
    pinned: false,
  },
  {
    id: "OBL-901",
    name: "Bank Loan Agreement",
    category: "Obligations",
    sharedWith: [
      { name: "David Lee", avatar: "DL" },
      { name: "Sarah Miller", avatar: "SM" },
    ],
    createdBy: { name: "David Lee", avatar: "DL" },
    createdOn: "Oct 1, 2024",
    lastUpdate: "Oct 1, 2024",
    pinned: false,
  },
]

function getCategoryIcon(category: string) {
  const iconMap: Record<string, React.ReactNode> = {
    "Legal entities": <Building2 className="h-5 w-5" />,
    Properties: <Home className="h-5 w-5" />,
    Vehicles: <Car className="h-5 w-5" />,
    Aviation: <Plane className="h-5 w-5" />,
    Maritime: <Ship className="h-5 w-5" />,
    Organizations: <Building2 className="h-5 w-5" />,
    Events: <Calendar className="h-5 w-5" />,
    Pets: <PawPrint className="h-5 w-5" />,
    Obligations: <ScrollText className="h-5 w-5" />,
  }
  return iconMap[category] || <FileText className="h-5 w-5" />
}

// Компонент для відображення в картковому вигляді (великий розмір)
const CardItemThumbnail = ({ item }: { item: any }) => {
  const CategoryIcon = getCategoryIcon(item.category)
  
  // Генеруємо Unsplash URL для цього об'єкта
  const unsplashUrl = getUnsplashImageUrl(item.category, item.name)
  
  return (
    <div className="relative h-24 w-full rounded-lg overflow-hidden">
      <img 
        src={unsplashUrl} 
        alt={item.name}
        className="h-full w-full object-cover"
        onError={(e) => {
          // Якщо Unsplash фото не завантажилося, показуємо fallback
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextElementSibling?.classList.remove('hidden')
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted hidden">
        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-muted/50">
          {CategoryIcon}
        </div>
      </div>
    </div>
  )
}

// Компонент для відображення в табличному вигляді (малий розмір)
const TableItemThumbnail = ({ item }: { item: any }) => {
  const CategoryIcon = getCategoryIcon(item.category)
  
  // Генеруємо Unsplash URL для цього об'єкта (менший розмір для таблиці)
  const unsplashUrl = getUnsplashImageUrl(item.category, item.name).replace('400x300', '200x200')
  
  return (
    <div className="relative h-12 w-12 rounded-lg overflow-hidden">
      <img 
        src={unsplashUrl} 
        alt={item.name}
        className="h-full w-full object-cover"
        onError={(e) => {
          // Якщо Unsplash фото не завантажилося, показуємо fallback
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextElementSibling?.classList.remove('hidden')
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted hidden">
        {CategoryIcon}
      </div>
    </div>
  )
}

export function CatalogView({ activeView = "catalog" }: CatalogViewProps) {
  const { collections, getCollectionById } = useCollections()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState(0)
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [items, setItems] = React.useState(mockItems)
  const [viewMode, setViewMode] = React.useState<"grid" | "card">("grid")

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

  const getFilteredItems = () => {
    let filteredItems = items

    // Check if activeView is a collection ID
    const collection = getCollectionById(activeView)
    if (collection) {
      // For AI-generated collections, use the items directly
      if (collection.type === 'ai-generated' && collection.items) {
        return collection.items
      }
      // For manual collections, apply collection filters
      filteredItems = applyCollectionFilters(filteredItems, collection.filters)
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
    setItems((prevItems) => prevItems.map((item) => (selectedItems.has(item.id) ? { ...item, pinned: true } : item)))
    setSelectedItems(new Set())
  }

  const handleUnpinSelected = () => {
    setItems((prevItems) => prevItems.map((item) => (selectedItems.has(item.id) ? { ...item, pinned: false } : item)))
    setSelectedItems(new Set())
  }

  const handleCreateCollectionFromSelected = () => {
    // This will be handled by the AI Collection Dialog
    console.log("[v0] Creating collection from selected items:", Array.from(selectedItems))
  }


  const selectedCount = selectedItems.size
  const allSelected = filteredItems.length > 0 && selectedItems.size === filteredItems.length

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

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

            {activeView === "dashboard" ? (
              <DashboardView items={items} onCategoryClick={() => {}} />
            ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveFilters(activeFilters > 0 ? 0 : 2)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Columns className="mr-2 h-4 w-4" />
                9/9 columns
              </Button>
              <ShareDialog collectionName={getPageTitle()} />
              <CollectionSettingsDialog collectionName={getPageTitle()} />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "card" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode("card")}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
              <ManualCollectionDialog
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                }
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-background p-6">
            <div className="mx-auto max-w-6xl">
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
                onPinSelected={handlePinSelected}
                onUnpinSelected={handleUnpinSelected}
                onCreateCollectionFromSelected={handleCreateCollectionFromSelected}
                onClearSelection={() => setSelectedItems(new Set())}
                activeView={activeView}
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
                activeView={activeView}
              />
            )}
            </div>
          </div>
        </>
      )}

    </div>
  )
}

function DashboardView({
  items,
  onCategoryClick,
}: { items: typeof mockItems; onCategoryClick: (category: string) => void }) {
  const categoryCounts = React.useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [items])

  const recentItems: typeof mockItems = []

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
          <div className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-2 text-sm font-medium text-muted-foreground">No collections yet</p>
            <p className="mb-4 text-center text-xs text-muted-foreground/70">
              Create your first collection to organize your objects
            </p>
            <ManualCollectionDialog
              trigger={
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              }
            />
          </div>
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
  activeView,
}: {
  items: typeof mockItems
  selectedItems: Set<string>
  onSelectItem: (id: string, checked: boolean) => void
  onPinSelected: () => void
  onUnpinSelected: () => void
  onCreateCollectionFromSelected: () => void
  onClearSelection: () => void
  activeView: string
}) {
  const selectedCount = selectedItems.size

  return (
    <div>
      {selectedCount > 0 && (
        <div className="sticky top-0 z-10 -mt-2 mb-4 rounded-lg border border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-4 py-3 shadow-sm">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
              </span>
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                <X className="mr-2 h-4 w-4" />
                Clear selection
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onPinSelected}>
                <Pin className="mr-2 h-4 w-4" />
                Pin
              </Button>
              {activeView === "pinned" && (
                <Button variant="outline" size="sm" onClick={onUnpinSelected}>
                  <Pin className="mr-2 h-4 w-4" />
                  Unpin
                </Button>
              )}
              <ManualCollectionDialog
                trigger={
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                }
                selectedItems={Array.from(selectedItems)}
              />
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
              onChange={(e) => {
                e.stopPropagation()
                onSelectItem(item.id, e.target.checked)
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
              
              {/* Description if exists */}
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              )}
              
              {/* Bottom section with shared info and date */}
              <div className="flex items-center justify-between pt-2">
                {/* Shared with section */}
                <div className="flex items-center gap-1">
                  {item.sharedWith && item.sharedWith.slice(0, 3).map((user, i) => (
                    <div
                      key={i}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                    >
                      {user.avatar}
                    </div>
                  ))}
                  {item.sharedWith && item.sharedWith.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{item.sharedWith.length - 3}</span>
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
  onPinSelected,
  onUnpinSelected,
  onCreateCollectionFromSelected,
  onClearSelection,
  activeView,
}: {
  items: typeof mockItems
  selectedItems: Set<string>
  onSelectItem: (id: string, checked: boolean) => void
  onPinSelected: () => void
  onUnpinSelected: () => void
  onCreateCollectionFromSelected: () => void
  onClearSelection: () => void
  activeView: string
}) {
  const allSelected = items.length > 0 && selectedItems.size === items.length
  const selectedCount = selectedItems.size
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      items.forEach((item) => onSelectItem(item.id, true))
    } else {
      items.forEach((item) => onSelectItem(item.id, false))
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          {selectedCount > 0 ? (
            <thead className="border-b border-border bg-muted">
              <tr>
                <td colSpan={8} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
                      </span>
                      <Button variant="ghost" size="sm" onClick={onClearSelection}>
                        <X className="mr-2 h-4 w-4" />
                        Clear selection
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={onPinSelected}>
                        <Pin className="mr-2 h-4 w-4" />
                        Pin
                      </Button>
                      {activeView === "pinned" && (
                        <Button variant="outline" size="sm" onClick={onUnpinSelected}>
                          <Pin className="mr-2 h-4 w-4" />
                          Unpin
                        </Button>
                      )}
                      <ManualCollectionDialog
                        trigger={
                          <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Create
                          </Button>
                        }
                        selectedItems={Array.from(selectedItems)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
          ) : (
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="w-12 p-4">
                  <Checkbox 
                    checked={allSelected} 
                    onCheckedChange={handleSelectAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Shared with</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Created by</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Created on</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Last update</th>
              </tr>
            </thead>
          )}
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
                    {item.sharedWith && item.sharedWith.slice(0, 3).map((user, i) => (
                      <span key={i} className="text-xs font-medium text-muted-foreground">
                        {user.avatar}
                      </span>
                    ))}
                    {item.sharedWith && item.sharedWith.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{item.sharedWith.length - 3}</span>
                    )}
                    {(!item.sharedWith || item.sharedWith.length === 0) && <span className="text-xs text-muted-foreground">No shares</span>}
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
  items: typeof mockItems
  selectedItems: Set<string>
  onSelectItem: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  allSelected: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
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
                  {item.sharedWith && item.sharedWith.length > 0 ? (
                    <div className="flex -space-x-2">
                      {item.sharedWith.slice(0, 3).map((user, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-card">
                          <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                      {item.sharedWith.length > 3 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-xs">
                          +{item.sharedWith.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">All users</span>
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
                      <ShareDialog
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                        }
                        collectionName={item.name}
                      />
                      <CollectionSettingsDialog
                        collectionName={item.name}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileText className="mr-2 h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
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

function BoardView({ items }: { items: typeof mockItems }) {
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

