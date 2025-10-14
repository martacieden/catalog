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
}

interface InsightCardProps {
  insight: InsightData
  className?: string
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

export function InsightCard({ insight, className }: InsightCardProps) {
  const config = typeConfig[insight.type]

  return (
    <div className={cn(
      "flex flex-col gap-2 p-2 rounded-lg border min-h-[70px]",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{insight.icon}</span>
        <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {insight.message}
      </p>
    </div>
  )
}
