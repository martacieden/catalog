"use client"

import * as React from "react"
import { Collection, AIInsight } from "@/types/collection"
import { useCollections } from "@/contexts/collections-context"
import { generateInsights, generateQuickActions, generateContextualResponse } from "@/lib/ai-insights-generator"
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sparkles,
  X,
  Lightbulb,
  AlertCircle,
  Info,
  CheckCircle,
  Plus,
  RefreshCw,
  BarChart,
  Download,
  TrendingUp,
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

  // Генерація інсайтів
  const insights = React.useMemo(() => {
    if (!collection) return []
    return generateInsights(collection, stats)
  }, [collection, stats])

  // Генерація швидких дій
  const quickActions = React.useMemo(() => {
    if (!collection) return []
    return generateQuickActions(collection)
  }, [collection])

  // Обробка повідомлень від AI
  const handleAIMessage = (message: string) => {
    // Логіка обробки повідомлень
    console.log("AI Message:", message)
  }

  const handleInsightAction = (insight: AIInsight) => {
    if (insight.onAction) {
      insight.onAction()
    } else {
      // Дефолтні дії на основі типу інсайту
      switch (insight.id) {
        case "enable-autosync":
          // TODO: Enable auto-sync
          toast({
            title: "Функція в розробці",
            description: "Цей функціонал буде доступний найближчим часом",
          })
          break
        case "add-rules":
          onSuggestRules?.()
          break
        case "empty-collection":
        case "few-items":
          onAddItems?.()
          break
        default:
          break
      }
    }
  }

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "add-items":
        onAddItems?.()
        break
      case "sync-now":
        onSyncNow?.()
        break
      case "analyze":
        onAnalyze?.()
        break
      case "suggest-rules":
        onSuggestRules?.()
        break
      case "export":
        onExport?.()
        break
      default:
        toast({
          title: "Функція в розробці",
          description: "Цей функціонал буде доступний найближчим часом",
        })
    }
  }

  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-yellow-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getInsightBgColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "suggestion":
        return "bg-yellow-50 border-yellow-200"
      case "warning":
        return "bg-orange-50 border-orange-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "success":
        return "bg-green-50 border-green-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getActionIcon = (iconName: string) => {
    const icons = {
      Plus,
      RefreshCw,
      BarChart,
      Sparkles,
      Download,
    }
    const IconComponent = icons[iconName as keyof typeof icons] || Plus
    return <IconComponent className="h-4 w-4" />
  }

  if (!collection) return null

  // Підготовка початкових повідомлень для чату
  const initialMessages = [
    {
      id: "welcome",
      type: "ai" as const,
      content: `Вітаю! Я AI асистент для колекції "${collection.name}". Я можу допомогти вам проаналізувати колекцію, запропонувати правила для автоматичного наповнення, знайти та додати нові елементи. Як я можу допомогти?`,
      timestamp: new Date(),
      suggestions: [
        "Проаналізувати колекцію",
        "Запропонувати правила",
        "Показати статистику",
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
                <SheetTitle>AI Асистент</SheetTitle>
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
          {/* Collection Stats */}
          <div className="px-6 py-4 bg-muted/30 border-b">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold">{collection.itemCount}</div>
                <div className="text-xs text-muted-foreground">Елементів</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {collection.filters?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Правил</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {stats?.itemsByCategory
                    ? Object.keys(stats.itemsByCategory).length
                    : 0}
                </div>
                <div className="text-xs text-muted-foreground">Категорій</div>
              </div>
            </div>
            
            {/* Auto-sync status */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge
                variant={collection.autoSync ? "default" : "secondary"}
                className={collection.autoSync ? "bg-green-500" : ""}
              >
                {collection.autoSync ? "Автосинхронізація увімкнена" : "Автосинхронізація вимкнена"}
              </Badge>
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-4">
              {/* Insights */}
              {insights.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Інсайти та рекомендації
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {insights.map((insight) => (
                      <div
                        key={insight.id}
                        className={`p-3 border rounded-lg ${getInsightBgColor(insight.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5">{getInsightIcon(insight.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium mb-1">{insight.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {insight.description}
                            </p>
                            {insight.actionLabel && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => handleInsightAction(insight)}
                              >
                                {insight.actionLabel}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Швидкі дії
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Часто використовувані операції з колекцією
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-auto py-2 px-3"
                      onClick={() => handleQuickAction(action.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="shrink-0">{getActionIcon(action.icon)}</div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{action.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          {/* AI Chat */}
          <div className="border-t h-[400px]">
            <AIChat
              onMessage={handleAIMessage}
              initialMessages={initialMessages}
              placeholder="Запитайте про колекцію..."
              className="h-full"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

