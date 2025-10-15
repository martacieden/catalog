"use client"

import * as React from "react"
import { DependencyGroup } from "@/types/dependency"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Link, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface DependenciesSectionProps {
  dependencies: DependencyGroup[]
  onNavigateToDependency: (dependencyGroup: DependencyGroup) => void
  onNavigateToCollection: (collectionId: string) => void
  collapsed?: boolean
}

export function DependenciesSection({
  dependencies,
  onNavigateToDependency,
  onNavigateToCollection,
  collapsed = false,
}: DependenciesSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsed)

  if (dependencies.length === 0) {
    return null // Не показуємо секцію якщо немає залежностей
  }

  return (
    <div className="ml-4">
      {/* Dependencies Header */}
      <div 
        className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-50 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
        
        <Link className="h-3 w-3 text-purple-600" />
        <span className="text-xs font-medium text-gray-700">
          Dependencies ({dependencies.length})
        </span>
      </div>

      {/* Dependencies List */}
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {dependencies.map((dependencyGroup) => (
            <div
              key={dependencyGroup.id}
              className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-50 cursor-pointer group"
              onClick={() => onNavigateToDependency(dependencyGroup)}
            >
              <FileText className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600 group-hover:text-gray-900">
                {dependencyGroup.name} ({dependencyGroup.itemCount})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Compact version for navigation items
 */
export function DependenciesIndicator({ 
  dependencyCount, 
  onNavigate 
}: { 
  dependencyCount: number
  onNavigate?: () => void 
}) {
  if (dependencyCount === 0) {
    return null // Не показуємо індикатор якщо немає залежностей
  }

  return (
    <span 
      className="text-xs text-purple-600 hover:text-purple-700 cursor-pointer"
      onClick={onNavigate}
      title={`${dependencyCount} dependencies`}
    >
      🔗{dependencyCount}
    </span>
  )
}

