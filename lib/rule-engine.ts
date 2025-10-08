/**
 * Rule Engine
 * Parses and applies filter rules to collection items
 * Supports JSONLogic for complex rule evaluation
 */

import type { FilterRule, JSONLogicRule, ValidationResult, RuleEngineConfig } from "@/types/rule"
import type { CollectionItem } from "@/types/collection"

// Default configuration
const DEFAULT_CONFIG: Required<RuleEngineConfig> = {
  maxConditions: 50,
  allowedFields: [
    "name",
    "type",
    "category",
    "status",
    "location",
    "idCode",
    "value",
    "guestRating",
    "internalRating",
    "flagged",
    "pinned",
    "archived",
    "hasFinancialDocs",
    "lastUpdated",
    "createdAt",
    "tags",
  ],
  allowedOperators: [
    "equals",
    "not_equals",
    "contains",
    "not_contains",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
    "greater_than",
    "less_than",
    "greater_than_or_equal",
    "less_than_or_equal",
    "in",
    "not_in",
  ],
  caseSensitive: false,
}

/**
 * Parse FilterRules into JSONLogicRule
 */
export function parseRules(rules: FilterRule[]): JSONLogicRule {
  return {
    operator: "and",
    conditions: rules.map((rule) => ({
      field: rule.field,
      operator: rule.operator,
      value: rule.value,
    })),
  }
}

/**
 * Evaluate a single condition against an item
 */
function evaluateCondition(
  item: CollectionItem,
  condition: { field: string; operator: string; value: any },
  caseSensitive: boolean = false
): boolean {
  const fieldValue = getFieldValue(item, condition.field)
  const { operator, value } = condition

  // Handle undefined/null values
  if (fieldValue === undefined || fieldValue === null) {
    return operator === "is_empty"
  }

  // Handle is_empty and is_not_empty separately
  if (operator === "is_empty") {
    if (Array.isArray(fieldValue)) return fieldValue.length === 0
    if (typeof fieldValue === "string") return fieldValue.trim() === ""
    return false
  }

  if (operator === "is_not_empty") {
    if (Array.isArray(fieldValue)) return fieldValue.length > 0
    if (typeof fieldValue === "string") return fieldValue.trim() !== ""
    return true
  }

  // String operations
  if (typeof fieldValue === "string") {
    const itemStr = caseSensitive ? fieldValue : fieldValue.toLowerCase()
    const compareStr = caseSensitive ? String(value) : String(value).toLowerCase()

    switch (operator) {
      case "equals":
        return itemStr === compareStr
      case "not_equals":
        return itemStr !== compareStr
      case "contains":
        return itemStr.includes(compareStr)
      case "not_contains":
        return !itemStr.includes(compareStr)
      case "starts_with":
        return itemStr.startsWith(compareStr)
      case "ends_with":
        return itemStr.endsWith(compareStr)
    }
  }

  // Number operations
  if (typeof fieldValue === "number") {
    const compareNum = Number(value)
    if (isNaN(compareNum)) return false

    switch (operator) {
      case "equals":
        return fieldValue === compareNum
      case "not_equals":
        return fieldValue !== compareNum
      case "greater_than":
        return fieldValue > compareNum
      case "less_than":
        return fieldValue < compareNum
      case "greater_than_or_equal":
        return fieldValue >= compareNum
      case "less_than_or_equal":
        return fieldValue <= compareNum
    }
  }

  // Boolean operations
  if (typeof fieldValue === "boolean") {
    const compareBool = value === true || value === "true"
    return operator === "equals" ? fieldValue === compareBool : fieldValue !== compareBool
  }

  // Array operations
  if (Array.isArray(fieldValue)) {
    switch (operator) {
      case "contains":
        return fieldValue.some((item) =>
          caseSensitive
            ? String(item) === String(value)
            : String(item).toLowerCase() === String(value).toLowerCase()
        )
      case "not_contains":
        return !fieldValue.some((item) =>
          caseSensitive
            ? String(item) === String(value)
            : String(item).toLowerCase() === String(value).toLowerCase()
        )
      case "in":
        if (Array.isArray(value)) {
          return fieldValue.some((item) => value.includes(item))
        }
        return fieldValue.includes(value)
      case "not_in":
        if (Array.isArray(value)) {
          return !fieldValue.some((item) => value.includes(item))
        }
        return !fieldValue.includes(value)
    }
  }

  // Date operations
  if (condition.field.includes("date") || condition.field.includes("At")) {
    const itemDate = new Date(fieldValue).getTime()
    const compareDate = new Date(value).getTime()

    if (isNaN(itemDate) || isNaN(compareDate)) return false

    switch (operator) {
      case "equals":
        return itemDate === compareDate
      case "not_equals":
        return itemDate !== compareDate
      case "greater_than":
        return itemDate > compareDate
      case "less_than":
        return itemDate < compareDate
      case "greater_than_or_equal":
        return itemDate >= compareDate
      case "less_than_or_equal":
        return itemDate <= compareDate
    }
  }

  return false
}

/**
 * Get field value from item (supports nested paths)
 */
function getFieldValue(item: CollectionItem, field: string): any {
  // Handle nested fields like "createdBy.name"
  if (field.includes(".")) {
    const parts = field.split(".")
    let value: any = item
    for (const part of parts) {
      if (value === undefined || value === null) return undefined
      value = value[part as keyof typeof value]
    }
    return value
  }

  return item[field as keyof CollectionItem]
}

/**
 * Apply JSONLogicRule to items array
 */
export function applyRules(
  items: CollectionItem[],
  rules: JSONLogicRule,
  config: RuleEngineConfig = {}
): CollectionItem[] {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  if (!rules.conditions || rules.conditions.length === 0) {
    return items
  }

  return items.filter((item) => {
    const results = rules.conditions.map((condition) =>
      evaluateCondition(item, condition, mergedConfig.caseSensitive)
    )

    // Apply logical operator (AND/OR/NOT)
    switch (rules.operator) {
      case "and":
        return results.every((result) => result === true)
      case "or":
        return results.some((result) => result === true)
      case "not":
        return !results.every((result) => result === true)
      default:
        return results.every((result) => result === true)
    }
  })
}

/**
 * Apply FilterRules directly to items
 */
export function applyFilterRules(
  items: CollectionItem[],
  rules: FilterRule[],
  config: RuleEngineConfig = {}
): CollectionItem[] {
  if (!rules || rules.length === 0) return items

  const jsonLogicRules = parseRules(rules)
  return applyRules(items, jsonLogicRules, config)
}

/**
 * Alias for applyFilterRules
 */
export function applyRulesToItems(
  items: CollectionItem[],
  rules: FilterRule[],
  config: RuleEngineConfig = {}
): CollectionItem[] {
  return applyFilterRules(items, rules, config)
}

/**
 * Validate filter rules
 */
export function validateRules(
  rules: FilterRule[],
  config: RuleEngineConfig = {}
): ValidationResult {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const errors: Array<{ ruleId: string; field: string; message: string }> = []
  const warnings: Array<{ ruleId: string; field: string; message: string }> = []

  // Check max conditions
  if (rules.length > mergedConfig.maxConditions!) {
    errors.push({
      ruleId: "global",
      field: "rules",
      message: `Maximum ${mergedConfig.maxConditions} conditions allowed`,
    })
  }

  rules.forEach((rule) => {
    // Validate field
    if (!rule.field) {
      errors.push({ ruleId: rule.id, field: "field", message: "Field is required" })
    } else if (
      mergedConfig.allowedFields &&
      mergedConfig.allowedFields.length > 0 &&
      !mergedConfig.allowedFields.includes(rule.field)
    ) {
      errors.push({
        ruleId: rule.id,
        field: "field",
        message: `Field "${rule.field}" is not allowed`,
      })
    }

    // Validate operator
    if (!rule.operator) {
      errors.push({ ruleId: rule.id, field: "operator", message: "Operator is required" })
    } else if (
      mergedConfig.allowedOperators &&
      mergedConfig.allowedOperators.length > 0 &&
      !mergedConfig.allowedOperators.includes(rule.operator as any)
    ) {
      errors.push({
        ruleId: rule.id,
        field: "operator",
        message: `Operator "${rule.operator}" is not allowed`,
      })
    }

    // Validate value
    const needsValue = !["is_empty", "is_not_empty"].includes(rule.operator)
    if (needsValue && (rule.value === undefined || rule.value === "")) {
      warnings.push({
        ruleId: rule.id,
        field: "value",
        message: "Value is recommended for this operator",
      })
    }

    // Type validation
    if (rule.field && rule.value !== undefined && rule.value !== "") {
      const isNumericField = ["value", "guestRating", "internalRating", "order"].includes(
        rule.field
      )
      const isNumericOperator = [
        "greater_than",
        "less_than",
        "greater_than_or_equal",
        "less_than_or_equal",
      ].includes(rule.operator)

      if (isNumericOperator && !isNumericField) {
        warnings.push({
          ruleId: rule.id,
          field: "operator",
          message: "Numeric operator used on non-numeric field",
        })
      }

      if (isNumericField && isNaN(Number(rule.value))) {
        warnings.push({
          ruleId: rule.id,
          field: "value",
          message: "Expected numeric value for this field",
        })
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Optimize rules (remove redundant, merge similar)
 */
export function optimizeRules(rules: FilterRule[]): FilterRule[] {
  const optimized: FilterRule[] = []
  const seen = new Set<string>()

  for (const rule of rules) {
    // Create a unique key for the rule
    const key = `${rule.field}:${rule.operator}:${rule.value}`

    // Skip duplicates
    if (seen.has(key)) continue

    seen.add(key)
    optimized.push(rule)
  }

  return optimized
}

/**
 * Get matched item count without filtering
 */
export function countMatchedItems(
  items: CollectionItem[],
  rules: FilterRule[],
  config: RuleEngineConfig = {}
): number {
  if (!rules || rules.length === 0) return items.length
  return applyFilterRules(items, rules, config).length
}

/**
 * Test a single rule against items
 */
export function testRule(
  items: CollectionItem[],
  rule: FilterRule,
  config: RuleEngineConfig = {}
): {
  matchedCount: number
  matchedItems: CollectionItem[]
  percentage: number
} {
  const matched = applyFilterRules(items, [rule], config)

  return {
    matchedCount: matched.length,
    matchedItems: matched,
    percentage: items.length > 0 ? (matched.length / items.length) * 100 : 0,
  }
}

/**
 * Explain how a rule would apply to items
 */
export function explainRule(rule: FilterRule): string {
  const operatorText: Record<string, string> = {
    equals: "equals",
    not_equals: "does not equal",
    contains: "contains",
    not_contains: "does not contain",
    starts_with: "starts with",
    ends_with: "ends with",
    is_empty: "is empty",
    is_not_empty: "is not empty",
    greater_than: "is greater than",
    less_than: "is less than",
    greater_than_or_equal: "is greater than or equal to",
    less_than_or_equal: "is less than or equal to",
    in: "is in",
    not_in: "is not in",
  }

  const operator = operatorText[rule.operator] || rule.operator
  const needsValue = !["is_empty", "is_not_empty"].includes(rule.operator)

  if (needsValue) {
    return `Field "${rule.field}" ${operator} "${rule.value}"`
  } else {
    return `Field "${rule.field}" ${operator}`
  }
}

/**
 * Get field suggestions based on item schema
 */
export function getFieldSuggestions(items: CollectionItem[]): string[] {
  if (items.length === 0) return DEFAULT_CONFIG.allowedFields

  const fields = new Set<string>()

  // Analyze first few items to get all possible fields
  items.slice(0, 10).forEach((item) => {
    Object.keys(item).forEach((key) => {
      fields.add(key)
    })
  })

  return Array.from(fields).sort()
}

/**
 * Get operator suggestions for a field
 */
export function getOperatorSuggestions(field: string, items: CollectionItem[]): string[] {
  if (items.length === 0) return DEFAULT_CONFIG.allowedOperators as string[]

  const sampleValue = items[0]?.[field as keyof CollectionItem]

  if (typeof sampleValue === "string") {
    return [
      "equals",
      "not_equals",
      "contains",
      "not_contains",
      "starts_with",
      "ends_with",
      "is_empty",
      "is_not_empty",
    ]
  }

  if (typeof sampleValue === "number") {
    return [
      "equals",
      "not_equals",
      "greater_than",
      "less_than",
      "greater_than_or_equal",
      "less_than_or_equal",
    ]
  }

  if (typeof sampleValue === "boolean") {
    return ["equals", "not_equals"]
  }

  if (Array.isArray(sampleValue)) {
    return ["contains", "not_contains", "in", "not_in", "is_empty", "is_not_empty"]
  }

  return DEFAULT_CONFIG.allowedOperators as string[]
}

