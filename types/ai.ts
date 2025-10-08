/**
 * AI Types
 * Used for AI Assistant, commands, and suggestions
 */

export interface AIMessage {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: Date
  metadata?: AIMessageMetadata
}

export interface AIMessageMetadata {
  command?: string
  parameters?: Record<string, any>
  result?: any
  thinking?: string[]
  suggestions?: string[]
  canRegenerate?: boolean
}

export interface AICommand {
  name: string
  aliases?: string[]
  description: string
  parameters: AICommandParameter[]
  category: AICommandCategory
  examples?: string[]
  execute: (context: AICommandContext, params: Record<string, any>) => Promise<AICommandResult>
}

export interface AICommandParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  required?: boolean
  description?: string
  default?: any
  validation?: (value: any) => boolean
}

export type AICommandCategory =
  | 'generation'
  | 'optimization'
  | 'analysis'
  | 'modification'
  | 'export'
  | 'utility'

export interface AICommandContext {
  collectionId: string
  userId: string
  sessionId?: string
  history?: AIMessage[]
}

export interface AICommandResult {
  success: boolean
  message: string
  data?: any
  suggestions?: string[]
  followUpActions?: AIFollowUpAction[]
}

export interface AIFollowUpAction {
  label: string
  command: string
  icon?: string
  description?: string
}

export interface AISuggestion {
  id: string
  type: AISuggestionType
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionable: boolean
  action?: {
    label: string
    command: string
    parameters?: Record<string, any>
  }
  metadata?: Record<string, any>
}

export type AISuggestionType =
  | 'add_items'
  | 'remove_items'
  | 'optimize_rules'
  | 'rename'
  | 'categorize'
  | 'detect_duplicate'
  | 'missing_data'
  | 'performance'
  | 'organization'

export interface AIInsight {
  id: string
  category: 'trend' | 'anomaly' | 'opportunity' | 'warning' | 'info'
  title: string
  description: string
  confidence: number // 0-1
  data?: any
  visualizations?: AIVisualization[]
}

export interface AIVisualization {
  type: 'chart' | 'table' | 'metric'
  data: any
  config?: Record<string, any>
}

export interface AISession {
  id: string
  collectionId: string
  userId: string
  startedAt: Date
  endedAt?: Date
  messages: AIMessage[]
  commands: string[]
  summary?: string
}


