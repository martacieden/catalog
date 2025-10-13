"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { formatItemCount, formatRelativeTime, getCategoryColor } from "@/lib/collection-utils"
import { useCollections } from "@/contexts/collections-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sparkles,
  Folder,
  Eye,
  Edit3,
  Copy,
  Share2,
  Trash2,
  MoreHorizontal,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Archive,
  Star,
  Settings,
  Bot,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CollectionCardProps {
  collection: Collection
  layout?: "grid" | "list"
  onView?: (collection: Collection) => void
  onEdit?: (collection: Collection) => void
  onDelete?: (collection: Collection) => void
  onManageItems?: (collection: Collection) => void
  onAIAssistant?: (collection: Collection) => void
  onSyncNow?: (collection: Collection) => void
  showActions?: boolean
}

export function CollectionCard({
  collection,
  layout = "grid",
  onView,
  onEdit,
  onDelete,
  onManageItems,
  onAIAssistant,
  onSyncNow,
  showActions = true,
}: CollectionCardProps) {
  const router = useRouter()
  const { duplicateCollection, removeCollection } = useCollections()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const handleView = () => {
    if (onView) {
      onView(collection)
    } else {
      // Default: navigate to collection detail page
      router.push(`/collections/${collection.id}`)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(collection)
    }
  }

  const handleDuplicate = () => {
    const duplicate = duplicateCollection(collection.id)
    if (duplicate) {
      toast({
        title: "Collection duplicated",
        description: `"${duplicate.name}" has been created.`,
      })
    }
  }

  const handleShare = () => {
    // TODO: Implement sharing in Phase 6
    toast({
      title: "Coming soon",
      description: "Sharing functionality will be available in the next update.",
    })
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleManageItems = () => {
    if (onManageItems) {
      onManageItems(collection)
    }
  }

  const handleAIAssistant = () => {
    if (onAIAssistant) {
      onAIAssistant(collection)
    }
  }

  const handleSyncNow = () => {
    if (onSyncNow) {
      onSyncNow(collection)
    } else {
      toast({
        title: "Sync",
        description: "Sync functionality is available in collection details",
      })
    }
  }

  const confirmDelete = () => {
    removeCollection(collection.id)
    if (onDelete) {
      onDelete(collection)
    }
    toast({
      title: "Collection deleted",
      description: `"${collection.name}" has been removed.`,
      variant: "destructive",
    })
    setShowDeleteDialog(false)
  }

  const getCollectionIcon = () => {
    if (collection.customImage) {
      return (
        <img
          src={collection.customImage}
          alt={collection.name}
          className="h-full w-full object-cover"
        />
      )
    }

    // Спеціальні іконки для різних типів колекцій
    if (collection.name.toLowerCase().includes('business') || collection.name.toLowerCase().includes('ideas')) {
      return <span className="text-2xl">💡</span>
    }
    
    if (collection.name.toLowerCase().includes('legal') || collection.name.toLowerCase().includes('document')) {
      return <span className="text-2xl">📄</span>
    }

    if (collection.type === "ai-generated") {
      return <Sparkles className="h-5 w-5 text-indigo-600" />
    }

    return <Folder className="h-5 w-5 text-blue-600" />
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Legal entities': 'bg-blue-100 text-blue-700 border-blue-200',
      'Properties': 'bg-green-100 text-green-700 border-green-200',
      'Vehicles': 'bg-orange-100 text-orange-700 border-orange-200',
      'Business': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Aviation': 'bg-sky-100 text-sky-700 border-sky-200',
      'Maritime': 'bg-cyan-100 text-cyan-700 border-cyan-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const isArchived = collection.tags?.includes("Archived")

  if (layout === "list") {
    return (
      <div
        className="group relative flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            collection.type === "ai-generated"
              ? "bg-gradient-to-br from-indigo-500/20 to-blue-500/20"
              : "bg-blue-50"
          }`}
        >
          {getCollectionIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{collection.name}</h3>
              {collection.description && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {collection.description}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 shrink-0">
              {isArchived && <Badge variant="secondary" className="text-xs">Archived</Badge>}
              {collection.type === "ai-generated" && (
                <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {formatItemCount(collection.itemCount)}
              </Badge>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatRelativeTime(collection.createdAt)}
            </span>
            {collection.sharedWith && collection.sharedWith.length > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {collection.sharedWith.length}
              </span>
            )}
            {collection.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {collection.viewCount}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className={`flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button variant="ghost" size="sm" onClick={handleView} className="h-8 px-3">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {onManageItems && (
                  <DropdownMenuItem onClick={handleManageItems}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Items
                  </DropdownMenuItem>
                )}
                {onAIAssistant && (
                  <DropdownMenuItem onClick={handleAIAssistant}>
                    <Bot className="h-4 w-4 mr-2" />
                    AI Assistant
                  </DropdownMenuItem>
                )}
                {collection.autoSync && collection.filters && collection.filters.length > 0 && (
                  <DropdownMenuItem onClick={handleSyncNow}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Collection</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{collection.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Header with Icon */}
      <div
        className={`h-24 p-4 border-b border-gray-100 relative overflow-hidden ${
          collection.type === "ai-generated"
            ? "bg-gradient-to-br from-indigo-50 to-blue-50 ai-gradient"
            : "bg-gradient-to-br from-blue-50 to-cyan-50"
        }`}
      >
        <div className="flex h-full items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              collection.type === "ai-generated"
                ? "bg-gradient-to-br from-indigo-500/20 to-blue-500/20"
                : "bg-white/50"
            }`}
          >
            {getCollectionIcon()}
          </div>

          {/* Hover Actions */}
          {showActions && (
            <div className={`flex gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleView(); }}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {onManageItems && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleManageItems(); }}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Items
                    </DropdownMenuItem>
                  )}
                  {onAIAssistant && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAIAssistant(); }}>
                      <Bot className="h-4 w-4 mr-2" />
                      AI Assistant
                    </DropdownMenuItem>
                  )}
                  {collection.autoSync && collection.filters && collection.filters.length > 0 && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSyncNow(); }}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(); }}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare(); }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm line-clamp-1">{collection.name}</h3>
          {isArchived && <Archive className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>

        {collection.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {collection.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Folder className="h-3 w-3" />
            {formatItemCount(collection.itemCount)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatRelativeTime(collection.createdAt)}
          </span>
        </div>

        {/* Badges & Shared */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            {collection.type === "ai-generated" && (
              <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
            )}
            {collection.autoSync && (
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                Auto-sync
              </Badge>
            )}
            {isArchived && (
              <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </Badge>
            )}
            {collection.category && (
              <Badge variant="outline" className={`text-xs ${getCategoryColor(collection.category)}`}>
                {collection.category}
              </Badge>
            )}
          </div>

          {/* Shared avatars */}
          {collection.sharedWith && collection.sharedWith.length > 0 && (
            <div className="flex items-center -space-x-2">
              {collection.sharedWith.slice(0, 3).map((access, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {access.userId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {collection.sharedWith.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs">
                  +{collection.sharedWith.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{collection.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

