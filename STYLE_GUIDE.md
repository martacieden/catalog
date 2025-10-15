# Collection UI - Style Guide

## Overview
This style guide defines the design standards, UI patterns, and coding conventions used throughout the Collection UI application. Follow these guidelines to maintain consistency across all components and features.

---

## 🎨 Color System

### Primary Colors
- **Primary**: `oklch(0.55 0.18 264)` - Blue for primary actions
- **Secondary**: `oklch(0.95 0 0)` - Light gray for secondary elements
- **Accent**: `oklch(0.6 0.2 280)` - Purple for accent elements
- **Destructive**: `oklch(0.55 0.22 25)` - Red for destructive actions

### Category Colors
Use the `getCategoryColor(category: string)` utility function from `lib/collection-utils.ts`:

```tsx
import { getCategoryColor } from "@/lib/collection-utils"

<Badge className={getCategoryColor(item.category)}>
  {item.category}
</Badge>
```

**Predefined colors**:
- **Legal entities**: Blue (`bg-blue-100 text-blue-700 border-blue-200`)
- **Properties**: Green (`bg-green-100 text-green-700 border-green-200`)
- **Vehicles**: Orange (`bg-orange-100 text-orange-700 border-orange-200`)
- **Aviation**: Sky (`bg-sky-100 text-sky-700 border-sky-200`)
- **Maritime**: Cyan (`bg-cyan-100 text-cyan-700 border-cyan-200`)
- **Organizations**: Indigo (`bg-indigo-100 text-indigo-700 border-indigo-200`)
- **Events**: Pink (`bg-pink-100 text-pink-700 border-pink-200`)
- **Pets**: Yellow (`bg-yellow-100 text-yellow-700 border-yellow-200`)
- **Obligations**: Red (`bg-red-100 text-red-700 border-red-200`)
- **Default**: Gray (`bg-gray-100 text-gray-700 border-gray-200`)

### Status Colors
Use the `getStatusColor(status: string)` utility function:

- **Available/Active**: Green (`bg-green-100 text-green-800`)
- **Maintenance/Attention**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Repair/Expired**: Red (`bg-red-100 text-red-800`)
- **Inactive/Archived**: Gray (`bg-gray-100 text-gray-800`)
- **Default**: Blue (`bg-blue-100 text-blue-800`)

---

## 📐 Spacing & Layout

### Container Padding
- **Main content areas**: `p-6` (24px)
- **Cards/Sections**: `p-4` (16px)
- **Modals/Dialogs**: `p-6` or `px-6 py-4` (24px horizontal, 16px vertical)
- **Sidebar sections**: `p-2` (8px)

### Gap Spacing
- **Between sections**: `space-y-6` or `gap-6` (24px)
- **Between cards**: `space-y-4` or `gap-4` (16px)
- **Between items**: `space-y-2` or `gap-2` (8px)
- **Between inline elements**: `gap-2` (8px)

### Content Width
- **Max content width**: `max-w-6xl` or `max-w-7xl`
- **Center alignment**: `mx-auto`

---

## 🎯 Component Standards

### Headers
**Standard height**: `h-14` (56px)

```tsx
<header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
  <h1 className="text-lg font-semibold">{title}</h1>
  {/* Actions */}
</header>
```

### Empty States
Use the `EmptyState` component from `components/ui/empty-state.tsx`:

```tsx
import { EmptyState } from "@/components/ui/empty-state"
import { FolderOpen } from "lucide-react"

<EmptyState
  icon={FolderOpen}
  title="No collections yet"
  description="Create your first collection to organize your objects"
  size="default" // sm | default | lg
  action={<Button>Create Collection</Button>}
/>
```

**Sizes**:
- `sm`: Compact, for sidebars and small spaces
- `default`: Standard size for main content areas
- `lg`: Large, for hero sections and prominent empty states

### Cards

**Standard card structure**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Card styling**:
- Border: `border border-gray-200`
- Background: `bg-white`
- Shadow: `shadow-sm` (default), `shadow-md` (hover)
- Rounded: `rounded-lg` or `rounded-xl`

---

## 🔘 Button Standards

### Button Variants

**Primary actions** (create, save, submit):
```tsx
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Create Collection
</Button>
```

**Secondary actions** (cancel, back):
```tsx
<Button variant="outline">
  Cancel
</Button>
```

**Destructive actions** (delete, remove):
```tsx
<Button variant="destructive">
  <Trash2 className="h-4 w-4 mr-2" />
  Delete
</Button>
```

**Ghost buttons** (icon actions, subtle actions):
```tsx
<Button variant="ghost" size="icon">
  <Settings className="h-5 w-5" />
</Button>
```

**AI-related actions**:
```tsx
<Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
  <Sparkles className="h-4 w-4 mr-2" />
  Ask AI
</Button>
```

### Button Sizes
- `size="sm"`: Small buttons for toolbars (h-8, px-3)
- `size="default"`: Standard buttons (h-10, px-4)
- `size="lg"`: Large buttons for hero sections (h-11, px-8)
- `size="icon"`: Icon-only buttons (h-10 w-10)

### Icon Placement
- **Icon before text**: `className="h-4 w-4 mr-2"`
- **Icon after text**: `className="h-4 w-4 ml-2"`
- **Icon only**: `className="h-4 w-4"` or `className="h-5 w-5"`

---

## 📱 Dialog Standards

### Dialog Sizes

**Small dialogs** (confirmations, simple forms):
```tsx
<DialogContent className="max-w-md"> {/* 448px */}
```

**Medium dialogs** (standard forms, settings):
```tsx
<DialogContent className="max-w-2xl"> {/* 672px */}
```

**Large dialogs** (data tables, complex forms):
```tsx
<DialogContent className="max-w-4xl"> {/* 896px */}
```

**Extra large dialogs** (full data views, AI assistants):
```tsx
<DialogContent className="max-w-6xl max-h-[90vh]"> {/* 1152px */}
```

**Full-screen dialogs** (AI collection preview):
```tsx
<DialogContent className="max-w-[calc(100vw-80px)] max-h-[calc(100vh-48px)]">
```

### Dialog Structure
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      {/* Content */}
    </div>
    
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🏷️ Badge Standards

### Badge Variants

**Item counts**:
```tsx
<Badge variant="outline" className="text-xs">
  {count} items
</Badge>
```

**Category badges**:
```tsx
<Badge variant="secondary" className={`text-xs ${getCategoryColor(category)}`}>
  {category}
</Badge>
```

**Status badges**:
```tsx
<Badge className={getStatusColor(status)}>
  {status}
</Badge>
```

**AI badges**:
```tsx
<Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
  <Sparkles className="h-3 w-3 mr-1" />
  AI
</Badge>
```

---

## 🔍 Search & Filter Standards

### Search Input
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-9"
  />
</div>
```

**Standard icon placement**: Left side, `left-3`
**Standard input padding**: `pl-9` for icon, `pr-3` default

### Filter Button
```tsx
<Button variant="outline" size="sm">
  <Filter className="mr-2 h-4 w-4" />
  Filters
  {activeFilters > 0 && (
    <Badge variant="secondary" className="ml-2">
      {activeFilters}
    </Badge>
  )}
</Button>
```

---

## 🖼️ Image & Icon Standards

### Placeholder Images
- **Standard placeholder**: `/placeholder.svg`
- **Never use query parameters**: ❌ `/placeholder.svg?height=32&width=32`
- **Use fallback**: Always provide `AvatarFallback` for avatars

### Category Icons
Use `getCategoryIcon(category: string)` utility when needed.

**Icon sizes**:
- **Small**: `h-3 w-3` (12px) - for inline badges
- **Default**: `h-4 w-4` (16px) - for buttons, labels
- **Medium**: `h-5 w-5` (20px) - for headers, cards
- **Large**: `h-6 w-6` (24px) - for large cards
- **Extra large**: `h-8 w-8` to `h-16 w-16` - for empty states

---

## 📋 Table Standards

### Table Structure
```tsx
<div className="rounded-lg border border-border bg-card">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-12"> {/* Checkbox column */}
          <Checkbox />
        </TableHead>
        <TableHead>Name</TableHead>
        {/* Other columns */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map(item => (
        <TableRow key={item.id}>
          <TableCell className="p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4">
            {item.name}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### Table Styling
- **Cell padding**: `p-4` (16px)
- **Header background**: `bg-muted/50`
- **Row hover**: `hover:bg-muted/50`
- **Selected row**: `bg-muted/40`

---

## 💬 Toast Notifications

### Toast Standards
**Always use English** for consistency.

**Success messages**:
```tsx
toast({
  title: "Collection created successfully! 🎉",
  description: `"${name}" has been created with ${count} items.`,
})
```

**Error messages**:
```tsx
toast({
  title: "Error title",
  description: "Detailed error message",
  variant: "destructive",
})
```

**Info messages**:
```tsx
toast({
  title: "Coming soon",
  description: "This functionality will be available soon.",
})
```

### Toast Patterns
- ✅ **Use emojis sparingly**: Only for major success (🎉)
- ✅ **Include item count**: Always show how many items affected
- ✅ **Use proper grammar**: `1 item` vs `2 items`
- ✅ **Be specific**: Include collection/item names when relevant

---

## 📝 Form Standards

### Form Layout
```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field-name">Field Label *</Label>
    <Input
      id="field-name"
      placeholder="Placeholder text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  </div>
</div>
```

### Required Fields
- Mark with asterisk: `Field Label *`
- Validate before submission
- Show validation errors inline

### Input Patterns
- **Text input**: `<Input type="text" />`
- **Search input**: Include `<Search />` icon on left
- **Number input**: `<Input type="number" />`
- **Textarea**: `<Textarea rows={3} />` - specify rows

---

## 🎭 Avatar Standards

### Avatar Sizes
- **Extra small**: `h-4 w-4` - for inline display
- **Small**: `h-6 w-6` - for compact lists
- **Default**: `h-8 w-8` - for headers, toolbars
- **Medium**: `h-9 w-9` - for user lists
- **Large**: `h-12 w-12` - for profile headers

### Avatar Usage
```tsx
<Avatar className="h-8 w-8">
  <AvatarImage src="/placeholder.svg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Avatar Groups (Shared With)
```tsx
<div className="flex items-center -space-x-2">
  {users.slice(0, 3).map((user, i) => (
    <Avatar key={i} className="h-6 w-6 border-2 border-white">
      <AvatarFallback className="text-xs">
        {user.avatar}
      </AvatarFallback>
    </Avatar>
  ))}
  {users.length > 3 && (
    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs">
      +{users.length - 3}
    </div>
  )}
</div>
```

---

## 📊 Data Display Standards

### View Layouts

**Grid View**:
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

**List View**:
```tsx
<div className="space-y-3">
  {items.map(item => <ItemRow key={item.id} item={item} />)}
</div>
```

**Table View**: Use the standard table structure defined above

### View Toggle
```tsx
<div className="flex items-center border rounded-md">
  <Button
    variant={layout === "grid" ? "secondary" : "ghost"}
    size="sm"
    onClick={() => setLayout("grid")}
  >
    <Grid3x3 className="h-4 w-4" />
  </Button>
  <Button
    variant={layout === "table" ? "secondary" : "ghost"}
    size="sm"
    onClick={() => setLayout("table")}
  >
    <List className="h-4 w-4" />
  </Button>
</div>
```

---

## 🎪 Modal & Sidebar Standards

### Sidebar Widths
- **App Sidebar** (collapsed): `w-[50px]`
- **App Sidebar** (expanded): `w-40 min-w-[160px] max-w-[180px]`
- **Catalog Sidebar**: `w-56 min-w-[200px] max-w-[240px]`
- **Detail Panel**: Full remaining width (`flex-1`)

### Sidebar Structure
```tsx
<div className="flex h-screen w-56 flex-col border-r border-sidebar-border bg-sidebar">
  {/* Header */}
  <div className="flex h-14 items-center border-b px-3">
    <h2 className="font-semibold">Title</h2>
  </div>

  {/* Scrollable content */}
  <ScrollArea className="flex-1">
    <div className="space-y-1 p-2">
      {/* Navigation items */}
    </div>
  </ScrollArea>

  {/* Footer (optional) */}
  <div className="border-t p-2">
    {/* Footer content */}
  </div>
</div>
```

---

## 🎨 Typography Standards

### Headings
- **Page title** (h1): `text-lg font-semibold` (18px)
- **Section title** (h2): `text-base font-semibold` or `text-lg font-bold` (16-18px)
- **Card title** (h3): `text-sm font-semibold` (14px)
- **Subsection** (h4): `text-xs font-medium uppercase tracking-wide` (12px)

### Body Text
- **Default**: `text-sm` (14px)
- **Small**: `text-xs` (12px)
- **Muted**: `text-muted-foreground`

### Stats & Numbers
```tsx
<div className="text-2xl font-bold">{value}</div>
<p className="text-xs text-muted-foreground">{description}</p>
```

---

## 🖱️ Interactive Elements

### Hover States
- **Cards**: `hover:shadow-md hover:scale-105 transition-all`
- **Buttons**: Use built-in variant hover states
- **Table rows**: `hover:bg-muted/50`
- **Interactive items**: `hover:bg-accent/50 transition-colors`

### Selection States
- **Selected card**: `ring-2 ring-primary`
- **Selected row**: `bg-muted/40`
- **Checkbox**: `data-[state=checked]:bg-primary data-[state=checked]:border-primary`

### Loading States
```tsx
{isLoading ? (
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
) : (
  <Icon className="h-4 w-4" />
)}
```

---

## 🎯 AI-Specific Patterns

### AI Badges & Indicators
```tsx
<Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
  <Sparkles className="h-3 w-3 mr-1" />
  AI
</Badge>
```

### AI Buttons
```tsx
<Button className="bg-gradient-to-r from-indigo-600 to-blue-600">
  <Sparkles className="h-4 w-4 mr-2" />
  AI Action
</Button>
```

### AI Gradient Backgrounds
```tsx
<div className="bg-gradient-to-br from-indigo-50 to-blue-50">
  {/* AI-related content */}
</div>
```

---

## 🔢 Count & Statistics Display

### Item Counts
Use `formatItemCount()` utility:
```tsx
import { formatItemCount } from "@/lib/collection-utils"

<Badge variant="outline">{formatItemCount(count)}</Badge>
```

### Statistics Cards
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Label</CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

---

## 📅 Date & Time Formatting

### Relative Time
Use `formatRelativeTime()` utility:
```tsx
import { formatRelativeTime } from "@/lib/collection-utils"

<span className="text-xs text-muted-foreground">
  {formatRelativeTime(collection.createdAt)}
</span>
```

**Format output**:
- Just now
- 5m ago
- 2h ago
- 3d ago
- 2w ago
- 3mo ago
- 1y ago

### Date Display
```tsx
<div className="flex items-center gap-1 text-xs text-muted-foreground">
  <Calendar className="h-3 w-3" />
  <span>{item.date}</span>
</div>
```

---

## 🎨 Gradient Patterns

### Collection Type Gradients

**AI-generated collections**:
```tsx
className="bg-gradient-to-br from-indigo-50 to-blue-50"
```

**Manual collections**:
```tsx
className="bg-gradient-to-br from-blue-50 to-cyan-50"
```

### Button Gradients
```tsx
// AI actions
className="bg-gradient-to-r from-blue-600 to-indigo-600"

// Create actions
className="bg-gradient-to-r from-indigo-600 to-blue-600"
```

---

## 🎯 Selection Patterns

### Bulk Selection Toolbar
```tsx
{selectedCount > 0 && (
  <div className="sticky top-0 z-10 rounded-lg border bg-card/95 backdrop-blur px-4 py-3">
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
        {/* Action buttons */}
      </div>
    </div>
  </div>
)}
```

### Selection Count Display
Always show proper singular/plural:
```tsx
{count} item{count === 1 ? '' : 's'}
```

---

## 🎨 Background Colors

### Page Backgrounds
- **Main content**: `bg-background` (light gray)
- **Cards/Panels**: `bg-white` or `bg-card`
- **Sidebars**: `bg-sidebar`
- **Muted sections**: `bg-gray-50` or `bg-muted/30`
- **Toolbars**: `bg-card`

---

## 🔗 Navigation Standards

### Sidebar Navigation
```tsx
<Button
  variant={isActive ? "secondary" : "ghost"}
  className="w-full justify-start"
  onClick={handleClick}
>
  <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
  <span className="truncate">Label</span>
  {/* Optional badge */}
</Button>
```

### Breadcrumbs
```tsx
<div className="flex items-center gap-2">
  <Button variant="ghost" size="sm" onClick={handleBack}>
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back
  </Button>
  <span className="text-muted-foreground">·</span>
  <h1 className="text-lg font-semibold">{title}</h1>
</div>
```

---

## 🎯 Dropdown Menu Standards

### Standard Dropdown
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleView}>
      <Eye className="h-4 w-4 mr-2" />
      View
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleEdit}>
      <Edit3 className="h-4 w-4 mr-2" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Menu alignment**: Use `align="end"` for right-aligned menus

---

## 🎨 Border & Shadow Standards

### Borders
- **Standard border**: `border border-border` or `border border-gray-200`
- **Bottom border**: `border-b border-border`
- **Divider**: Use `<Separator />` component

### Shadows
- **Card default**: `shadow-sm`
- **Card hover**: `shadow-md`
- **Elevated**: `shadow-lg`
- **Backdrop**: `backdrop-blur supports-[backdrop-filter]:bg-card/80`

---

## 🎯 Responsive Design

### Breakpoints
- **Mobile**: Default styles (< 768px)
- **Tablet**: `md:` prefix (≥ 768px)
- **Desktop**: `lg:` prefix (≥ 1024px)
- **Wide**: `xl:` prefix (≥ 1280px)

### Grid Responsive Patterns
```tsx
// 1 column mobile, 2 tablet, 3 desktop, 4 wide
className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Stats grid
className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
```

---

## 🔤 Text Standards

### Truncation
- **Single line**: `truncate` (requires max-width or flex)
- **Two lines**: `line-clamp-2`
- **Three lines**: `line-clamp-3`

### Text Colors
- **Primary text**: `text-foreground` (default)
- **Secondary text**: `text-muted-foreground`
- **Success**: `text-green-600`
- **Warning**: `text-yellow-600`
- **Error**: `text-red-600`
- **AI-related**: `text-indigo-600` or `text-blue-600`

---

## 🎯 Animation Standards

### Transitions
- **Default**: `transition-all` or `transition-colors`
- **Duration**: Default (150ms) or `duration-200` (200ms)
- **Hover scale**: `hover:scale-105` for cards

### Loading Spinners
```tsx
<Loader2 className="h-4 w-4 animate-spin" />
```

### Slide-in Animations
```tsx
className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
```

---

## 📱 Mobile Considerations

### Touch Targets
- **Minimum size**: `h-10 w-10` (40px)
- **Icon buttons**: `size="icon"` ensures proper touch target
- **Spacing**: Maintain `gap-2` minimum between interactive elements

### Mobile Navigation
- Sidebars should collapse or hide on mobile
- Use `<Sheet />` component for mobile menus
- Consider `useIsMobile()` hook when needed

---

## 🎨 Theme Support

### Color Variables
Always use theme variables instead of hardcoded colors:
- ✅ `bg-primary` instead of `bg-blue-600`
- ✅ `text-muted-foreground` instead of `text-gray-500`
- ✅ `border-border` instead of `border-gray-200`

### Dark Mode
Colors automatically adapt via CSS variables defined in `app/globals.css`

---

## 📋 Code Organization

### Component Structure
```tsx
"use client" // If needed

import * as React from "react"
// External imports
// UI component imports
// Icon imports
// Type imports
// Utility imports

interface ComponentProps {
  // Props definition
}

export function Component({ props }: ComponentProps) {
  // State
  // Refs
  // Derived values
  // Effects
  // Handlers
  // Render
}
```

### File Naming
- **Components**: `component-name.tsx` (kebab-case)
- **Utilities**: `utility-name.ts` (kebab-case)
- **Types**: `type-name.ts` (kebab-case)
- **Hooks**: `use-hook-name.ts` (kebab-case with use- prefix)

---

## 🌐 Internationalization

### Language Standards
- **All UI text**: English
- **All comments**: English
- **All toast messages**: English
- **All console logs**: English (for debugging)

### Pluralization
Always handle singular/plural properly:
```tsx
{count} item{count === 1 ? '' : 's'}
```

---

## 🎯 Accessibility

### ARIA Labels
- Add `aria-label` to icon-only buttons
- Use semantic HTML elements
- Ensure keyboard navigation works

### Focus States
- Default focus ring: `focus:outline-none focus:ring-2 focus:ring-ring`
- Visible focus indicators on all interactive elements

---

## 🚀 Performance

### Image Optimization
- Use Next.js `Image` component when possible
- Provide `width` and `height` attributes
- Use appropriate image formats (SVG for icons, WebP for photos)

### List Virtualization
- Consider virtualization for lists > 100 items
- Use `ScrollArea` for large scrollable sections

---

## 📚 Component Library Reference

### Core Components
- **Buttons**: `@/components/ui/button`
- **Cards**: `@/components/ui/card`
- **Dialogs**: `@/components/ui/dialog`
- **Badges**: `@/components/ui/badge`
- **Inputs**: `@/components/ui/input`
- **Tables**: `@/components/ui/table`
- **Empty State**: `@/components/ui/empty-state` ⭐ New

### Collection Components
- **CollectionCard**: `@/components/collections/collection-card`
- **ItemsGrid**: `@/components/collections/items-grid`
- **ItemsTable**: `@/components/collections/items-table`
- **ShareModal**: `@/components/collections/share-modal` ⭐ Primary

### Utility Functions
- **getCategoryColor**: `@/lib/collection-utils`
- **getCategoryIcon**: `@/lib/collection-utils` ⭐ New
- **getStatusColor**: `@/lib/collection-utils`
- **formatItemCount**: `@/lib/collection-utils`
- **formatRelativeTime**: `@/lib/collection-utils`

---

## ✅ Best Practices

### DO's ✅
- Use semantic HTML elements
- Use utility functions for colors, icons, formatting
- Always provide fallback values
- Handle loading and error states
- Use EmptyState component for empty views
- Maintain consistent spacing (p-6 for main, p-4 for cards)
- Use proper singular/plural in text
- Add comments for complex logic
- Use TypeScript types properly

### DON'Ts ❌
- Don't hardcode colors (use theme variables or utilities)
- Don't use inline styles (prefer Tailwind classes)
- Don't duplicate components (reuse existing)
- Don't mix languages (English only)
- Don't use query params in placeholder images
- Don't forget loading states
- Don't skip empty states
- Don't use magic numbers (define constants)

---

## 🔧 Common Patterns

### Conditional Rendering
```tsx
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

### List Rendering
```tsx
{items.map((item) => (
  <Component key={item.id} item={item} />
))}
```

### State Management
```tsx
const [state, setState] = React.useState(initialValue)
```

### Context Usage
```tsx
const { collections, addCollection } = useCollections()
```

---

## 📊 Testing Checklist

When creating or modifying components:
- [ ] Component renders correctly
- [ ] Empty states display properly
- [ ] Loading states work
- [ ] Error states handled
- [ ] Responsive on all breakpoints
- [ ] Hover states working
- [ ] Icons display correctly
- [ ] Colors use theme variables
- [ ] Toast messages in English
- [ ] Proper singular/plural text
- [ ] No linter errors
- [ ] TypeScript types correct

---

## 📝 Changelog

### Version 1.0 - October 9, 2025
- Initial style guide created
- Documented all UI patterns and standards
- Added EmptyState component
- Standardized toast messages (English)
- Unified ShareModal component
- Fixed CollectionsProvider duplication
- Added utility functions (getCategoryIcon)
- Standardized placeholder images

---

## 🤝 Contributing

When adding new features:
1. Follow this style guide
2. Use existing components when possible
3. Create reusable components for repeated patterns
4. Update this guide if introducing new patterns
5. Ensure consistency with existing code
6. Test across all breakpoints
7. Verify no linter errors

---

**Questions?** Refer to existing implementations in the codebase or consult this guide.









