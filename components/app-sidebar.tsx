"use client"

import * as React from "react"
import {
  Home,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Search,
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
