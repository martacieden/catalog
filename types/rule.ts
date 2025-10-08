/**
 * Rule Engine Types
 * Used for filtering, automation, and smart collections
 */

export interface FilterRule {
  id: string
  field: string
  operator: FilterOperator
  value: string | number | boolean | string[]
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'in'
  | 'not_in'

export interface JSONLogicRule {
  operator: 'and' | 'or' | 'not'
  conditions: Condition[]
}

export interface Condition {
  field: string
  operator: FilterOperator
  value: any
}

export interface RuleTemplate {
  id: string
  name: string
  description: string
  category: string
  rules: FilterRule[]
  icon?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings?: ValidationWarning[]
}

export interface ValidationError {
  ruleId: string
  field: string
  message: string
}

export interface ValidationWarning {
  ruleId: string
  field: string
  message: string
}

export interface RuleEngineConfig {
  maxConditions?: number
  allowedFields?: string[]
  allowedOperators?: FilterOperator[]
  caseSensitive?: boolean
}


