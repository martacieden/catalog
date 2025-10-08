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
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">
            <Lightbulb className="h-4 w-4 mr-2" />
            Visual Builder
          </TabsTrigger>
          <TabsTrigger value="json">
            <Code className="h-4 w-4 mr-2" />
            JSON Editor
          </TabsTrigger>
        </TabsList>

        {/* Visual Builder */}
        <TabsContent value="visual" className="space-y-4 mt-4">
          {/* Header with Templates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddRule}
                disabled={rules.length >= maxRules}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>

              {rules.length > 1 && (
                <Button size="sm" variant="outline" onClick={handleOptimize}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize
                </Button>
              )}
            </div>

            <TemplatesPopover onApply={handleApplyTemplate} />
          </div>

          {/* Rules List */}
          {rules.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                No rules defined yet
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button size="sm" onClick={handleAddRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
                <TemplatesPopover onApply={handleApplyTemplate} />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
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

          {/* Validation Feedback */}
          {validation.errors.length > 0 && (
            <div className="p-3 border border-red-200 bg-red-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
                <AlertCircle className="h-4 w-4" />
                Validation Errors
              </div>
              {validation.errors.map((error, i) => (
                <p key={i} className="text-xs text-red-600">
                  • {error.message} (Field: {error.field})
                </p>
              ))}
            </div>
          )}

          {validation.warnings && validation.warnings.length > 0 && (
            <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-yellow-700 font-medium text-sm">
                <AlertCircle className="h-4 w-4" />
                Warnings
              </div>
              {validation.warnings.map((warning, i) => (
                <p key={i} className="text-xs text-yellow-600">
                  • {warning.message}
                </p>
              ))}
            </div>
          )}
        </TabsContent>

        {/* JSON Editor */}
        <TabsContent value="json" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>JSON Rules</Label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
              placeholder="Enter JSON rules..."
            />
            {jsonError && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {jsonError}
              </p>
            )}
          </div>
          <Button onClick={handleApplyJSON}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Apply JSON
          </Button>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      {showPreview && items.length > 0 && rules.length > 0 && (
        <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Preview
            </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {matchedCount} / {items.length} items match
            </Badge>
          </div>
          <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${items.length > 0 ? (matchedCount / items.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}
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
  const fieldSuggestions = React.useMemo(
    () => (items.length > 0 ? getFieldSuggestions(items) : []),
    [items]
  )

  const operatorSuggestions = React.useMemo(
    () => (items.length > 0 ? getOperatorSuggestions(rule.field, items) : []),
    [rule.field, items]
  )

  const needsValue = !["is_empty", "is_not_empty"].includes(rule.operator)

  const explanation = explainRule(rule)

  return (
    <div className="p-4 border rounded-lg bg-white space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          Rule {index + 1}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Field */}
        <div className="space-y-1">
          <Label className="text-xs">Field</Label>
          <Select value={rule.field} onValueChange={(value) => onUpdate({ field: value })}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldSuggestions.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Operator */}
        <div className="space-y-1">
          <Label className="text-xs">Operator</Label>
          <Select value={rule.operator} onValueChange={(value) => onUpdate({ operator: value as FilterOperator })}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operatorSuggestions.map((op) => (
                <SelectItem key={op} value={op}>
                  {op.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Value */}
        <div className="space-y-1">
          <Label className="text-xs">Value</Label>
          <Input
            value={rule.value as string}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder={needsValue ? "Enter value..." : "Not required"}
            disabled={!needsValue}
            className="h-9"
          />
        </div>
      </div>

      {/* Explanation */}
      <div className="p-2 bg-gray-50 rounded text-xs text-muted-foreground">
        {explanation}
      </div>
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

