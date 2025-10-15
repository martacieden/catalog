"use client"

import * as React from "react"
import { Link } from "lucide-react"
import { cn } from "@/lib/utils"

interface DependencyIndicatorProps {
  dependencyCount: number
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function DependencyIndicator({
  dependencyCount,
  onClick,
  className,
  size = "sm"
}: DependencyIndicatorProps) {
  if (dependencyCount === 0) {
    return null // Не показуємо індикатор якщо немає залежностей
  }

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-base"
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 cursor-pointer transition-colors",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      title={`${dependencyCount} dependencies`}
    >
      <Link className="h-3 w-3" />
      {dependencyCount}
    </span>
  )
}

/**
 * Badge version for collection cards
 */
export function DependencyBadge({
  dependencyCount,
  onClick,
  className
}: {
  dependencyCount: number
  onClick?: () => void
  className?: string
}) {
  if (dependencyCount === 0) {
    return null
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-xs font-medium hover:bg-purple-200 cursor-pointer transition-colors",
        className
      )}
      onClick={onClick}
      title={`${dependencyCount} dependencies`}
    >
      <Link className="h-3 w-3" />
      {dependencyCount}
    </span>
  )
}
