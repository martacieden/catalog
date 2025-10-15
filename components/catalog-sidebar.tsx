"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  Folder,
  FolderPlus,
  Plus,
  Settings,
  LayoutDashboard,
  Database,
  Clock,
  Pin,
  PinOff,
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
  Download,
  Edit,
  Link,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CollectionSettingsDialog } from "@/components/collection-settings-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManualCollectionDialog } from "@/components/manual-collection-dialog"
import { Badge } from "@/components/ui/badge"
import { useCollections } from "@/contexts/collections-context"
import { CollectionType } from "@/types/collection"
import { EmptyState } from "@/components/ui/empty-state"
import { DependenciesSection, DependenciesIndicator } from "@/components/navigation/dependencies-section"
import { MOCK_CATALOG_ITEMS } from "@/lib/mock-data"
import { CollectionEditDialog } from "@/components/collections/collection-edit-dialog"
import { ShareModal } from "@/components/collections/share-modal"
import { RemoveCollectionDialog } from "@/components/remove-collection-dialog"
import { CreateDependencyDialog } from "@/components/collections/create-dependency-dialog"
import { CreateSubcollectionDialog } from "@/components/collections/create-subcollection-dialog"
import { useToast } from "@/hooks/use-toast"

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
  onCollectionClick?: (collectionId: string) => void
  selectedCollectionId?: string | null
}

export function CatalogSidebar({ 
  activeView = "dashboard", 
  onViewChange, 
  onOrganizationChange, 
  pinnedCount = 0,
  onCollectionSelect,
  onCollectionClick,
  selectedCollectionId
}: CatalogSidebarProps) {
  const { 
    collections,
    getSubcollections,
    getDependencies,
    getDependencyGroups,
  } = useCollections()
  const [collectionsExpanded, setCollectionsExpanded] = React.useState(true)
  const [sharedExpanded, setSharedExpanded] = React.useState(true)
  const [selectedOrganization, setSelectedOrganization] = React.useState("onb")
  const [expandedCollections, setExpandedCollections] = React.useState<Set<string>>(new Set(['aviation-main']))

  const handleCollectionClick = (collectionId: string) => {
    onViewChange?.(collectionId)
  }

  const handleOrganizationChange = (organizationId: string) => {
    setSelectedOrganization(organizationId)
    onOrganizationChange?.(organizationId)
  }

  const toggleCollectionExpansion = (collectionId: string) => {
    setExpandedCollections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId)
      } else {
        newSet.add(collectionId)
      }
      return newSet
    })
  }

  const aiSuggestions: any[] = []

  const sharedCollections: any[] = []

  const currentOrganization = organizations.find(org => org.id === selectedOrganization) || organizations[0]

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

          {/* Main Navigation Items */}
          <Button
            variant={activeView === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange?.("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Overview</span>
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

          {/* Collections - Now at the same level */}
          {collections.length > 0 && (
            <>
              {/* Visual separator */}
              <div className="my-2 border-t border-sidebar-border"></div>
              
              {/* Collections header with create button */}
              <div className="mb-2 flex w-full items-center justify-between px-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Collections</h3>
                <ManualCollectionDialog
                  trigger={
                    <button
                      className="opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded-sm"
                      title="Create new collection"
                    >
                      <Plus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  }
                  onCollectionCreated={() => {
                    // Collection will be automatically updated via context
                  }}
                />
              </div>

              {/* Collections list */}
              <div className="space-y-1">
                {collections
                  .filter(collection => !collection.parentId) // Only show root collections
                  .map((collection) => {
                    const dependencies = getDependencies(collection.id)
                    const dependencyGroups = getDependencyGroups(collection.id)
                    const subcollections = getSubcollections(collection.id)
                    const isExpanded = expandedCollections.has(collection.id)
                    
                    return (
                      <div key={collection.id}>
                        <CollectionItem
                          collection={collection}
                          activeView={activeView}
                          onCollectionClick={handleCollectionClick}
                          onCollectionSelect={onCollectionSelect}
                          selectedCollectionId={selectedCollectionId}
                          dependencyCount={dependencies.length}
                          hasSubcollections={subcollections.length > 0}
                          isExpanded={isExpanded}
                          onToggleExpansion={() => toggleCollectionExpansion(collection.id)}
                          allCollections={collections}
                        />
                        
        {/* Subcollections */}
        {subcollections.length > 0 && isExpanded && (
          <div className="ml-2 space-y-0.5 mt-0.5">
            {subcollections.map((subcollection) => (
              <CollectionItem
                key={subcollection.id}
                collection={subcollection}
                activeView={activeView}
                onCollectionClick={handleCollectionClick}
                onCollectionSelect={onCollectionSelect}
                selectedCollectionId={selectedCollectionId}
                dependencyCount={getDependencies(subcollection.id).length}
                isSubcollection={true}
                allCollections={collections}
              />
            ))}
          </div>
        )}
                        
                        {/* Dependencies Section */}
                        {dependencyGroups.length > 0 && (
                          <DependenciesSection
                            dependencies={dependencyGroups}
                            onNavigateToDependency={(depGroup) => {
                              // Navigate to first target collection
                              if (depGroup.targetCollectionIds.length > 0) {
                                handleCollectionClick(depGroup.targetCollectionIds[0])
                              }
                            }}
                            onNavigateToCollection={handleCollectionClick}
                            collapsed={true}
                          />
                        )}
                      </div>
                    )
                  })}
              </div>
            </>
          )}

          {/* Empty state for collections */}
          {collections.length === 0 && (
            <>
              <div className="my-2 border-t border-sidebar-border"></div>
              <div className="mb-2 flex w-full items-center justify-between px-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Collections</h3>
                <ManualCollectionDialog
                  trigger={
                    <button
                      className="opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded-sm"
                      title="Create new collection"
                    >
                      <Plus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  }
                  onCollectionCreated={() => {
                    // Collection will be automatically updated via context
                  }}
                />
              </div>
              <EmptyState
                icon={Folder}
                title="No collections yet"
                description="Group items into collections to organize your objects"
                size="sm"
                className="px-2"
              />
            </>
          )}

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
  dependencyCount = 0,
  hasSubcollections = false,
  isExpanded = false,
  onToggleExpansion,
  isSubcollection = false,
  allCollections = [],
}: {
  collection: any // Using any for now since we're mixing old and new interfaces
  activeView?: string
  onCollectionClick?: (id: string) => void
  onCollectionSelect?: (collectionId: string | null) => void
  selectedCollectionId?: string | null
  dependencyCount?: number
  hasSubcollections?: boolean
  isExpanded?: boolean
  onToggleExpansion?: () => void
  isSubcollection?: boolean
  allCollections?: any[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { updateCollection, removeCollection, createSubcollection } = useCollections()
  const isActive = activeView === collection.id
  const isSelected = selectedCollectionId === collection.id
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [createDependencyOpen, setCreateDependencyOpen] = React.useState(false)
  const [createSubcollectionOpen, setCreateSubcollectionOpen] = React.useState(false)
  
  // Action handlers
  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    const isPinned = collection.tags?.includes('pinned')
    const newTags = isPinned 
      ? (collection.tags || []).filter((tag: string) => tag !== 'pinned')
      : [...(collection.tags || []), 'pinned']
    
    updateCollection(collection.id, { tags: newTags })
    toast({
      title: isPinned ? "Unpinned" : "Pinned",
      description: isPinned 
        ? `"${collection.name}" has been unpinned` 
        : `"${collection.name}" has been pinned`,
    })
  }
  
  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Export collection data as JSON
    const dataStr = JSON.stringify(collection, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${collection.name.replace(/\s+/g, '-').toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Collection exported",
      description: `"${collection.name}" has been exported successfully`,
    })
  }
  
  const handleDelete = () => {
    removeCollection?.(collection.id)
    setDeleteDialogOpen(false)
    toast({
      title: "Collection deleted",
      description: `"${collection.name}" has been deleted`,
      variant: "destructive",
    })
  }
  
  const handleCreateSubcollection = (data: {
    name: string
    description?: string
    type: CollectionType
    icon: string
  }) => {
    createSubcollection(collection.id, {
      name: data.name,
      description: data.description || "",
      type: data.type,
      icon: data.icon,
      category: collection.category,
      tags: [],
      items: [],
      filters: [],
      autoSync: false,
      subcollections: [],
      isSubcollection: true,
      subcollectionCount: 0,
      updatedAt: new Date(),
      createdBy: collection.createdBy,
      viewCount: 0,
    })
    
    // Auto-expand parent collection if not already expanded
    if (onToggleExpansion && !isExpanded) {
      onToggleExpansion()
    }
    
    toast({
      title: "Subcollection created",
      description: `"${data.name}" has been created in "${collection.name}"`,
    })
  }

  // Get icon component based on collection data
  const getIcon = () => {
    if (collection.customImage) {
      return <img src={collection.customImage} alt="Custom" className="h-4 w-4 rounded object-cover" />
    }
    
    // Use Database icon for collections with subcollections
    if (hasSubcollections) {
      return <Database className="h-4 w-4 text-muted-foreground" />
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
    <div className="relative group z-10">
      <div className="flex items-center">
        {/* Expansion button for collections with subcollections */}
        {hasSubcollections && onToggleExpansion && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpansion()
            }}
            className="p-0 hover:bg-transparent"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        )}
        
        
        {/* Subcollection indent */}
        {isSubcollection && (
          <div className="w-2" />
        )}
        
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={`flex-1 justify-start text-sm font-normal pr-8 px-3 py-1.5 ${isSubcollection ? 'text-muted-foreground' : ''}`}
          onClick={() => {
            if (onCollectionClick) {
              onCollectionClick(collection.id)
            } else if (onCollectionSelect) {
              onCollectionSelect(isSelected ? null : collection.id)
            } else {
              // Fallback to old navigation
              router.push(`/collections/${collection.id}`)
            }
          }}
        >
          {getIcon()}
          <div className="ml-2 flex-1 text-left overflow-hidden pr-2" style={{ minWidth: 0, width: 0 }}>
            <div className="flex items-center gap-1">
              <span className={`block overflow-hidden text-ellipsis whitespace-nowrap !text-ellipsis !overflow-hidden !whitespace-nowrap ${!isSubcollection ? 'font-medium' : ''} ${hasSubcollections ? 'font-medium' : ''}`}>
                {isSubcollection && collection.parentId 
                  ? (() => {
                      const parentCollection = allCollections.find(c => c.id === collection.parentId)
                      return parentCollection ? `${parentCollection.name} > ${collection.name}` : collection.name
                    })()
                  : collection.name
                }
              </span>
              <DependenciesIndicator dependencyCount={dependencyCount} />
            </div>
          </div>
          {/* Show count by default, show actions on hover */}
          <span className="ml-auto text-xs text-muted-foreground flex-shrink-0 group-hover:hidden">{collection.itemCount || 0}</span>
        </Button>
      </div>
      
      {/* Hover Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="z-50 w-48">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            setCreateSubcollectionOpen(true)
          }}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Subcollection
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            setEditDialogOpen(true)
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            setShareModalOpen(true)
          }}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            setCreateDependencyOpen(true)
          }}>
            <Link className="mr-2 h-4 w-4" />
            Create Dependency
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePin}>
            {collection.tags?.includes('pinned') ? (
              <>
                <PinOff className="mr-2 h-4 w-4" />
                Unpin
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" />
                Pin
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Dialogs */}
      <CollectionEditDialog
        collection={collection}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      
      <ShareModal
        collection={collection}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
      
      {deleteDialogOpen && (
        <RemoveCollectionDialog
          collectionName={collection.name}
          onConfirm={handleDelete}
          trigger={<div />}
        />
      )}
      
      <CreateDependencyDialog
        open={createDependencyOpen}
        onOpenChange={setCreateDependencyOpen}
        sourceCollectionId={collection.id}
        sourceCollectionName={collection.name}
      />
      
      <CreateSubcollectionDialog
        open={createSubcollectionOpen}
        onOpenChange={setCreateSubcollectionOpen}
        parentCollection={collection}
        onCreateSubcollection={handleCreateSubcollection}
      />
    </div>
  )
}
