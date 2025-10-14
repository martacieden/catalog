# 🎨 Collection UI - Components for V0

## 📋 Зміст

1. [Інструкції для V0](#інструкції-для-v0)
2. [Основні Компоненти](#основні-компоненти)
3. [UI Компоненти (shadcn/ui)](#ui-компоненти)
4. [Типи Даних](#типи-даних)
5. [Утиліти](#утиліти)

---

## 🎯 Інструкції для V0

### Як використовувати цей файл з V0

1. **Копіювати по одному компоненту**
   - Кожен компонент має чіткі границі
   - Включає всі залежності
   - Готовий до використання

2. **Встановити залежності**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge dialog
npx shadcn-ui@latest add dropdown-menu alert-dialog
```

3. **Створити типи**
   - Скопіювати типи з розділу [Типи Даних](#типи-даних)
   - Створити `types/` директорію
   - Вставити кожен тип у відповідний файл

4. **Додати утиліти**
   - Скопіювати функції з розділу [Утиліти](#утиліти)
   - Створити `lib/` директорію
   - Вставити кожну утиліту у відповідний файл

---

## 📦 Основні Компоненти

### 1. CollectionCard

**Призначення:** Картка колекції з підтримкою grid/list layout

**Залежності:**
- `@/types/collection`
- `@/lib/collection-utils`
- `@/components/ui/*`

**Використання:**
```tsx
<CollectionCard 
  collection={collection} 
  layout="grid" // or "list"
  onView={(c) => router.push(`/collections/${c.id}`)}
  onEdit={(c) => setEditDialog(c)}
  onDelete={(c) => confirmDelete(c)}
/>
```

**Код:**

```tsx
"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { formatItemCount, formatRelativeTime } from "@/lib/collection-utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Calendar,
  Archive,
} from "lucide-react"

interface CollectionCardProps {
  collection: Collection
  layout?: "grid" | "list"
  onView?: (collection: Collection) => void
  onEdit?: (collection: Collection) => void
  onDelete?: (collection: Collection) => void
  onDuplicate?: (collection: Collection) => void
  onShare?: (collection: Collection) => void
  showActions?: boolean
}

export function CollectionCard({
  collection,
  layout = "grid",
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  showActions = true,
}: CollectionCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const handleView = () => onView?.(collection)
  const handleEdit = () => onEdit?.(collection)
  const handleDuplicate = () => onDuplicate?.(collection)
  const handleShare = () => onShare?.(collection)
  const handleDelete = () => setShowDeleteDialog(true)
  const confirmDelete = () => {
    onDelete?.(collection)
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

    if (collection.type === "ai-generated") {
      return <Sparkles className="h-5 w-5 text-indigo-600" />
    }

    return <Folder className="h-5 w-5 text-blue-600" />
  }

  const isArchived = collection.tags?.includes("Archived")

  if (layout === "list") {
    return (
      <div
        className="group relative flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            collection.type === "ai-generated"
              ? "bg-gradient-to-br from-indigo-500/20 to-blue-500/20"
              : "bg-blue-50"
          }`}
        >
          {getCollectionIcon()}
        </div>

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

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatRelativeTime(collection.createdAt)}
            </span>
          </div>
        </div>

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

  // Grid layout
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div
        className={`h-24 p-4 border-b border-gray-100 ${
          collection.type === "ai-generated"
            ? "bg-gradient-to-br from-indigo-50 to-blue-50"
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
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
          </div>

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
```

---

### 2. AppSidebar

**Призначення:** Головна бокова навігація додатку

**Особливості:**
- Collapsible (з можливістю згортання)
- Пошук з hotkey (⌘K)
- Active states
- Responsive

**Код:**

```tsx
"use client"

import * as React from "react"
import {
  Home,
  Zap,
  LayoutGrid,
  Users,
  Briefcase,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const [activeItem, setActiveItem] = React.useState("home")
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-[50px]" : "w-40 min-w-[160px] max-w-[180px]",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-2">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <div className="h-5 w-5 rounded-sm bg-primary-foreground" />
          </div>
          {!isCollapsed && <span className="ml-2 font-semibold text-sidebar-foreground truncate">WAY2BI</span>}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      <div className="border-b border-sidebar-border p-1.5">
        {isCollapsed ? (
          <Button variant="ghost" size="icon" className="w-full">
            <Search className="h-4 w-4" />
          </Button>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-1.5 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
            <kbd className="pointer-events-none absolute right-2 top-1.5 hidden h-5 select-none items-center gap-1 rounded border border-sidebar-border bg-sidebar px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100 sm:flex">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-1">
          <Link href="/">
            <Button
              variant={activeItem === "home" ? "secondary" : "ghost"}
              className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}
              onClick={() => setActiveItem("home")}
            >
              <Home className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
              {!isCollapsed && <span className="truncate">Home</span>}
            </Button>
          </Link>
          <Button
            variant={activeItem === "decisions" ? "secondary" : "ghost"}
            className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}
            onClick={() => setActiveItem("decisions")}
          >
            <Zap className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="truncate">Decisions</span>}
          </Button>
          <Button
            variant={activeItem === "tasks" ? "secondary" : "ghost"}
            className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}
            onClick={() => setActiveItem("tasks")}
          >
            <CheckSquare className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="truncate">Tasks</span>}
          </Button>
          <Link href="/catalog?view=dashboard">
            <Button
              variant={activeItem === "catalog" ? "secondary" : "ghost"}
              className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}
              onClick={() => setActiveItem("catalog")}
            >
              <LayoutGrid className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
              {!isCollapsed && <span className="truncate">Catalog</span>}
            </Button>
          </Link>
          <Button
            variant={activeItem === "people" ? "secondary" : "ghost"}
            className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}
            onClick={() => setActiveItem("people")}
          >
            <Users className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="truncate">People</span>}
          </Button>
          <Button
            variant={activeItem === "projects" ? "secondary" : "ghost"}
            className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}
            onClick={() => setActiveItem("projects")}
          >
            <Briefcase className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="truncate">Projects</span>}
          </Button>
          <Button
            variant={activeItem === "more" ? "secondary" : "ghost"}
            className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}
            onClick={() => setActiveItem("more")}
          >
            <MoreHorizontal className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="truncate">More</span>}
          </Button>
        </div>
      </ScrollArea>

      {/* Help */}
      <div className="border-t border-sidebar-border p-1">
        <Button variant="ghost" className={cn("w-full", isCollapsed ? "justify-center px-0" : "justify-start")}>
          <span className={cn("text-lg flex-shrink-0", !isCollapsed && "mr-2")}>?</span>
          {!isCollapsed && <span className="truncate">Help</span>}
        </Button>
      </div>
    </div>
  )
}
```

---

### 3. EmptyState

**Призначення:** Placeholder для порожніх станів

**Використання:**
```tsx
<EmptyState
  icon={Folder}
  title="No collections yet"
  description="Create your first collection to get started"
  action={
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      Create Collection
    </Button>
  }
/>
```

**Код:**

```tsx
import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "md",
  className,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-6",
    md: "py-12",
    lg: "py-24",
  }

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", sizeClasses[size], className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-3">
          <Icon className={cn("text-muted-foreground", iconSizes[size])} />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  )
}
```

---

## 📊 Типи Даних

### types/collection.ts

```typescript
import { User, AccessControl } from './user'
import { FilterRule } from './rule'

export interface Collection {
  // Identity
  id: string
  name: string
  description?: string
  
  // Visual
  icon: string
  customImage?: string
  color?: string
  
  // Type & Classification
  type: CollectionType
  category?: string
  tags?: string[]
  
  // Core Data
  items?: CollectionItem[]
  filters?: FilterRule[]
  
  // Automation
  autoSync: boolean
  syncRules?: any
  lastSyncedAt?: Date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: User
  updatedBy?: User
  
  // Sharing
  sharedWith?: AccessControl[]
  isPublic?: boolean
  shareLink?: string
  
  // Stats
  itemCount: number
  viewCount: number
  favoriteCount?: number
  
  // Version Control
  version?: number
}

export type CollectionType = 'ai-generated' | 'manual' | 'smart' | 'shared'

export interface CollectionItem {
  id: string
  name: string
  type: string
  category: string
  idCode?: string
  status?: string
  location?: string
  tags?: string[]
  value?: number
  currency?: string
  guestRating?: number
  lastUpdated?: string
  createdAt?: Date
  flagged?: boolean
  pinned?: boolean
  archived?: boolean
}
```

### types/rule.ts

```typescript
export interface FilterRule {
  id: string
  field: string
  operator: FilterOperator
  value: string | number | boolean | string[]
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'in'
  | 'not_in'
```

### types/user.ts

```typescript
export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: 'owner' | 'editor' | 'viewer'
}

export interface AccessControl {
  userId: string
  permission: 'view' | 'edit' | 'admin'
  grantedAt: Date
  grantedBy: string
}
```

---

## 🛠️ Утиліти

### lib/collection-utils.ts

```typescript
import type { CollectionItem } from '@/types/collection'

/**
 * Format item count for display
 */
export function formatItemCount(count: number): string {
  if (count === 0) return 'No items'
  if (count === 1) return '1 item'
  return `${count.toLocaleString()} items`
}

/**
 * Get relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

/**
 * Format value as currency
 */
export function formatValue(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Get color for category
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Legal entities': 'bg-blue-100 text-blue-700 border-blue-200',
    'Properties': 'bg-green-100 text-green-700 border-green-200',
    'Vehicles': 'bg-orange-100 text-orange-700 border-orange-200',
    'Aviation': 'bg-sky-100 text-sky-700 border-sky-200',
    'Maritime': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Organizations': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Events': 'bg-pink-100 text-pink-700 border-pink-200',
    'Pets': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Obligations': 'bg-red-100 text-red-700 border-red-200',
  }

  return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200'
}

/**
 * Get color for status
 */
export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase()
  
  if (statusLower.includes('available') || statusLower.includes('active')) {
    return 'bg-green-100 text-green-800'
  }
  if (statusLower.includes('maintenance') || statusLower.includes('attention')) {
    return 'bg-yellow-100 text-yellow-800'
  }
  if (statusLower.includes('repair') || statusLower.includes('expired')) {
    return 'bg-red-100 text-red-800'
  }
  if (statusLower.includes('inactive') || statusLower.includes('archived')) {
    return 'bg-gray-100 text-gray-800'
  }
  
  return 'bg-blue-100 text-blue-800'
}
```

### lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 🎨 Стилі (globals.css)

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.55 0.18 264);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.95 0 0);
  --secondary-foreground: oklch(0.15 0 0);
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.6 0.2 280);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.55 0.22 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.9 0 0);
  --input: oklch(0.9 0 0);
  --ring: oklch(0.55 0.18 264);
  --radius: 0.75rem;
  --sidebar: oklch(0.98 0 0);
  --sidebar-foreground: oklch(0.15 0 0);
  --sidebar-primary: oklch(0.55 0.18 264);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.95 0 0);
  --sidebar-accent-foreground: oklch(0.15 0 0);
  --sidebar-border: oklch(0.92 0 0);
  --sidebar-ring: oklch(0.55 0.18 264);
}

.dark {
  --background: oklch(0.12 0 0);
  --foreground: oklch(0.95 0 0);
  --card: oklch(0.15 0 0);
  --card-foreground: oklch(0.95 0 0);
  --popover: oklch(0.15 0 0);
  --popover-foreground: oklch(0.95 0 0);
  --primary: oklch(0.65 0.22 264);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.2 0 0);
  --secondary-foreground: oklch(0.95 0 0);
  --muted: oklch(0.2 0 0);
  --muted-foreground: oklch(0.6 0 0);
  --accent: oklch(0.7 0.24 280);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.5 0.2 25);
  --destructive-foreground: oklch(0.95 0 0);
  --border: oklch(0.22 0 0);
  --input: oklch(0.22 0 0);
  --ring: oklch(0.65 0.22 264);
  --sidebar: oklch(0.1 0 0);
  --sidebar-foreground: oklch(0.95 0 0);
  --sidebar-primary: oklch(0.65 0.22 264);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.18 0 0);
  --sidebar-accent-foreground: oklch(0.95 0 0);
  --sidebar-border: oklch(0.2 0 0);
  --sidebar-ring: oklch(0.65 0.22 264);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 📁 Список Всіх Компонентів

### Основні Компоненти (зчитані вище)
1. ✅ **CollectionCard** - Картка колекції
2. ✅ **AppSidebar** - Головна навігація
3. ✅ **EmptyState** - Порожній стан

### Компоненти Колекцій (потребують експорту)
4. **CollectionDetailView** - Детальний вигляд колекції
5. **CollectionItemsManager** - Управління елементами
6. **ItemsGrid** - Сітка елементів
7. **ItemsTable** - Таблиця елементів
8. **AddItemsDialog** - Діалог додавання елементів
9. **AICollectionDialog** - Діалог створення AI колекції
10. **CollectionAIAssistant** - AI асистент
11. **RuleBuilder** - Конструктор правил
12. **RulesModal** - Модальне вікно правил
13. **ShareModal** - Модальне вікно шерингу
14. **SyncPreviewDialog** - Превью синхронізації

### Dashboard & Views
15. **CollectionsDashboard** - Головний дашборд
16. **CatalogView** - Вигляд каталогу
17. **CatalogSidebar** - Бокова панель каталогу
18. **CollectionDetailPanel** - Панель деталей

### UI Components (shadcn/ui)
19-79. **43 UI компонентів** (button, card, dialog, etc.)

---

## 📝 Примітки для V0

### Як працювати з великими проектами в V0

1. **Розділити на модулі**
   - Спочатку UI компоненти (shadcn)
   - Потім типи
   - Потім утиліти
   - Останніми - основні компоненти

2. **Замінити Context API**
   - V0 не підтримує React Context
   - Використовувати локальний стан (useState)
   - Або Zustand для глобального стану

3. **Спростити залежності**
   - Видалити залежності від контексту
   - Передавати дані через props
   - Використовувати mock дані

4. **Тестувати по компонентам**
   - Кожен компонент тестувати окремо
   - Створити story для кожного компонента
   - Перевірити різні стани

---

**Версія:** 1.0.0  
**Дата:** 2025-10-09  
**Статус:** Ready for V0 Export









