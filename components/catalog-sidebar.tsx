"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  Folder,
  Plus,
  Settings,
  LayoutDashboard,
  Database,
  Clock,
  Pin,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Users,
  Building2,
  Building,
  Briefcase,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CollectionSettingsDialog } from "@/components/collection-settings-dialog"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManualCollectionDialog } from "@/components/manual-collection-dialog"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCollections } from "@/contexts/collections-context"

// Import icons for collection display
const ALL_ICONS = [
  { name: "Layers", icon: Folder },
  { name: "FolderOpen", icon: Folder },
  { name: "FileText", icon: Folder },
  { name: "Tag", icon: Folder },
  { name: "Star", icon: Folder },
  { name: "Heart", icon: Folder },
  { name: "Zap", icon: Folder },
  { name: "Shield", icon: Folder },
  { name: "Globe", icon: Folder },
  { name: "Target", icon: Folder },
  { name: "Award", icon: Folder },
  { name: "Trophy", icon: Folder },
  { name: "Building2", icon: Building2 },
  { name: "Home", icon: Folder },
  { name: "Car", icon: Folder },
  { name: "Plane", icon: Folder },
  { name: "Ship", icon: Folder },
  { name: "Calendar", icon: Folder },
  { name: "PawPrint", icon: Folder },
  { name: "Users", icon: Users },
  { name: "Settings", icon: Settings },
  { name: "Briefcase", icon: Briefcase },
]

interface Collection {
  id: string
  name: string
  icon: React.ReactNode
  count: number
  description?: string
  isAI?: boolean
  sharedBy?: string
}

interface Organization {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  color: string
  theme: string
  stats: {
    totalObjects: number
    categories: number
    collections: number
    pinnedItems: number
  }
  characteristics: string[]
}

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

// Remove this line - we'll use context instead

const organizations: Organization[] = [
  {
    id: "onb",
    name: "ONB",
    description: "Oil Nut Bay",
    icon: <Building2 className="h-4 w-4" />,
    color: "blue",
    theme: "luxury-resort",
    stats: {
      totalObjects: 156,
      categories: 12,
      collections: 24,
      pinnedItems: 18
    },
    characteristics: ["Luxury Villas", "Marina Village", "Beach Club", "Real Estate", "Dining", "Water Sports", "Spa Services"]
  },
  {
    id: "tech-innovations",
    name: "Tech Innovations Inc",
    description: "Technology Solutions",
    icon: <Database className="h-4 w-4" />,
    color: "green",
    theme: "technology",
    stats: {
      totalObjects: 28,
      categories: 6,
      collections: 8,
      pinnedItems: 7
    },
    characteristics: ["Software Development", "AI Research", "Cloud Infrastructure", "Innovation Labs"]
  },
  {
    id: "sapphire-holdings",
    name: "Sapphire Holdings LLC",
    description: "Investment Management",
    icon: <Building className="h-4 w-4" />,
    color: "blue",
    theme: "investment",
    stats: {
      totalObjects: 67,
      categories: 10,
      collections: 15,
      pinnedItems: 12
    },
    characteristics: ["Portfolio Management", "Real Estate", "Private Equity", "Asset Valuation"]
  },
  {
    id: "starlight-philanthropies",
    name: "Starlight Philanthropies",
    description: "Charitable Foundation",
    icon: <Users className="h-4 w-4" />,
    color: "gold",
    theme: "philanthropy",
    stats: {
      totalObjects: 23,
      categories: 5,
      collections: 6,
      pinnedItems: 2
    },
    characteristics: ["Charitable Programs", "Grant Management", "Community Outreach", "Impact Measurement"]
  }
]

interface CatalogSidebarProps {
  activeView?: string
  onViewChange?: (view: string) => void
  onOrganizationChange?: (organizationId: string) => void
  pinnedCount?: number
  onCollectionSelect?: (collectionId: string | null) => void
  selectedCollectionId?: string | null
}

export function CatalogSidebar({ 
  activeView = "dashboard", 
  onViewChange, 
  onOrganizationChange, 
  pinnedCount = 0,
  onCollectionSelect,
  selectedCollectionId
}: CatalogSidebarProps) {
  const { collections } = useCollections()
  const [collectionsExpanded, setCollectionsExpanded] = React.useState(true)
  const [sharedExpanded, setSharedExpanded] = React.useState(true)
  const [selectedOrganization, setSelectedOrganization] = React.useState("onb")

  const handleCollectionClick = (collectionId: string) => {
    onViewChange?.(collectionId)
  }

  const handleOrganizationChange = (organizationId: string) => {
    setSelectedOrganization(organizationId)
    onOrganizationChange?.(organizationId)
  }

  const aiSuggestions: any[] = []

  const sharedCollections: any[] = []

  const currentOrganization = organizations.find(org => org.id === selectedOrganization) || organizations[0]
  
  // Debug logs
  console.log("Organizations:", organizations)
  console.log("Selected organization:", selectedOrganization)
  console.log("Current organization:", currentOrganization)

  return (
    <div className="flex h-screen w-56 min-w-[200px] max-w-[240px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-3">
        <h2 className="font-semibold text-sidebar-foreground">Catalog</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {/* Organization Select */}
          <div className="mb-3 px-2">
            <Select value={selectedOrganization} onValueChange={handleOrganizationChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  {currentOrganization.icon}
                  <span className="font-medium truncate">{currentOrganization.name}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id} className="truncate">
                    {org.name}
                  </SelectItem>
                ))}
                <SelectItem value="all-organizations" className="truncate">
                  All Organizations
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dashboard Tab */}
          <Button
            variant={activeView === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange?.("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Dashboard</span>
          </Button>

          <Button
            variant={activeView === "all-objects" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange?.("all-objects")}
          >
            <Database className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">All objects</span>
          </Button>

          <Button
            variant={activeView === "recently-viewed" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange?.("recently-viewed")}
          >
            <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Recently viewed</span>
          </Button>

          <Button
            variant={activeView === "pinned" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange?.("pinned")}
          >
            <Pin className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Pinned</span>
            {pinnedCount > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {pinnedCount}
              </Badge>
            )}
          </Button>

          {/* Collections Section */}
          <div className="mt-4">
            <div className="mb-3 flex w-full items-center justify-between px-2 hover:bg-accent/50 rounded-md py-1 transition-colors group">
              <button
                onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                className="flex items-center gap-2 flex-1"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Collections</h3>
                {collectionsExpanded ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </button>
              <ManualCollectionDialog
                trigger={
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded-sm"
                    title="Create new collection"
                  >
                    <Plus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                }
                onCollectionCreated={() => {
                  // Колекція буде автоматично оновлена через контекст
                }}
              />
            </div>

            {collectionsExpanded && (
              <>
                {collections.length === 0 ? (
                  <div className="px-2 py-6 text-center">
                    <Folder className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="mb-1 text-sm font-medium text-muted-foreground">No collections yet</p>
                    <p className="mb-4 text-xs text-muted-foreground/70">Group items into collections to organize your objects</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {collections.map((collection) => (
                      <CollectionItem
                        key={collection.id}
                        collection={collection}
                        activeView={activeView}
                        onCollectionClick={handleCollectionClick}
                        onCollectionSelect={onCollectionSelect}
                        selectedCollectionId={selectedCollectionId}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-2 space-y-1">
                  <ManualCollectionDialog
                    trigger={
                      <Button variant="outline" className="w-full justify-start text-sm font-normal border-primary/20 hover:border-primary/40">
                        <Plus className="mr-2 h-4 w-4" />
                        New collection
                      </Button>
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* Shared with You Section */}
          <div className="mt-6">
            <div className="mb-2 flex w-full items-center justify-between px-2 hover:bg-accent/50 rounded-md py-1 transition-colors group">
              <button
                onClick={() => setSharedExpanded(!sharedExpanded)}
                className="flex items-center gap-2 flex-1"
              >
                <h3 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Users className="h-3 w-3" />
                  Shared with You
                </h3>
                {sharedExpanded ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </button>
              <ManualCollectionDialog
                trigger={
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded-sm"
                    title="Create new collection"
                  >
                    <Plus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                }
                onCollectionCreated={() => {
                  // Колекція буде автоматично оновлена через контекст
                }}
              />
            </div>

            {sharedExpanded && (
              <>
                {sharedCollections.length === 0 ? (
                  <div className="px-2 py-6 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="mb-1 text-sm font-medium text-muted-foreground">No shared collections</p>
                    <p className="text-xs text-muted-foreground/70">Collections shared with you will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sharedCollections.map((collection) => (
                      <Button
                        key={collection.id}
                        variant={activeView === collection.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm font-normal"
                        onClick={() => handleCollectionClick(collection.id)}
                      >
                        <Folder className="mr-2 h-4 w-4" />
                        <span className="flex-1 truncate text-left">{collection.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {collection.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function CollectionItem({
  collection,
  activeView,
  onCollectionClick,
  onCollectionSelect,
  selectedCollectionId,
}: {
  collection: any // Using any for now since we're mixing old and new interfaces
  activeView?: string
  onCollectionClick?: (id: string) => void
  onCollectionSelect?: (collectionId: string | null) => void
  selectedCollectionId?: string | null
}) {
  const router = useRouter()
  const isActive = activeView === collection.id
  const isSelected = selectedCollectionId === collection.id

  // Get icon component based on collection data
  const getIcon = () => {
    if (collection.customImage) {
      return <img src={collection.customImage} alt="Custom" className="h-4 w-4 rounded object-cover" />
    }
    
    // Find icon by name
    const iconData = ALL_ICONS.find(icon => icon.name === collection.icon)
    if (iconData) {
      const IconComponent = iconData.icon
      return <IconComponent className="h-4 w-4" />
    }
    
    // Fallback to folder icon
    return <Folder className="h-4 w-4" />
  }

  return (
    <div className="relative group">
      <ContextMenu>
        <ContextMenuTrigger>
          <Button
            variant={isSelected ? "secondary" : "ghost"}
            className="w-full justify-start text-sm font-normal"
            onClick={() => {
              if (onCollectionSelect) {
                onCollectionSelect(isSelected ? null : collection.id)
              } else if (onCollectionClick) {
                onCollectionClick(collection.id)
              } else {
                // Fallback to old navigation
                router.push(`/collections/${collection.id}`)
              }
            }}
          >
            {getIcon()}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2 flex-1 text-left overflow-hidden pr-2" style={{ minWidth: 0, width: 0 }}>
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap !text-ellipsis !overflow-hidden !whitespace-nowrap">{collection.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="max-w-xs break-words">{collection.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Show count by default, show actions on hover */}
            <span className="ml-auto text-xs text-muted-foreground flex-shrink-0 group-hover:hidden">{collection.itemCount || 0}</span>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
          <ContextMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </ContextMenuItem>
          <ContextMenuItem>Rename</ContextMenuItem>
          <ContextMenuItem className="text-destructive">Remove Collection</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      {/* Hover Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            if (onCollectionSelect) {
              onCollectionSelect(collection.id)
            } else if (onCollectionClick) {
              onCollectionClick(collection.id)
            } else {
              router.push(`/collections/${collection.id}`)
            }
          }}>
            <Eye className="mr-2 h-4 w-4" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            <Edit3 className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Collection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
