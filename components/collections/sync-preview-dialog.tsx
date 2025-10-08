"use client"

import * as React from "react"
import { SyncPreview, CollectionItem } from "@/types/collection"
import { useCollections } from "@/contexts/collections-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  RefreshCw,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Building2,
  Car,
  Plane,
  Ship,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCategoryColor } from "@/lib/collection-utils"

interface SyncPreviewDialogProps {
  collectionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void
}

/**
 * Діалог для попереднього перегляду синхронізації
 */
export function SyncPreviewDialog({
  collectionId,
  open,
  onOpenChange,
  onConfirm,
}: SyncPreviewDialogProps) {
  const { getCollectionById, previewSync, syncCollection } = useCollections()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const collection = getCollectionById(collectionId)
  const preview = previewSync(collectionId)

  const handleSync = async () => {
    if (!preview) return

    setIsLoading(true)
    try {
      await syncCollection(collectionId)
      
      toast({
        title: "Синхронізація завершена",
        description: `Додано: ${preview.changes.added}, Видалено: ${preview.changes.removed}`,
      })

      onConfirm?.()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Помилка синхронізації",
        description: "Не вдалося синхронізувати колекцію. Спробуйте ще раз.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getItemIcon = (type: string) => {
    const icons = {
      Properties: Building2,
      Vehicles: Car,
      Aviation: Plane,
      Maritime: Ship,
    }
    const IconComponent = icons[type as keyof typeof icons] || Building2
    return <IconComponent className="h-4 w-4" />
  }

  const renderItemList = (items: CollectionItem[], type: "add" | "remove") => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Немає елементів для {type === "add" ? "додавання" : "видалення"}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-4 border rounded-lg ${
              type === "add" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            {/* Icon */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                type === "add" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {getItemIcon(item.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{item.name}</span>
                {item.idCode && (
                  <Badge variant="outline" className="text-xs font-mono shrink-0">
                    {item.idCode}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={`text-xs ${getCategoryColor(item.category)}`}
                >
                  {item.category}
                </Badge>
                {item.status && (
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                )}
              </div>
            </div>

            {/* Action Icon */}
            <div className={type === "add" ? "text-green-600" : "text-red-600"}>
              {type === "add" ? (
                <Plus className="h-5 w-5" />
              ) : (
                <Minus className="h-5 w-5" />
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!collection || !preview) {
    return null
  }

  const hasChanges = preview.changes.added > 0 || preview.changes.removed > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Попередній перегляд синхронізації</DialogTitle>
              <DialogDescription>
                Перегляньте зміни перед застосуванням для "{collection.name}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Статистика змін */}
        <div className="px-6 py-4 bg-muted/30 border-b">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{preview.currentCount}</div>
              <div className="text-xs text-muted-foreground">Поточна кількість</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{preview.changes.added}</div>
              <div className="text-xs text-muted-foreground">Буде додано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">-{preview.changes.removed}</div>
              <div className="text-xs text-muted-foreground">Буде видалено</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{preview.newCount}</div>
              <div className="text-xs text-muted-foreground">Нова кількість</div>
            </div>
          </div>
        </div>

        {/* Вкладки з елементами */}
        <Tabs defaultValue="added" className="flex-1 flex flex-col min-h-0">
          <TabsList className="px-6 border-b w-full justify-start rounded-none h-auto p-0">
            <TabsTrigger
              value="added"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Додати ({preview.changes.added})
            </TabsTrigger>
            <TabsTrigger
              value="removed"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <Minus className="h-4 w-4 mr-2" />
              Видалити ({preview.changes.removed})
            </TabsTrigger>
            <TabsTrigger
              value="unchanged"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Без змін ({preview.changes.unchanged})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="added" className="flex-1 overflow-auto px-6 py-4 m-0">
            <ScrollArea className="h-full">
              {renderItemList(preview.itemsToAdd, "add")}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="removed" className="flex-1 overflow-auto px-6 py-4 m-0">
            <ScrollArea className="h-full">
              {renderItemList(preview.itemsToRemove, "remove")}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unchanged" className="flex-1 overflow-auto px-6 py-4 m-0">
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {preview.changes.unchanged} елементів залишаться в колекції
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Попередження якщо немає змін */}
        {!hasChanges && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Немає змін для синхронізації</p>
                <p className="text-blue-700 text-xs mt-1">
                  Колекція вже синхронізована з поточними правилами
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSync} disabled={!hasChanges || isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Синхронізація..." : "Застосувати зміни"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

