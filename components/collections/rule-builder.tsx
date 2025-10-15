"use client"

import * as React from "react"
import type { FilterRule, RuleTemplate, FilterOperator } from "@/types/rule"
import type { CollectionItem } from "@/types/collection"
import {
  validateRules,
  countMatchedItems,
  explainRule,
  getFieldSuggestions,
  getOperatorSuggestions,
  optimizeRules,
} from "@/lib/rule-engine"
import { RULE_TEMPLATES, getTemplateCategories, getTemplatesByCategory } from "@/lib/rule-templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Code,
  RefreshCw,
  Lightbulb,
  X,
} from "lucide-react"

interface RuleBuilderProps {
  rules: FilterRule[]
  onChange: (rules: FilterRule[]) => void
  items?: CollectionItem[]
  showPreview?: boolean
  maxRules?: number
}

export function RuleBuilder({
  rules,
  onChange,
  items = [],
  showPreview = true,
  maxRules = 20,
}: RuleBuilderProps) {
  const [activeTab, setActiveTab] = React.useState<"visual" | "json">("visual")
  const [jsonText, setJsonText] = React.useState("")
  const [jsonError, setJsonError] = React.useState("")

  // Sync JSON when rules change
  React.useEffect(() => {
    setJsonText(JSON.stringify(rules, null, 2))
    setJsonError("")
  }, [rules])

  // Validate rules
  const validation = React.useMemo(() => validateRules(rules), [rules])

  // Preview matched items
  const matchedCount = React.useMemo(
    () => (items.length > 0 ? countMatchedItems(items, rules) : 0),
    [items, rules]
  )

  const handleAddRule = () => {
    if (rules.length >= maxRules) return

    const newRule: FilterRule = {
      id: `rule-${Date.now()}`,
      field: "name",
      operator: "contains",
      value: "",
    }
    onChange([...rules, newRule])
  }

  const handleRemoveRule = (ruleId: string) => {
    onChange(rules.filter((r) => r.id !== ruleId))
  }

  const handleUpdateRule = (
    ruleId: string,
    updates: Partial<FilterRule>
  ) => {
    onChange(
      rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r))
    )
  }

  const handleApplyTemplate = (template: RuleTemplate) => {
    const newRules = template.rules.map((rule, index) => ({
      ...rule,
      id: `rule-${Date.now()}-${index}`,
    }))
    onChange(newRules)
  }

  const handleOptimize = () => {
    const optimized = optimizeRules(rules)
    onChange(optimized)
  }

  const handleApplyJSON = () => {
    try {
      const parsed = JSON.parse(jsonText)
      if (Array.isArray(parsed)) {
        onChange(parsed)
        setJsonError("")
        setActiveTab("visual")
      } else {
        setJsonError("JSON must be an array of rules")
      }
    } catch (error) {
      setJsonError((error as Error).message)
    }
  }

  return (
    <div className="space-y-4">
      {/* Rules List */}
      {rules.length > 0 && (
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <RuleEditor
              key={rule.id}
              rule={rule}
              index={index}
              items={items}
              onUpdate={(updates) => handleUpdateRule(rule.id, updates)}
              onRemove={() => handleRemoveRule(rule.id)}
            />
          ))}
        </div>
      )}

      {/* Add Rule Button */}
      <div className="flex items-center justify-start">
        <Button
          size="sm"
          onClick={handleAddRule}
          disabled={rules.length >= maxRules}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

    </div>
  )
}

// Rule Editor Component
function RuleEditor({
  rule,
  index,
  items,
  onUpdate,
  onRemove,
}: {
  rule: FilterRule
  index: number
  items: CollectionItem[]
  onUpdate: (updates: Partial<FilterRule>) => void
  onRemove: () => void
}) {
  const needsValue = !["is_empty", "is_not_empty"].includes(rule.operator)

  // Get field display name
  const getFieldDisplayName = (field: string) => {
    const fieldMap: Record<string, string> = {
      name: "Name",
      value: "Value", 
      category: "Category",
      status: "Status",
      rating: "Rating",
      createdBy: "Created by",
      createdOn: "Created on",
      lastUpdate: "Last update",
      pinned: "Pinned",
      sharedWith: "Shared with"
    }
    return fieldMap[field] || field
  }

  // Get operator display name
  const getOperatorDisplayName = (operator: string) => {
    const operatorMap: Record<string, string> = {
      equals: "is",
      not_equals: "is not",
      contains: "contains",
      not_contains: "does not contain",
      starts_with: "starts with",
      ends_with: "ends with",
      is_empty: "is empty",
      is_not_empty: "is not empty",
      greater_than: "more than",
      less_than: "less than",
      greater_than_or_equal: "at least",
      less_than_or_equal: "at most",
      in: "is any of",
      not_in: "is not any of"
    }
    return operatorMap[operator] || operator.replace(/_/g, " ")
  }

  // Get value input based on field type
  const getValueInput = () => {
    if (!needsValue) return null

    if (rule.field === "category") {
      return (
        <select
          className="flex-1 px-3 py-2 border rounded-md text-sm"
          value={rule.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
        >
          <option value="">Select category...</option>
          <option value="Legal entities">Legal entities</option>
          <option value="Properties">Properties</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Aviation">Aviation</option>
          <option value="Maritime">Maritime</option>
          <option value="Organizations">Organizations</option>
          <option value="Events">Events</option>
          <option value="Pets">Pets</option>
          <option value="Obligations">Obligations</option>
        </select>
      )
    }

    if (rule.field === "status") {
      return (
        <select
          className="flex-1 px-3 py-2 border rounded-md text-sm"
          value={rule.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
        >
          <option value="">Select status...</option>
          <option value="Available">Available</option>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
          <option value="Sold">Sold</option>
          <option value="Rented">Rented</option>
        </select>
      )
    }

    if (rule.field === "rating") {
      return (
        <input
          className="flex-1 px-3 py-2 border rounded-md text-sm"
          type="number"
          min="1"
          max="5"
          value={rule.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
          placeholder="4"
        />
      )
    }

    if (rule.field === "value") {
      return (
        <input
          className="flex-1 px-3 py-2 border rounded-md text-sm"
          type="text"
          value={rule.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
          placeholder="$1,000,000"
        />
      )
    }

    return (
      <input
        className="flex-1 px-3 py-2 border rounded-md text-sm"
        type="text"
        value={rule.value as string}
        onChange={(e) => onUpdate({ value: e.target.value })}
        placeholder="Enter value..."
      />
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Field Select */}
      <select 
        className="w-32 px-3 py-2 border rounded-md text-sm"
        value={rule.field}
        onChange={(e) => onUpdate({ field: e.target.value })}
      >
        <option value="">Select field...</option>
        <option value="name">Name</option>
        <option value="value">Value</option>
        <option value="category">Category</option>
        <option value="status">Status</option>
        <option value="rating">Rating</option>
        <option value="createdBy">Created by</option>
        <option value="createdOn">Created on</option>
        <option value="lastUpdate">Last update</option>
        <option value="pinned">Pinned</option>
        <option value="sharedWith">Shared with</option>
      </select>
      
      {/* Operator Select */}
      <select
        className="w-32 px-3 py-2 border rounded-md text-sm"
        value={rule.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as FilterOperator })}
      >
        <option value="">Select operator...</option>
        <option value="equals">is</option>
        <option value="not_equals">is not</option>
        <option value="contains">contains</option>
        <option value="not_contains">does not contain</option>
        <option value="starts_with">starts with</option>
        <option value="ends_with">ends with</option>
        <option value="is_empty">is empty</option>
        <option value="is_not_empty">is not empty</option>
        <option value="greater_than">more than</option>
        <option value="less_than">less than</option>
        <option value="greater_than_or_equal">at least</option>
        <option value="less_than_or_equal">at most</option>
        <option value="in">is any of</option>
        <option value="not_in">is not any of</option>
      </select>
      
      {/* Value Input */}
      {getValueInput()}
      
      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-gray-400 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

// Templates Popover
function TemplatesPopover({ onApply }: { onApply: (template: RuleTemplate) => void }) {
  const categories = getTemplateCategories()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          Templates
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium text-sm">Rule Templates</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a preset template to quickly create rules
          </p>
        </div>
        <ScrollArea className="h-96">
          {categories.map((category) => (
            <div key={category} className="p-4 border-b last:border-0">
              <h5 className="text-xs font-medium text-muted-foreground mb-2 uppercase">
                {category}
              </h5>
              <div className="space-y-2">
                {getTemplatesByCategory(category).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onApply(template)}
                    className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {template.rules.length} rule{template.rules.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

