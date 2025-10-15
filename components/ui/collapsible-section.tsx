"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultCollapsed?: boolean
  badge?: string
  onToggle?: (collapsed: boolean) => void
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function CollapsibleSection({
  title,
  children,
  defaultCollapsed = false,
  badge,
  onToggle,
  className,
  headerClassName,
  contentClassName
}: CollapsibleSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const handleToggle = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onToggle?.(newCollapsed)
  }

  return (
    <div className={cn("space-y-4", isCollapsed && "space-y-0", className)}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between",
        headerClassName
      )}>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed 
          ? "max-h-0 overflow-hidden opacity-0" 
          : "max-h-[2000px] opacity-100",
        contentClassName
      )}>
        {children}
      </div>
    </div>
  )
}

// Спеціалізований компонент для секції деталей колекції
interface CollectionDetailsSectionProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
  className?: string
  badge?: string
}

export function CollectionDetailsSection({
  children,
  defaultCollapsed = false,
  onToggle,
  className,
  badge
}: CollectionDetailsSectionProps) {
  return (
    <CollapsibleSection
      title="Collection Details"
      defaultCollapsed={defaultCollapsed}
      onToggle={onToggle}
      className={className}
      badge={badge}
    >
      {children}
    </CollapsibleSection>
  )
}
