"use client"

import * as React from "react"
import { useCollections } from "@/contexts/collections-context"
import { CollectionCard } from "@/components/collections/collection-card"
import { CollectionEditDialog } from "@/components/collections/collection-edit-dialog"
import {
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Folder,
  ArrowRight,
  Plus,
  Building2,
  Home,
  Car,
  Plane,
  Ship,
  Building,
  Calendar,
  Dog,
  AlertTriangle,
  Star,
  FileText,
  Anchor,
  Waves,
  TreePine,
  Coffee,
  Utensils,
  Bed,
  Camera,
  MapPin,
  Building2 as ResortIcon,
  Ship as MarinaIcon,
  Sparkles as AmenitiesIcon,
  Users as ExperienceIcon,
  Database,
  Search,
  TrendingDown,
  CheckCircle,
  User,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AICollectionPreviewDialog } from "@/components/ai-collection-preview-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockItems = [
  {
    id: "LEG-129",
    name: "Sapphire Holdings LLC",
    category: "Legal entities",
  },
  {
    id: "LEG-111",
    name: "Starlight Philanthropies",
    category: "Legal entities",
  },
  {
    id: "PROP-045",
    name: "Sunset Villa Estate",
    category: "Properties",
  },
  {
    id: "PROP-078",
    name: "Downtown Office Complex",
    category: "Properties",
  },
  {
    id: "VEH-234",
    name: "Tesla Model S",
    category: "Vehicles",
  },
  {
    id: "VEH-567",
    name: "Mercedes-Benz S-Class",
    category: "Vehicles",
  },
  {
    id: "AVI-012",
    name: "Gulfstream G650",
    category: "Aviation",
  },
  {
    id: "MAR-089",
    name: "Oceanic Dream Yacht",
    category: "Maritime",
  },
  {
    id: "ORG-456",
    name: "Tech Innovations Inc",
    category: "Organizations",
  },
  {
    id: "EVT-789",
    name: "Annual Shareholders Meeting",
    category: "Events",
  },
  {
    id: "PET-123",
    name: "Golden Retriever - Max",
    category: "Pets",
  },
  {
    id: "OBL-901",
    name: "Bank Loan Agreement",
    category: "Obligations",
  },
]

const totalItems = mockItems.length
const categoryCounts = mockItems.reduce(
  (acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  },
  {} as Record<string, number>,
)

const stats = [
  { label: "Total Collections", value: "0", icon: Folder },
  {
    label: "Total Objects",
    value: totalItems.toString(),
    icon: TrendingUp,
  },
  { label: "Categories", value: Object.keys(categoryCounts).length.toString(), icon: Building2 },
  { label: "Pinned Items", value: "0", icon: Clock },
]


export function CollectionsDashboard() {
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false)
  const [selectedCollectionType, setSelectedCollectionType] = React.useState<string>("")
  const { collections } = useCollections()
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [editingCollection, setEditingCollection] = React.useState<any>(null)
  const [viewLayout, setViewLayout] = React.useState<"grid" | "list">("grid")

  // AI-powered collection suggestions based on data analysis
  const getAISuggestionCards = () => {
    // Analyze current data to generate intelligent suggestions
    const properties = mockItems.filter(item => item.category === "Properties")
    const maritime = mockItems.filter(item => item.category === "Maritime")
    const events = mockItems.filter(item => item.category === "Events")
    const pets = mockItems.filter(item => item.category === "Pets")
    const vehicles = mockItems.filter(item => item.category === "Vehicles")
    const aviation = mockItems.filter(item => item.category === "Aviation")
    const legal = mockItems.filter(item => item.category === "Legal entities")
    
    // Calculate maintenance needs
    const maintenanceItems = mockItems.filter((item: any) => 
      item.status?.toLowerCase().includes('maintenance') || 
      item.status?.toLowerCase().includes('repair') ||
      item.status?.toLowerCase().includes('attention')
    )
    
    // Calculate high-value assets
    const highValueItems = mockItems.filter(item => 
      item.category === "Properties" || 
      item.category === "Aviation" || 
      item.category === "Maritime"
    )
    
    // Calculate recent updates (last 30 days)
    const recentItems = mockItems.filter((item: any) => {
      const itemDate = new Date(item.date || '')
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return itemDate > thirtyDaysAgo
    })

    const suggestions = []

    // Only suggest collections that have meaningful data
    if (properties.length > 0) {
      suggestions.push({
        id: "luxury-villas",
        name: "Luxury Villas & Properties",
        description: "Beachfront estates, hillside villas, and vacation rental properties",
        itemCount: properties.length,
        icon: ResortIcon,
        color: "from-blue-50 to-cyan-50",
        priority: "high"
      })
    }

    if (maritime.length > 0) {
      suggestions.push({
        id: "marina-assets",
        name: "Marina Village Assets",
        description: "Private marina, boats, water sports equipment, and marine facilities",
        itemCount: maritime.length,
        icon: MarinaIcon,
        color: "from-blue-50 to-cyan-50",
        priority: "medium"
      })
    }

    if (maintenanceItems.length > 2) {
      suggestions.push({
        id: "maintenance-urgent",
        name: "Needs Attention",
        description: "Assets requiring immediate maintenance or repair",
        itemCount: maintenanceItems.length,
        icon: AlertTriangle,
        color: "from-blue-50 to-cyan-50",
        priority: "urgent"
      })
    }

    if (highValueItems.length > 3) {
      suggestions.push({
        id: "high-value-assets",
        name: "High-Value Assets",
        description: "Premium properties, aircraft, and marine vessels",
        itemCount: highValueItems.length,
        icon: Star,
        color: "from-blue-50 to-cyan-50",
        priority: "high"
      })
    }

    if (recentItems.length > 2) {
      suggestions.push({
        id: "recent-updates",
        name: "Recent Updates",
        description: "Recently updated or modified items",
        itemCount: recentItems.length,
        icon: Clock,
        color: "from-blue-50 to-cyan-50",
        priority: "medium"
      })
    }

    if (events.length > 0) {
      suggestions.push({
        id: "resort-amenities",
        name: "Resort Amenities",
        description: "Spa facilities, dining venues, beach club, and recreational activities",
        itemCount: events.length,
        icon: AmenitiesIcon,
        color: "from-blue-50 to-cyan-50",
        priority: "low"
      })
    }

    // Sort by priority: urgent > high > medium > low
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
    return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  const aiSuggestionCards = getAISuggestionCards()

  const handleAISuggestionClick = (suggestionId: string) => {
    // Open preview dialog with AI suggested rules
    setSelectedCollectionType(suggestionId)
    setPreviewDialogOpen(true)
  }

  const handlePromptClick = (promptText: string) => {
    setSearchQuery(promptText)
  }

  const handleAICreate = () => {
    if (searchQuery.trim()) {
      // Open AI Rules-Based dialog for custom prompts
      console.log("AI Creating rules-based collection with query:", searchQuery)
      setSelectedCollectionType("ai-custom")
      setPreviewDialogOpen(true)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setSearchQuery(prompt)
    // Only populate the search field, don't auto-open dialog
  }

  const handleCollectionAction = (action: string, collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) return
    
    switch (action) {
      case 'view':
        // Will be implemented with routing in Phase 3
        console.log('View collection:', collectionId)
        break
      case 'edit':
        setEditingCollection(collection)
        break
      case 'remove':
        // Handled by CollectionCard component
        break
      default:
        break
    }
  }

  const handleCardEdit = (collection: any) => {
    setEditingCollection(collection)
  }

  return (
    <div className="space-y-8">
      {/* AI-Powered Collections Hero */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            AI-Powered Collections
          </h1>
          
          <p className="text-sm text-gray-600 mb-6">
            AI generates filtering rules, you review and customize them
          </p>
          
          {/* AI Rules-Based Quick Prompts */}
          <div className="mb-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("high-value assets above 1M")}
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                💎 High-value assets
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("active legal entities from 2024")}
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                🏢 Legal entities 2024
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("available properties for rent")}
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                🏠 Available properties
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("recently updated items in last 30 days")}
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                📅 Recent updates
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("all flagged items that need attention")}
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                🚩 Needs attention
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("items with financial documents")}
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                💰 Financial docs
              </Button>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative mx-auto max-w-lg">
            <div className="relative flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI to create rules-based collections..."
                className="w-full rounded-lg bg-transparent px-10 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              <Button 
                size="sm" 
                onClick={handleAICreate}
                disabled={!searchQuery.trim()}
                className="absolute right-1 bg-blue-600 text-white hover:bg-blue-700 h-8 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${
                index === 0 ? 'text-blue-500' :
                index === 1 ? 'text-green-500' :
                index === 2 ? 'text-blue-500' :
                'text-orange-500'
              }`} />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Suggestions Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
                  <h2 className="text-lg font-bold">AI Suggested Collections</h2>
            <p className="text-xs text-muted-foreground">AI-generated rule sets for smart collections</p>
          </div>
        </div>
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {aiSuggestionCards.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-105 border border-gray-200 shadow-none bg-white p-0"
              onClick={() => handleAISuggestionClick(suggestion.id)}
            >
        <div className={`h-20 bg-gradient-to-br ${suggestion.color} p-4 border-b border-gray-100 group-hover:opacity-90 transition-opacity`}>
                <div className="flex h-full items-center justify-center">
            <suggestion.icon className="h-8 w-8 text-gray-500 stroke-[1] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <CardHeader className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-1 text-sm">{suggestion.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-balance">{suggestion.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{suggestion.itemCount}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                {/* Button removed - card is now clickable */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Created Collections Section */}
      {collections.length > 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Recent Collections</h2>
              <p className="text-xs text-muted-foreground">Collections you've created with AI assistance</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewLayout === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewLayout("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewLayout === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewLayout("list")}
              >
                List
              </Button>
            </div>
          </div>
          <div className={viewLayout === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                layout={viewLayout}
                onEdit={handleCardEdit}
              />
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shared with You</CardTitle>
              <CardDescription>Collections your team has shared</CardDescription>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No shared collections</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              When team members share collections with you, they will appear here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Collection Preview Dialog */}
      <AICollectionPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        collectionType={selectedCollectionType}
        userPrompt={searchQuery}
        mode="rules"  // 🔥 Use Rules Mode for all AI prompts
      />

      {/* Collection Edit Dialog */}
      {editingCollection && (
        <CollectionEditDialog
          collection={editingCollection}
          open={!!editingCollection}
          onOpenChange={(open) => !open && setEditingCollection(null)}
        />
      )}
    </div>
  )
}

