"use client"

import React from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CollectionSettingsDialog } from "@/components/collection-settings-dialog"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AICollectionDialog } from "@/components/ai-collection-dialog"
import { Badge } from "@/components/ui/badge"

interface Collection {
  id: string
  name: string
  icon: React.ReactNode
  count: number
  description?: string
  isAI?: boolean
  sharedBy?: string
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

const collections: Collection[] = []

interface CatalogSidebarProps {
  activeView?: string
  onViewChange?: (view: string) => void
}

export function CatalogSidebar({ activeView = "dashboard", onViewChange }: CatalogSidebarProps) {
  const [collectionsExpanded, setCollectionsExpanded] = React.useState(true)
  const [sharedExpanded, setSharedExpanded] = React.useState(true)

  const handleCollectionClick = (collectionId: string) => {
    onViewChange?.(collectionId)
  }

  const aiSuggestions: any[] = []

  const sharedCollections: any[] = []

  return (
    <div className="flex h-screen w-56 min-w-[200px] max-w-[240px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-3">
        <h2 className="font-semibold text-sidebar-foreground">Catalog</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {/* Organization Dropdown */}
          <div className="mb-3 px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                  ONB
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>ONB</DropdownMenuItem>
                <DropdownMenuItem>All Categories</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          </Button>

          {/* Collections Section */}
          <div className="mt-4">
            <button
              onClick={() => setCollectionsExpanded(!collectionsExpanded)}
              className="mb-3 flex w-full items-center justify-between px-2 hover:bg-accent/50 rounded-md py-1 transition-colors"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Collections</h3>
              {collectionsExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </button>

            {collectionsExpanded && (
              <>
                {collections.length === 0 ? (
                  <div className="px-2 py-6 text-center">
                    <Folder className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="mb-1 text-sm font-medium text-muted-foreground">No collections yet</p>
                    <p className="mb-4 text-xs text-muted-foreground/70">Create collections to organize your objects</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {collections.map((collection) => (
                      <CollectionItem
                        key={collection.id}
                        collection={collection}
                        activeView={activeView}
                        onCollectionClick={handleCollectionClick}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-2 space-y-1">
                  <AICollectionDialog
                    trigger={
                      <Button variant="outline" className="w-full justify-start text-sm font-normal border-primary/20 hover:border-primary/40">
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Create Collection
                      </Button>
                    }
                  />
                  <Button variant="outline" className="w-full justify-start text-sm font-normal border-primary/20 hover:border-primary/40">
                    <Plus className="mr-2 h-4 w-4" />
                    New collection
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Shared with You Section */}
          <div className="mt-6">
            <button
              onClick={() => setSharedExpanded(!sharedExpanded)}
              className="mb-2 flex w-full items-center justify-between px-2 hover:bg-accent/50 rounded-md py-1 transition-colors"
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
}: {
  collection: Collection
  activeView?: string
  onCollectionClick?: (id: string) => void
}) {
  const isActive = activeView === collection.id

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start text-sm font-normal"
          onClick={() => onCollectionClick?.(collection.id)}
        >
          {collection.icon}
          <span className="ml-2">{collection.name}</span>
          <span className="ml-auto text-xs text-muted-foreground">{collection.count}</span>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <CollectionSettingsDialog
          collectionName={collection.name}
          trigger={
            <ContextMenuItem onSelect={(e) => e.preventDefault()}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </ContextMenuItem>
          }
        />
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
