"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ExternalLink, Eye } from "lucide-react"

export interface InsightData {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'info'
  icon: string
  aiDetails?: {
    title: string
    description: string
    items: string[]
    recommendations: string[]
    actions: string[]
  }
}

interface InsightCardProps {
  insight: InsightData
  className?: string
  onClick?: () => void
  onViewDetails?: () => void
}

const typeConfig = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600'
  },
  warning: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600'
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600'
  }
}

export function InsightCard({ insight, className, onClick, onViewDetails }: InsightCardProps) {
  const config = typeConfig[insight.type]

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewDetails?.()
  }

  return (
    <div 
      className={cn(
        "flex flex-col gap-2 p-3 rounded-lg border min-h-[80px] cursor-pointer transition-colors hover:opacity-80 relative",
        config.bgColor,
        config.borderColor,
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-medium text-foreground flex-1">{insight.title}</h4>
        {insight.aiDetails && onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="h-6 w-6 p-0 hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"
            title="View details"
          >
            <Eye className="h-3 w-3" />
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {insight.message}
      </p>
      {insight.aiDetails && onViewDetails && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            Click to view details
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="h-6 px-2 text-xs hover:bg-white/50"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View details
          </Button>
        </div>
      )}
    </div>
  )
}
