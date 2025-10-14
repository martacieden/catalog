"use client"

import * as React from "react"
import { Collection, CollectionAIInsight } from "@/types/collection"
import { useCollections } from "@/contexts/collections-context"
import { AIChat } from "@/components/ai-chat"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Sparkles,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CollectionAIAssistantProps {
  collectionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItems?: () => void
  onSyncNow?: () => void
  onAnalyze?: () => void
  onSuggestRules?: () => void
  onExport?: () => void
  initialInsightData?: any
}

/**
 * AI assistant for collections - sidebar with chat and insights
 */
export function CollectionAIAssistant({
  collectionId,
  open,
  onOpenChange,
  onAddItems,
  onSyncNow,
  onAnalyze,
  onSuggestRules,
  onExport,
  initialInsightData,
}: CollectionAIAssistantProps) {
  const { getCollectionById, getCollectionStats } = useCollections()
  const { toast } = useToast()

  const collection = getCollectionById(collectionId)
  const stats = getCollectionStats(collectionId)
  const [showInsightDetails, setShowInsightDetails] = React.useState(false)

  // Show insight details when initialInsightData is provided
  React.useEffect(() => {
    if (initialInsightData && open) {
      setShowInsightDetails(true)
    } else {
      setShowInsightDetails(false)
    }
  }, [initialInsightData, open])

  // AI message processing
  const handleAIMessage = (message: string) => {
    // Simple AI message handling
    console.log('AI message:', message)
  }

  if (!collection) return null

  // Initial messages for chat - welcome message as first chat message
  const initialMessages = showInsightDetails && initialInsightData ? [
    {
      id: "insight-details",
      type: "ai" as const,
      content: `I've analyzed your collection and found an important insight: **${initialInsightData.title}**

${initialInsightData.aiDetails?.description || initialInsightData.message}

**Affected Assets:** ${initialInsightData.aiDetails?.items?.length || 0} items
**Recommendations:** ${initialInsightData.aiDetails?.recommendations?.length || 0} suggestions

How would you like me to help you address this issue?`,
      timestamp: new Date(),
      suggestions: [
        "Create task",
        "View related docs",
        "Contact team",
        "Schedule maintenance",
      ],
    },
  ] : [
    {
      id: "welcome",
      type: "ai" as const,
      content: `Hi! I'm your AI assistant for "${collection.name}". How can I help you today?`,
      timestamp: new Date(),
      suggestions: [
        "Analyze collection",
        "Suggest rules", 
        "Show stats",
      ],
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <SheetTitle>AI Assistant</SheetTitle>
                <SheetDescription>{collection.name}</SheetDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* AI Chat */}
          <div className="flex-1">
            <AIChat
              onMessage={handleAIMessage}
              initialMessages={initialMessages}
              placeholder="Ask about your collection..."
              className="h-full"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

