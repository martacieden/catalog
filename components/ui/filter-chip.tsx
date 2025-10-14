"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterChipData {
  id: string
  field: string
  operator: string
  value: string | number | boolean | string[]
  displayText: string
}

interface FilterChipProps {
  filter: FilterChipData
  onEdit?: (filter: FilterChipData) => void
  onRemove?: (filterId: string) => void
  editable?: boolean
  removable?: boolean
  className?: string
}

// Функція для форматування операторів у читабельний вигляд
const formatOperator = (operator: string): string => {
  const operatorLabels: Record<string, string> = {
    'equals': 'is',
    'not_equals': 'is not',
    'contains': 'contains',
    'not_contains': 'does not contain',
    'starts_with': 'starts with',
    'ends_with': 'ends with',
    'is_empty': 'is empty',
    'is_not_empty': 'is not empty',
    'greater_than': 'more than',
    'less_than': 'less than',
    'greater_than_or_equal': 'at least',
    'less_than_or_equal': 'at most',
    'in': 'is any of',
    'not_in': 'is not any of'
  }
  
  return operatorLabels[operator] || operator
}

// Функція для форматування полів у читабельний вигляд
const formatField = (field: string): string => {
  const fieldLabels: Record<string, string> = {
    'name': 'Name',
    'category': 'Category',
    'status': 'Status',
    'type': 'Type',
    'location': 'Location',
    'value': 'Amount',
    'rating': 'Rating',
    'pinned': 'Pinned',
    'createdBy': 'Created by',
    'createdOn': 'Created on',
    'sharedWith': 'Shared with'
  }
  
  return fieldLabels[field] || field
}

export function FilterChip({ 
  filter, 
  onEdit, 
  onRemove, 
  editable = false, 
  removable = false,
  className 
}: FilterChipProps) {
  const fieldLabel = formatField(filter.field)
  const operatorLabel = formatOperator(filter.operator)
  
  // Форматуємо value для відображення
  const formatValue = (value: string | number | boolean | string[]): string => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return String(value)
  }
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium transition-colors",
      "hover:bg-gray-100",
      className
    )}>
      <span className="text-foreground">
        {fieldLabel} {operatorLabel} {formatValue(filter.value)}
      </span>
      
      {editable && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(filter)}
          className="h-4 w-4 p-0 hover:bg-gray-200"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      )}
      
      {removable && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(filter.id)}
          className="h-4 w-4 p-0 hover:bg-gray-200"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// Компонент для відображення списку фільтрів
interface FilterChipsListProps {
  filters: FilterChipData[]
  onEdit?: (filter: FilterChipData) => void
  onRemove?: (filterId: string) => void
  editable?: boolean
  removable?: boolean
  className?: string
}

export function FilterChipsList({ 
  filters, 
  onEdit, 
  onRemove, 
  editable = false, 
  removable = false,
  className 
}: FilterChipsListProps) {
  if (filters.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          filter={filter}
          onEdit={onEdit}
          onRemove={onRemove}
          editable={editable}
          removable={removable}
        />
      ))}
    </div>
  )
}
