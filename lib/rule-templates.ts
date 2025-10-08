/**
 * Rule Templates
 * Pre-defined rule templates for quick collection creation
 */

import type { RuleTemplate } from "@/types/rule"
import {
  Building2,
  AlertTriangle,
  DollarSign,
  Calendar,
  Flag,
  Star,
  TrendingUp,
  Clock,
  FileText,
  Users,
} from "lucide-react"

export const RULE_TEMPLATES: RuleTemplate[] = [
  // High-Value Assets
  {
    id: "high-value-assets",
    name: "High-Value Assets",
    description: "Items with value over $1,000,000",
    category: "Financial",
    icon: "DollarSign",
    rules: [
      {
        id: "rule-1",
        field: "value",
        operator: "greater_than",
        value: 1000000,
      },
    ],
  },

  // Maintenance Required
  {
    id: "maintenance-required",
    name: "Maintenance Required",
    description: "Items that need maintenance or repair",
    category: "Operations",
    icon: "AlertTriangle",
    rules: [
      {
        id: "rule-1",
        field: "status",
        operator: "in",
        value: ["Maintenance", "Needs Repair", "Attention Required"],
      },
    ],
  },

  // Recently Updated
  {
    id: "recently-updated",
    name: "Recently Updated",
    description: "Items modified in the last 30 days",
    category: "Activity",
    icon: "Clock",
    rules: [
      {
        id: "rule-1",
        field: "lastUpdated",
        operator: "greater_than",
        value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },

  // Flagged Items
  {
    id: "flagged-items",
    name: "Flagged Items",
    description: "Items marked for attention",
    category: "Priority",
    icon: "Flag",
    rules: [
      {
        id: "rule-1",
        field: "flagged",
        operator: "equals",
        value: true,
      },
    ],
  },

  // High-Rated Items
  {
    id: "high-rated",
    name: "High-Rated Items",
    description: "Items with rating above 4.5",
    category: "Quality",
    icon: "Star",
    rules: [
      {
        id: "rule-1",
        field: "guestRating",
        operator: "greater_than_or_equal",
        value: 4.5,
      },
    ],
  },

  // Properties
  {
    id: "properties-only",
    name: "Properties Only",
    description: "All property items",
    category: "Category",
    icon: "Building2",
    rules: [
      {
        id: "rule-1",
        field: "category",
        operator: "equals",
        value: "Properties",
      },
    ],
  },

  // Available Items
  {
    id: "available-items",
    name: "Available Items",
    description: "Items currently available",
    category: "Status",
    icon: "TrendingUp",
    rules: [
      {
        id: "rule-1",
        field: "status",
        operator: "equals",
        value: "Available",
      },
    ],
  },

  // With Financial Docs
  {
    id: "with-financial-docs",
    name: "With Financial Documents",
    description: "Items that have financial documentation",
    category: "Compliance",
    icon: "FileText",
    rules: [
      {
        id: "rule-1",
        field: "hasFinancialDocs",
        operator: "equals",
        value: true,
      },
    ],
  },

  // Shared Items
  {
    id: "shared-items",
    name: "Shared Items",
    description: "Items shared with team members",
    category: "Collaboration",
    icon: "Users",
    rules: [
      {
        id: "rule-1",
        field: "people",
        operator: "is_not_empty",
        value: "",
      },
    ],
  },

  // This Year
  {
    id: "this-year",
    name: "Created This Year",
    description: "Items created in current year",
    category: "Time",
    icon: "Calendar",
    rules: [
      {
        id: "rule-1",
        field: "createdAt",
        operator: "greater_than_or_equal",
        value: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      },
    ],
  },

  // Complex: High-Value + Available
  {
    id: "high-value-available",
    name: "High-Value Available",
    description: "High-value items that are available",
    category: "Combined",
    icon: "DollarSign",
    rules: [
      {
        id: "rule-1",
        field: "value",
        operator: "greater_than",
        value: 500000,
      },
      {
        id: "rule-2",
        field: "status",
        operator: "equals",
        value: "Available",
      },
    ],
  },

  // Complex: Properties Needing Attention
  {
    id: "properties-attention",
    name: "Properties Needing Attention",
    description: "Property items that are flagged or need maintenance",
    category: "Combined",
    icon: "Building2",
    rules: [
      {
        id: "rule-1",
        field: "category",
        operator: "equals",
        value: "Properties",
      },
      {
        id: "rule-2",
        field: "status",
        operator: "in",
        value: ["Maintenance", "Attention Required", "Needs Review"],
      },
    ],
  },

  // Empty/Missing Data
  {
    id: "missing-location",
    name: "Missing Location",
    description: "Items without location information",
    category: "Data Quality",
    icon: "AlertTriangle",
    rules: [
      {
        id: "rule-1",
        field: "location",
        operator: "is_empty",
        value: "",
      },
    ],
  },

  // Premium Assets
  {
    id: "premium-assets",
    name: "Premium Assets",
    description: "High-value items with excellent ratings",
    category: "Premium",
    icon: "Star",
    rules: [
      {
        id: "rule-1",
        field: "value",
        operator: "greater_than",
        value: 2000000,
      },
      {
        id: "rule-2",
        field: "guestRating",
        operator: "greater_than_or_equal",
        value: 4.8,
      },
      {
        id: "rule-3",
        field: "status",
        operator: "equals",
        value: "Available",
      },
    ],
  },
]

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): RuleTemplate[] {
  return RULE_TEMPLATES.filter((template) => template.category === category)
}

/**
 * Get all unique categories
 */
export function getTemplateCategories(): string[] {
  const categories = new Set(RULE_TEMPLATES.map((t) => t.category))
  return Array.from(categories).sort()
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): RuleTemplate | undefined {
  return RULE_TEMPLATES.find((t) => t.id === id)
}

/**
 * Search templates
 */
export function searchTemplates(query: string): RuleTemplate[] {
  const lowerQuery = query.toLowerCase()
  return RULE_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get recommended templates based on collection content
 */
export function getRecommendedTemplates(items: any[]): RuleTemplate[] {
  if (items.length === 0) return RULE_TEMPLATES.slice(0, 5)

  const recommended: RuleTemplate[] = []

  // Analyze items to recommend relevant templates
  const hasHighValue = items.some((item) => item.value && item.value > 1000000)
  const hasMaintenanceIssues = items.some((item) =>
    ["Maintenance", "Needs Repair"].includes(item.status)
  )
  const hasRatings = items.some((item) => item.guestRating || item.internalRating)
  const hasFlaggedItems = items.some((item) => item.flagged)

  if (hasHighValue) {
    const template = getTemplateById("high-value-assets")
    if (template) recommended.push(template)
  }

  if (hasMaintenanceIssues) {
    const template = getTemplateById("maintenance-required")
    if (template) recommended.push(template)
  }

  if (hasRatings) {
    const template = getTemplateById("high-rated")
    if (template) recommended.push(template)
  }

  if (hasFlaggedItems) {
    const template = getTemplateById("flagged-items")
    if (template) recommended.push(template)
  }

  // Always add some general templates
  const generalTemplates = [
    getTemplateById("recently-updated"),
    getTemplateById("available-items"),
  ].filter((t): t is RuleTemplate => t !== undefined)

  return [...recommended, ...generalTemplates].slice(0, 6)
}

