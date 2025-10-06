"use client"

import * as React from "react"
import { useCollections } from "@/contexts/collections-context"
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
  AlertTriangle,
  CheckCircle,
  User,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AICollectionPreviewDialog } from "@/components/ai-collection-preview-dialog"

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
  { label: "Total Collections", value: "0", icon: Folder, trend: "Create your first" },
  {
    label: "Total Objects",
    value: totalItems.toString(),
    icon: TrendingUp,
    trend: `${Object.keys(categoryCounts).length} categories`,
  },
  { label: "Categories", value: Object.keys(categoryCounts).length.toString(), icon: Building2, trend: "Organized" },
  { label: "Pinned Items", value: "0", icon: Clock, trend: "Pin important items" },
]


export function CollectionsDashboard() {
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false)
  const [selectedCollectionType, setSelectedCollectionType] = React.useState<string>("")
  const { collections } = useCollections()
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  // Calculate real item counts for AI suggestions based on actual data
  const getAISuggestionCards = () => {
    const propertiesCount = mockItems.filter(item => item.category === "Properties").length
    const maritimeCount = mockItems.filter(item => item.category === "Maritime").length
    const eventsCount = mockItems.filter(item => item.category === "Events").length
    const petsCount = mockItems.filter(item => item.category === "Pets").length

    return [
      {
        id: "luxury-villas",
        name: "Luxury Villas & Properties",
        description: "Beachfront estates, hillside villas, and vacation rental properties",
        itemCount: propertiesCount,
        icon: ResortIcon,
        color: "from-blue-50 to-cyan-50",
      },
      {
        id: "marina-assets",
        name: "Marina Village Assets",
        description: "Private marina, boats, water sports equipment, and marine facilities",
        itemCount: maritimeCount,
        icon: MarinaIcon,
        color: "from-teal-50 to-blue-50",
      },
      {
        id: "resort-amenities",
        name: "Resort Amenities",
        description: "Spa facilities, dining venues, beach club, and recreational activities",
        itemCount: eventsCount,
        icon: AmenitiesIcon,
        color: "from-green-50 to-emerald-50",
      },
      {
        id: "guest-experiences",
        name: "Guest Experiences",
        description: "Activities, events, excursions, and personalized service records",
        itemCount: petsCount,
        icon: ExperienceIcon,
        color: "from-purple-50 to-pink-50",
      },
    ]
  }

  const aiSuggestionCards = getAISuggestionCards()

  const handleAISuggestionClick = (suggestionId: string) => {
    // Open preview dialog with AI suggested items
    setSelectedCollectionType(suggestionId)
    setPreviewDialogOpen(true)
  }

  const handlePromptClick = (promptText: string) => {
    setSearchQuery(promptText)
  }

  const handleAICreate = () => {
    if (searchQuery.trim()) {
      // Simulate AI processing and open dialog with modified collection
      console.log("AI Creating collection with query:", searchQuery)
      setSelectedCollectionType("ai-custom")
      setPreviewDialogOpen(true)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setSearchQuery(prompt)
    // Only populate the search field, don't auto-open dialog
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
            Create smart collections with AI assistance
          </p>
          
          {/* Quick Prompts */}
          <div className="mb-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("high-value assets requiring maintenance")}
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300"
              >
                High-value assets
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("guest preferences and special requests")}
                className="h-7 px-3 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300"
              >
                Guest preferences
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("active legal entities from 2024")}
                className="h-7 px-3 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300"
              >
                Legal entities 2024
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("recently updated items")}
                className="h-7 px-3 text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-300"
              >
                Recent updates
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("items requiring attention")}
                className="h-7 px-3 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300"
              >
                Needs attention
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleQuickPrompt("financial documents and contracts")}
                className="h-7 px-3 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 hover:border-indigo-300"
              >
                Financial docs
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
                placeholder="Search for items or ask AI to create a collection..."
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
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Created Collections Section */}
      {collections.length > 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Your Collections</h2>
              <p className="text-xs text-muted-foreground">Collections you've created with AI assistance</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-sm">{collection.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Folder className="h-3 w-3" />
                        {collection.itemCount} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {collection.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7 text-red-600 hover:text-red-700">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
                  <h2 className="text-lg font-bold">AI Suggested Collections</h2>
            <p className="text-xs text-muted-foreground">AI-powered collections tailored for Oil Nut Bay Resort</p>
          </div>
        </div>
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {aiSuggestionCards.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-sm border border-gray-200 shadow-none bg-white p-0"
              onClick={() => handleAISuggestionClick(suggestion.id)}
            >
        <div className={`h-20 bg-gradient-to-br ${suggestion.color} p-4 border-b border-gray-100`}>
                <div className="flex h-full items-center justify-center">
            <suggestion.icon className="h-8 w-8 text-gray-500 stroke-[1]" />
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
                <Button
                  className="w-full gap-2 opacity-70 hover:opacity-100 transition-opacity"
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log("View Collection clicked")}
                >
                  View Collection
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


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
      />
    </div>
  )
}

