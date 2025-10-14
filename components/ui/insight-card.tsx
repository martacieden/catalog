"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

export function InsightCard({ insight, className, onClick }: InsightCardProps) {
  const config = typeConfig[insight.type]

  return (
    <div 
      className={cn(
        "flex flex-col gap-2 p-2 rounded-lg border min-h-[70px] cursor-pointer transition-colors hover:opacity-80",
        config.bgColor,
        config.borderColor,
        className
      )}
      onClick={onClick}
    >
      <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {insight.message}
      </p>
    </div>
  )
}
