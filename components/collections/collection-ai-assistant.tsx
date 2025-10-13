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
}

/**
 * AI асистент для колекцій - sidebar з чатом та інсайтами
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
}: CollectionAIAssistantProps) {
  const { getCollectionById, getCollectionStats } = useCollections()
  const { toast } = useToast()

  const collection = getCollectionById(collectionId)
  const stats = getCollectionStats(collectionId)

  // AI message processing
  const handleAIMessage = (message: string) => {
    // Simple AI message handling
    console.log('AI message:', message)
  }

  if (!collection) return null

  // Initial messages for chat
  const initialMessages = [
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
          {/* AI Welcome Message */}
          <div className="px-6 py-4 bg-muted/30 border-b">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Hi! I'm your AI assistant for "{collection.name}". How can I help you today?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Analyze collection
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Suggest rules
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Show stats
                </Button>
              </div>
            </div>
          </div>

          {/* AI Chat */}
          <div className="border-t h-[400px]">
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

