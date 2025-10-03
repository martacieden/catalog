"use client"

import * as React from "react"
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
import { AICollectionDialog } from "@/components/ai-collection-dialog"
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

// AI Suggested Collections for Oil Nut Bay Resort
const aiSuggestionCards = [
  {
    id: "luxury-villas",
    name: "Luxury Villas & Properties",
    description: "Beachfront estates, hillside villas, and vacation rental properties",
    itemCount: 28,
    icon: ResortIcon,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "marina-assets",
    name: "Marina Village Assets",
    description: "Private marina, boats, water sports equipment, and marine facilities",
    itemCount: 22,
    icon: MarinaIcon,
    color: "from-teal-500/20 to-blue-500/20",
  },
  {
    id: "resort-amenities",
    name: "Resort Amenities",
    description: "Spa facilities, dining venues, beach club, and recreational activities",
    itemCount: 35,
    icon: AmenitiesIcon,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "guest-experiences",
    name: "Guest Experiences",
    description: "Activities, events, excursions, and personalized service records",
    itemCount: 19,
    icon: ExperienceIcon,
    color: "from-purple-500/20 to-pink-500/20",
  },
]

export function CollectionsDashboard() {
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false)
  const [selectedCollectionType, setSelectedCollectionType] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState<string>("")

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

  return (
    <div className="space-y-8">
      {/* AI-Powered Collections Hero */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-background p-4 shadow-sm">
        <div className="relative z-10 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-lg">
            <Sparkles className="h-3 w-3" />
            AI-Powered Collections
          </div>
          
          <h1 className="mb-2 text-lg font-bold leading-tight text-foreground">
            Organize Everything, Find Anything Instantly
          </h1>
          
          <p className="mb-4 mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            Create smart collections with AI assistance, collaborate with your team, and manage your data with powerful views and filters.
          </p>
          
          {/* AI Prompt Examples */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Try these AI prompts:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handlePromptClick("high-value assets requiring maintenance")}
                className="h-7 px-3 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
              >
                high-value assets requiring maintenance
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handlePromptClick("guest preferences and special requests")}
                className="h-7 px-3 text-xs bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 hover:text-purple-800 border-purple-200 hover:border-purple-300 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
              >
                guest preferences and special requests
              </Button>
            </div>
          </div>
          
                 {/* Search Input */}
                 <div className="relative mx-auto max-w-2xl">
                   <div className="relative flex items-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus-within:shadow-xl">
                     <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                     <input
                       type="text"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Search for items or ask AI to create a collection..."
                       className="w-full rounded-lg bg-transparent px-10 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                     />
                     <Button 
                       size="sm" 
                       onClick={handleAICreate}
                       disabled={!searchQuery.trim()}
                       className="absolute right-1 bg-gradient-to-r from-primary to-accent text-white hover:scale-105 transition-all duration-200 shadow-md h-7 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <Sparkles className="h-3 w-3 mr-1" />
                       Ask AI to Create
                     </Button>
                   </div>
                 </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-accent/20 blur-2xl" />
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
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg p-0"
              onClick={() => handleAISuggestionClick(suggestion.id)}
            >
        <div className={`h-24 bg-gradient-to-br ${suggestion.color} p-4`}>
                <div className="flex h-full items-center justify-center">
            <suggestion.icon className="h-10 w-10 text-foreground/60 stroke-[1.5]" />
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
              <CardContent className="pt-4 pb-4">
                <div className="mt-4">
                  <AICollectionDialog
                    trigger={
                      <Button
                        className="w-full gap-2 opacity-0 transition-opacity group-hover:opacity-100"
                        variant="secondary"
                      >
                        View Collection
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
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
      />
    </div>
  )
}

